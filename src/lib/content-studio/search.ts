/**
 * Topic research — the only networked step. Calls the server search route, which
 * uses the project's Claude API key with web search. On any failure it falls
 * back to a deterministic, KLLCTRS-themed offline generator so the studio always
 * works, with or without a working API key.
 */
import { CORE_HASHTAGS, HOBBY_HASHTAGS, type ContentType } from "./kllctrs-context";
import type { Audience, ContentResearch, Tone } from "./types";

export interface ResearchArgs {
  topic: string;
  contentType: ContentType;
  audience: Audience;
  tone: Tone;
}

export async function researchTopic(args: ResearchArgs): Promise<ContentResearch> {
  try {
    const res = await fetch("/api/content-studio/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.ok && data.research) {
        return data.research as ContentResearch;
      }
    }
  } catch {
    // fall through to offline
  }
  return offlineResearch(args);
}

/** Deterministic, KLLCTRS-themed fallback (no network, no keys). */
export function offlineResearch({ topic, contentType }: ResearchArgs): ContentResearch {
  const t = topic.trim() || "trading cards";
  const trending = [
    { title: `Why ${t} is trending in the hobby right now`, snippet: "" },
    { title: `The ${t} mistake new collectors make`, snippet: "" },
    { title: `${t}: what it means for your collection`, snippet: "" },
    { title: `Is ${t} worth it in 2026?`, snippet: "" },
    { title: `${t} — collectors are split on this`, snippet: "" },
  ].map((x) => ({ title: x.title, snippet: x.snippet, url: "", source: "offline" }));

  const tokenTags = t.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map((w) => `#${w}`);
  const hashtags = Array.from(
    new Set([...CORE_HASHTAGS, ...(HOBBY_HASHTAGS[contentType] ?? []), ...tokenTags]),
  ).slice(0, 10);

  return {
    trending,
    stats: [
      { label: "hobby market size", value: "$30", unit: "B+" },
      { label: "collectors on KLLCTRS", value: "25", unit: "K+" },
      { label: "YoY interest growth", value: "40", unit: "%" },
    ],
    keyPoints: [
      `What ${t} means for everyday collectors`,
      `How ${t} is shaping the trading card market`,
      `The best way to get in on ${t} today`,
      `Common misconceptions about ${t}`,
      `How KLLCTRS makes ${t} easier to track`,
      `Where ${t} is heading next in the hobby`,
    ],
    hashtags,
    relatedTopics: [
      `${t} values`,
      `graded ${t}`,
      `${t} for beginners`,
      `${t} vs vintage`,
      `top ${t} cards`,
    ],
    source: "offline",
  };
}
