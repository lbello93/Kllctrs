import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { SYSTEM_PROMPT } from "@/lib/ai/prompts/system";
import { ai, GEMINI_MODEL } from "@/lib/ai/config";
import { tools } from "@/lib/ai/tools/definitions";
import { executeTool } from "@/lib/ai/tools/executor";
import { buildConversation } from "@/lib/ai/history";
import { extractText } from "@/lib/ai/parser";

import { buildContext } from "@/lib/ai/context-builder";
import { mergeContext } from "@/lib/ai/context-merger";

interface ChatSource {
  tool: string;
  args: unknown;
  count: number;
}

// In-memory rate limit: 10 messages per minute per IP.
// Resets on server restart/redeploy, good enough to stop a runaway loop,
// not a substitute for a real store like Redis if abuse becomes frequent.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    //--------------------------------------------------
    // Authentication
    //--------------------------------------------------

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    //--------------------------------------------------
    // Rate limit (per user if logged in, per IP otherwise)
    //--------------------------------------------------

    const rateLimitKey =
      user?.id ??
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: "You're sending messages too quickly. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    //--------------------------------------------------
    // Request
    //--------------------------------------------------

    const {
      message,
      history = [],
    } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        {
          error: "Empty message",
        },
        {
          status: 400,
        }
      );
    }

    //--------------------------------------------------
    // Conversation
    //--------------------------------------------------

    const context =
  buildContext(history);
     const contents = buildConversation(
  message,
  history
);
    //--------------------------------------------------
    // First Gemini Call
    //--------------------------------------------------

    let response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,

        contents,

        config: {
          tools,
          systemInstruction:
            typeof SYSTEM_PROMPT === "function"
              ? SYSTEM_PROMPT(message)
              : SYSTEM_PROMPT,
        },
      });

    //--------------------------------------------------
    // Tool Loop
    //--------------------------------------------------

    const sources: ChatSource[] = [];

    let safety = 0;

    while (
      response.functionCalls &&
      response.functionCalls.length > 0 &&
      safety < 5
    ) {
      safety++;

      const fnResponses: Array<{
        functionResponse: {
          name: string;
          response: unknown;
        };
      }> = [];

      for (const call of response.functionCalls) {
        const mergedArgs =
  mergeContext(
    call.args ?? {},
    context
  );

const result =
  await executeTool({
    ...call,
    args: mergedArgs,
  });

        sources.push({
          tool: call.name,
          args: call.args,
          count: result.count,
        });

        fnResponses.push({
          functionResponse: {
            name: call.name!,
            response: result.result,
          },
        });
      }

      contents.push({
        role: "model",

        parts: response.functionCalls.map(
          (call) => ({
            functionCall: call,
          })
        ),
      } as any);

      contents.push({
        role: "user",
        parts: fnResponses,
      } as any);

      response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,

          contents,

          config: {
            tools,
            systemInstruction:
              typeof SYSTEM_PROMPT ===
              "function"
                ? SYSTEM_PROMPT(message)
                : SYSTEM_PROMPT,
          },
        });
    }

    //--------------------------------------------------
    // Extract Response
    //--------------------------------------------------

    const text =
      extractText(response);

    //--------------------------------------------------
    // Save Conversation
    //--------------------------------------------------

    await supabaseAdmin
      .from("chat_conversations")
      .insert({
        user_id: user?.id ?? null,

        user_message: message,

        bot_response: text,

        sources,
      });

    //--------------------------------------------------
    // Response
    //--------------------------------------------------

    return NextResponse.json({
      response: text,
      sources,
    });
  } catch (error) {
    console.error(
      "[chat] error:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}