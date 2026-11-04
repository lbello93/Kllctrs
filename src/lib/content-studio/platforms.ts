/**
 * KLLCTRS-themed, platform-optimized social post generators — 100% client-side.
 * Every post is anchored to trading cards, collecting, events or the hobby.
 */
import {
  CORE_HASHTAGS,
  HOBBY_HASHTAGS,
  HOOKS,
  KLLCTRS_CTAS,
} from "./kllctrs-context";
import type { PlatformId, PlatformPost, Stat, StudioInput } from "./types";

// --------------------------------------------------------------------------- //
// Hooks (content-type aware) + token filling
// --------------------------------------------------------------------------- //
function daysUntil(date?: string): string {
  if (!date) return "a few";
  const ms = new Date(date).getTime();
  if (Number.isNaN(ms)) return "a few";
  const d = Math.max(0, Math.ceil((ms - Date.now()) / 86_400_000));
  return String(d);
}

/** Fill hook/template tokens from input; never leave a literal {token}. */
function fillTokens(text: string, input: StudioInput): string {
  const map: Record<string, string> = {
    event: input.eventName || input.topic,
    location: input.location || "a city near you",
    vendors: input.vendorCount || "50",
    set: input.cardSet || input.topic,
    days: daysUntil(input.date),
    topic: input.topic,
  };
  return text
    .replace(/\{(\w+)\}/g, (_, k: string) => map[k] ?? input.topic)
    .trim();
}

export function hook(input: StudioInput): string {
  const bank = HOOKS[input.contentType] ?? HOOKS["community"];
  return fillTokens(bank[0], input);
}

// --------------------------------------------------------------------------- //
// Hashtags — KLLCTRS core + content-type staples + topic-derived.
// --------------------------------------------------------------------------- //
const GENERIC_MID = ["explained", "tips", "guide", "basics", "trends", "community"];

function tokens(topic: string): string[] {
  return topic.toLowerCase().split(/[^a-z0-9]+/i).filter((w) => w.length > 1);
}
function camel(words: string[]): string {
  if (!words.length) return "";
  return words[0].toLowerCase() + words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1)).join("");
}

export function hashtags(input: StudioInput, count: number): string[] {
  if (count <= 0) return [];
  const tk = tokens(input.topic);
  const base = tk.join("");
  const camelBase = camel(tk);

  const generated: string[] = [];
  if (base) {
    generated.push(base);
    for (const s of GENERIC_MID) generated.push(base + s);
    generated.push(camelBase + "Collectors", base + "cards");
  }

  const ordered = [
    ...CORE_HASHTAGS,
    ...(HOBBY_HASHTAGS[input.contentType] ?? []),
    ...generated,
    "#sportscards", "#pokemoncards", "#cardcollecting", "#hobby",
    "#cardshow", "#gradedcards", "#collectorslife",
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ordered) {
    const c = "#" + raw.replace(/[^a-z0-9]/gi, "");
    if (c === "#") continue;
    const key = c.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= count) break;
  }
  return out;
}

// --------------------------------------------------------------------------- //
// Helpers
// --------------------------------------------------------------------------- //
function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, Math.max(0, limit - 1)).trimEnd() + "…";
}
function statLine(s: Stat): string {
  const unit = s.unit ? ` ${s.unit}` : "";
  return `${s.value}${unit} ${s.label}`;
}

// --------------------------------------------------------------------------- //
// Per-platform generators
// --------------------------------------------------------------------------- //
function instagram(input: StudioInput): PlatformPost {
  const { keyPoints, stats } = input;
  const h = hook(input);
  const tags = input.hashtags.length ? input.hashtags.slice(0, 30) : hashtags(input, 25);

  const parts = [h, ""];
  for (const p of keyPoints.slice(0, 5)) parts.push(`→ ${p}`);
  if (stats.length) parts.push("", "📊 " + stats.slice(0, 3).map(statLine).join("  ·  "));
  parts.push("", `${KLLCTRS_CTAS.save}  ·  ${KLLCTRS_CTAS.follow}`, "", tags.join(" "));

  let text = parts.join("\n");
  if (text.length > 2200) text = truncate(text, 2200);
  return {
    platform: "instagram",
    label: "Instagram",
    text,
    preview: text.slice(0, 125),
    meta: `${text.length} chars · ${tags.length} hashtags`,
  };
}

function x(input: StudioInput): PlatformPost {
  const { keyPoints, stats } = input;
  const tweets: string[] = [];
  tweets.push(truncate(`${hook(input)} 🧵👇`, 280));

  const roomForPoints = 10 - 1 - (stats.length ? 1 : 0) - 1;
  const points = keyPoints.slice(0, Math.max(0, Math.min(7, roomForPoints)));
  points.forEach((p, i) => tweets.push(truncate(`${i + 1}/ ${p}`, 280)));

  if (stats.length) {
    const lines = ["📊 By the numbers:"];
    for (const s of stats.slice(0, 4)) lines.push(`• ${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`);
    tweets.push(truncate(lines.join("\n"), 280));
  }
  if (tweets.length < 4) {
    tweets.push(truncate(`Why it matters for collectors: ${input.topic} is shaping the hobby right now.`, 280));
  }
  tweets.push(truncate(`That's the thread. Follow ${"@kllctrs"} for card drops, events and market moves. ♻️ Repost tweet 1 to share.`, 280));

  const capped = tweets.slice(0, 10);
  return {
    platform: "x",
    label: "X (Twitter)",
    text: capped.join("\n\n— — —\n\n"),
    preview: capped[0],
    meta: `${capped.length} tweets`,
    segments: capped,
  };
}

