import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { SYSTEM_PROMPT } from "@/AI integration/prompts/system";
import { ai, GEMINI_MODEL } from "@/AI integration/config";
import type { Content, Part } from "@google/genai";
import { tools } from "@/AI integration/tools/definitions";
import { executeTool } from "@/AI integration/tools/executor";
import { buildConversation } from "@/AI integration/history";
import { extractText } from "@/AI integration/parser";

import { buildContext } from "@/AI integration/context-builder";
import { mergeContext } from "@/AI integration/context-merger";
import type { Json } from "@/types/database";

interface ChatSource {
  title: string;
  url: string;
  type: "directory" | "official" | "listing";
}

function toJson(value: unknown): Json {
  const serialized = JSON.stringify(value);
  return serialized === undefined ? null : (JSON.parse(serialized) as Json);
}

function collectSources(tool: string, value: unknown): ChatSource[] {
  if (!value || typeof value !== "object") return [];
  const result = value as Record<string, unknown>;
  const sources: ChatSource[] = [];
  const add = (title: unknown, url: unknown, type: ChatSource["type"]) => {
    const isInternal = typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
    if (typeof title === "string" && typeof url === "string" && (isInternal || /^https?:\/\//i.test(url))) {
      sources.push({ title, url, type });
    }
  };
  const addRecords = (key: string, titleKey: string, urlKey: string, type: ChatSource["type"]) => {
    const records = result[key];
    if (!Array.isArray(records)) return;
    for (const record of records) {
      if (!record || typeof record !== "object") continue;
      const item = record as Record<string, unknown>;
      add(item[titleKey], item[urlKey], type);
      if (key === "events") add(item.name, item.website, "official");
      if (key === "sponsors") {
        add(item.name, item.website, "official");
        add(item.name ? `${String(item.name)} — source` : item.name, item.info_source_url, "official");
        if (Array.isArray(item.upcoming_events)) {
          for (const event of item.upcoming_events) {
            if (event && typeof event === "object") {
              const show = event as Record<string, unknown>;
              add(show.name, show.directory_url, "directory");
            }
          }
        }
      }
    }
  };

  if (tool === "search_events") addRecords("events", "name", "directory_url", "directory");
  if (tool === "search_shops") addRecords("shops", "name", "directory_url", "directory");
  if (tool === "search_sponsors") addRecords("sponsors", "name", "profile_url", "directory");
  if (tool === "search_content") addRecords("articles", "title", "article_url", "directory");
  if (tool === "search_ebay_prices") addRecords("listings", "title", "url", "listing");

  return sources.filter((source, index, all) => all.findIndex((candidate) => candidate.url === source.url) === index).slice(0, 30);
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

export async function handleChatPost(req: NextRequest) {
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
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
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

    const body: unknown = await req.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const payload = body as { message?: unknown; history?: unknown };
    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    const history = Array.isArray(payload.history)
      ? payload.history.slice(-8).flatMap((entry) => {
          if (!entry || typeof entry !== "object") return [];
          const item = entry as { role?: unknown; content?: unknown };
          if ((item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") return [];
          return [{ role: item.role, content: item.content.slice(0, 1500) }];
        })
      : [];

    if (!message) {
      return NextResponse.json(
        {
          error: "Empty message",
        },
        {
          status: 400,
        }
      );
    }
    if (message.length > 1000) return NextResponse.json({ error: "Please keep messages under 1,000 characters." }, { status: 413 });

    //--------------------------------------------------
    // Conversation
    //--------------------------------------------------

    const context =
  buildContext(history);
     const contents: Content[] = buildConversation(
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

      const fnResponses: Part[] = [];

      for (const call of response.functionCalls) {
        if (!call.name) continue;

        const mergedArgs =
  mergeContext(
    call.args ?? {},
    context
  );

const result =
  await executeTool({
    name: call.name,
    args: mergedArgs,
  });

        sources.push(...collectSources(call.name, result.result));

        fnResponses.push({
          functionResponse: {
            name: call.name,
            response: result.result,
          },
        });
      }

      // Gemini tool-call parts may carry a thought_signature needed for the
      // next turn. Keep the provider's original model message intact instead
      // of reconstructing functionCall parts from response.functionCalls.
      const modelMessage = response.candidates?.[0]?.content;
      if (!modelMessage) {
        throw new Error("Gemini returned function calls without the original model content.");
      }
      contents.push(modelMessage);

      contents.push({
        role: "user",
        parts: fnResponses,
      });

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

        sources: toJson(sources),
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
