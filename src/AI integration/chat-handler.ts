import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { SYSTEM_PROMPT } from "@/AI integration/prompts/system";
import { ai, GEMINI_MODEL } from "@/AI integration/config";
import type { Content, Part } from "@google/genai";
import { tools } from "@/AI integration/tools/definitions";
import { executeTool } from "@/AI integration/tools/executor";
import { buildConversation } from "@/AI integration/history";
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

// In-memory rate limit: 20 messages per hour per user.
// Resets on server restart/redeploy — good enough to stop a runaway loop,
// not a substitute for a shared store (Redis) if abuse becomes frequent.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) {
    requestLog.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const systemInstruction = (message: string) =>
  typeof SYSTEM_PROMPT === "function" ? SYSTEM_PROMPT(message) : SYSTEM_PROMPT;

export async function handleChatPost(req: NextRequest) {
  // ---- Authentication (any signed-in user; not admin-only) ----
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to use the assistant." },
      { status: 401 },
    );
  }

  // ---- Rate limit (per user) ----
  if (isRateLimited(user.id)) {
    return NextResponse.json(
      { error: "You've reached the hourly message limit. Please try again later." },
      { status: 429 },
    );
  }

  // ---- Request ----
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const payload = body as { message?: unknown; conversationId?: unknown; history?: unknown };
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const requestedThreadId =
    typeof payload.conversationId === "string" && UUID_RE.test(payload.conversationId)
      ? payload.conversationId
      : null;
  const history = Array.isArray(payload.history)
    ? payload.history.slice(-8).flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as { role?: unknown; content?: unknown };
        if ((item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") return [];
        return [{ role: item.role, content: item.content.slice(0, 1500) }];
      })
    : [];

  if (!message) return NextResponse.json({ error: "Empty message" }, { status: 400 });
  if (message.length > 1000) {
    return NextResponse.json({ error: "Please keep messages under 1,000 characters." }, { status: 413 });
  }

  // ---- Resolve or create the conversation thread (owned by this user) ----
  let threadId = requestedThreadId;
  if (threadId) {
    const { data: owned } = await supabaseAdmin
      .from("chat_threads")
      .select("id")
      .eq("id", threadId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!owned) threadId = null;
  }

  let threadTitle: string | null = null;
  if (!threadId) {
    threadTitle = message.slice(0, 60);
    const { data: created, error: threadError } = await supabaseAdmin
      .from("chat_threads")
      .insert({ user_id: user.id, title: threadTitle })
      .select("id,title")
      .single();
    if (threadError || !created) {
      return NextResponse.json({ error: "Could not start the conversation." }, { status: 500 });
    }
    threadId = created.id;
    threadTitle = created.title;
  }

  // Persist the user's message immediately.
  await supabaseAdmin
    .from("chat_messages")
    .insert({ thread_id: threadId, role: "user", content: message });

  // ---- RAG tool loop (non-streaming) to resolve data lookups + sources ----
  const context = buildContext(history);
  const contents: Content[] = buildConversation(message, history);
  const sources: ChatSource[] = [];

  try {
    let response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: { tools, systemInstruction: systemInstruction(message), maxOutputTokens: 800 },
    });

    let safety = 0;
    while (response.functionCalls && response.functionCalls.length > 0 && safety < 5) {
      safety++;
      const fnResponses: Part[] = [];
      for (const call of response.functionCalls) {
        if (!call.name) continue;
        const mergedArgs = mergeContext(call.args ?? {}, context);
        const result = await executeTool({ name: call.name, args: mergedArgs });
        sources.push(...collectSources(call.name, result.result));
        fnResponses.push({ functionResponse: { name: call.name, response: result.result } });
      }
      const modelMessage = response.candidates?.[0]?.content;
      if (!modelMessage) throw new Error("Gemini returned function calls without model content.");
      contents.push(modelMessage);
      contents.push({ role: "user", parts: fnResponses });
      response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: { tools, systemInstruction: systemInstruction(message), maxOutputTokens: 800 },
      });
    }

    const dedupedSources = sources
      .filter((s, i, all) => all.findIndex((c) => c.url === s.url) === i)
      .slice(0, 30);

    // ---- Stream the final synthesis from the accumulated context ----
    // No tools on this call, so the model produces the answer (streamed) from
    // the tool outputs already present in `contents`.
    const encoder = new TextEncoder();
    const resolvedThreadId = threadId;
    const line = (obj: unknown) => encoder.encode(JSON.stringify(obj) + "\n");

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(line({ type: "meta", threadId: resolvedThreadId, title: threadTitle }));

        let finalText = "";
        try {
          const modelStream = await ai.models.generateContentStream({
            model: GEMINI_MODEL,
            contents,
            config: { systemInstruction: systemInstruction(message), maxOutputTokens: 800 },
          });
          for await (const chunk of modelStream) {
            const token = chunk.text;
            if (token) {
              finalText += token;
              controller.enqueue(line({ type: "token", value: token }));
            }
          }
        } catch (streamError) {
          console.error("[chat] stream error:", streamError);
          if (!finalText) {
            controller.enqueue(line({ type: "error", message: "The assistant could not respond. Please try again." }));
            controller.close();
            return;
          }
        }

        controller.enqueue(line({ type: "sources", sources: dedupedSources }));

        // Persist the assistant message once the full answer is known.
        await supabaseAdmin
          .from("chat_messages")
          .insert({
            thread_id: resolvedThreadId,
            role: "assistant",
            content: finalText,
            sources: toJson(dedupedSources),
          });
        await supabaseAdmin
          .from("chat_threads")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", resolvedThreadId);

        controller.enqueue(line({ type: "done" }));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[chat] error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
