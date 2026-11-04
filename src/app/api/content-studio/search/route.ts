import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import { contentTypeMeta, type ContentType } from "@/lib/content-studio/kllctrs-context";
import type { ContentResearch, Stat } from "@/lib/content-studio/types";

export const runtime = "nodejs";
export const maxDuration = 120;

// Research returns a small JSON payload, so use the cheapest capable model.
// Dedicated env var so this stays decoupled from the classic generator's model.
const MODEL = process.env.CONTENT_STUDIO_SEARCH_MODEL || "claude-haiku-4-5-20251001";
// The project standard is ANTHROPIC_API_KEY; accept the spec's aliases too.
const CLAUDE_KEY =
  process.env.ANTHROPIC_API_KEY ||
  process.env.CLAUDE_API_KEY ||
  process.env.NEXT_PUBLIC_CLAUDE_API_KEY;

function searchPrompt(topic: string, contentType: ContentType): string {
  const meta = contentTypeMeta(contentType);
  return `You are a social media strategist for KLLCTRS, a trading card collector platform.

Research trending content about: "${topic}"
Context: ${meta.name} — ${meta.description}. Targeting trading card collectors and hobby enthusiasts.

Find:
1. 5 trending angles/hooks getting engagement in the trading card / collector community right now
2. 3-5 compelling statistics about the trading card market, hobby, or this specific topic
3. 6 key talking points for social media posts
4. 10 relevant hashtags (mix: #tradingcards #KLLCTRS + niche tags)
5. 5 related trending topics in the collector space

Return ONLY valid JSON (no prose, no markdown fences) with this exact shape:
{
  "trending": [{"title": "", "snippet": "", "url": "", "source": ""}],
  "stats": [{"label": "", "value": "", "unit": ""}],
  "keyPoints": [""],
  "hashtags": [""],
  "relatedTopics": [""]
}`;
}

/** Pull the first balanced JSON object out of a model response. */
function extractJson(text: string): unknown | null {
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function asStats(raw: unknown): Stat[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      const o = s as Record<string, unknown>;
      return {
        label: String(o.label ?? "").trim(),
        value: String(o.value ?? "").trim(),
        unit: o.unit ? String(o.unit).trim() : undefined,
      };
    })
    .filter((s) => s.label && s.value);
}

function asStrings(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x).trim()).filter(Boolean);
}

function normalize(data: Record<string, unknown>): ContentResearch {
  const trending = Array.isArray(data.trending)
    ? (data.trending as Record<string, unknown>[])
        .map((t) => ({
          title: String(t.title ?? "").trim(),
          snippet: String(t.snippet ?? "").trim(),
          url: String(t.url ?? "").trim(),
          source: String(t.source ?? "").trim(),
        }))
        .filter((t) => t.title)
    : [];
  return {
    trending,
    stats: asStats(data.stats),
    keyPoints: asStrings(data.keyPoints),
    hashtags: asStrings(data.hashtags).map((h) => (h.startsWith("#") ? h : `#${h}`)),
    relatedTopics: asStrings(data.relatedTopics),
    source: "claude",
  };
}

async function viaClaude(topic: string, contentType: ContentType): Promise<ContentResearch | null> {
  if (!CLAUDE_KEY) return null;
  try {
    const client = new Anthropic({ apiKey: CLAUDE_KEY, timeout: 100_000 });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
      messages: [{ role: "user", content: searchPrompt(topic, contentType) }],
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const parsed = extractJson(text);
    if (!parsed || typeof parsed !== "object") return null;
    return normalize(parsed as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: { topic?: unknown; contentType?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const contentType = (typeof body.contentType === "string" ? body.contentType : "community") as ContentType;
  if (!topic) {
    return NextResponse.json({ error: "topic is required." }, { status: 400 });
  }

  const research = await viaClaude(topic, contentType);
  if (research && (research.keyPoints.length || research.trending.length)) {
    return NextResponse.json({ ok: true, research });
  }
  // Signal the client to use its offline fallback.
  return NextResponse.json({ ok: false });
}