function linkedin(input: StudioInput): PlatformPost {
  const { keyPoints, stats } = input;
  const opening = `The trading card hobby is having a real moment — and ${input.topic} is part of why. Here's what stands out:`;
  const parts = [opening, ""];
  for (const p of keyPoints.slice(0, 5)) parts.push(`• ${p}`);
  if (stats.length) {
    parts.push("", "The numbers behind it:");
    for (const s of stats.slice(0, 4)) parts.push(`→ ${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`);
  }
  parts.push(
    "",
    `We're building KLLCTRS to make collecting, trading and finding events easier. How are you thinking about ${input.topic}?`,
    "",
    ["#tradingcards", "#collectibles", "#KLLCTRS", "#hobbyeconomy", "#sportscards"].join(" "),
  );
  let text = parts.join("\n");
  if (text.length > 3000) text = truncate(text, 3000);
  return {
    platform: "linkedin",
    label: "LinkedIn",
    text,
    preview: text.split("\n").filter(Boolean).slice(0, 2).join(" "),
    meta: `${text.length} chars`,
  };
}

function youtube(input: StudioInput): PlatformPost {
  const { keyPoints, stats } = input;
  let title = `${input.topic} — KLLCTRS`;
  if (title.length >= 60) title = truncate(`${input.topic}`, 50) + " — KLLCTRS";
  if (title.length >= 60) title = truncate(title, 59);

  const lines = [
    `${input.topic} for trading card collectors — what it is, why it matters, and how to make the most of it with KLLCTRS.`,
    "", "🔑 KEY POINTS",
  ];
  for (const p of keyPoints.slice(0, 6)) lines.push(`• ${p}`);
  if (stats.length) {
    lines.push("", "📊 MARKET STATS");
    for (const s of stats.slice(0, 5)) lines.push(`• ${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`);
  }
  lines.push("", "⏱️ TIMESTAMPS", "0:00 Intro", "0:05 The breakdown", "0:12 By the numbers", "0:18 Collect on KLLCTRS");
  lines.push("", `🔔 Subscribe & join KLLCTRS at ${"https://kllctrs.com"}`, "");
  const tags = hashtags(input, 10);
  lines.push(tags.join(" "));

  const description = lines.join("\n");
  const text = `TITLE (${title.length} chars):\n${title}\n\nDESCRIPTION:\n${description}\n\nTAGS:\n${tags.map((t) => t.slice(1)).join(", ")}`;
  return {
    platform: "youtube",
    label: "YouTube",
    text,
    preview: title,
    meta: `title ${title.length}/60 · 10 tags`,
  };
}

function threads(input: StudioInput): PlatformPost {
  const { keyPoints } = input;
  const h = hook(input);
  const q = `What's your take, collectors?`;
  let points = keyPoints.slice(0, 3);
  const assemble = () => [h, points.map((p) => `– ${p}`).join("\n"), q].filter(Boolean).join("\n\n");
  let text = assemble();
  while (text.length > 500 && points.length) {
    points = points.slice(0, -1);
    text = assemble();
  }
  if (text.length > 500) text = truncate(text, 500);
  return {
    platform: "threads",
    label: "Threads",
    text,
    preview: h,
    meta: `${text.length} chars · no hashtags`,
  };
}

function tiktok(input: StudioInput): PlatformPost {
  const { keyPoints } = input;
  const tags = ["#KLLCTRS", "#tradingcards"];
  const caption = truncate(`${hook(input)} ${tags.join(" ")}`, 150);

  const overlays: string[] = [truncate(input.topic.toUpperCase(), 40)];
  for (const p of keyPoints.slice(0, 4)) overlays.push(truncate(p, 40));
  const uniq = Array.from(new Set(overlays.filter(Boolean))).slice(0, 5);
  while (uniq.length < 3) uniq.push(truncate("Collect on KLLCTRS", 40));

  const text = `CAPTION (${caption.length} chars):\n${caption}\n\nON-SCREEN OVERLAYS:\n${uniq.map((o) => `• ${o}`).join("\n")}`;
  return {
    platform: "tiktok",
    label: "TikTok",
    text,
    preview: caption,
    meta: `caption ${caption.length}/150 · ${uniq.length} overlays`,
    segments: uniq,
  };
}

const GENERATORS: Record<PlatformId, (input: StudioInput) => PlatformPost> = {
  instagram,
  x,
  linkedin,
  youtube,
  threads,
  tiktok,
};

export const PLATFORM_ORDER: PlatformId[] = ["instagram", "x", "linkedin", "youtube", "threads", "tiktok"];

export function generatePost(platform: PlatformId, input: StudioInput): PlatformPost {
  return GENERATORS[platform](input);
}

export function generatePosts(input: StudioInput): PlatformPost[] {
  return PLATFORM_ORDER.map((p) => GENERATORS[p](input));
}
