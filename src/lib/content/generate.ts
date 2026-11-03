import "server-only";

import slugify from "slugify";
import { Type } from "@google/genai";

import { ai, GEMINI_MODEL } from "@/AI integration/config";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { TablesInsert } from "@/types/database";

/**
 * AI Content Engine — Gemini-backed generation.
 *
 * Uses the same provider/config as the chat assistant (@/AI integration/config)
 * rather than the Anthropic "Content Studio" (that is a separate, web-search
 * grounded tool and is left untouched). Each template pulls real rows from the
 * database, builds a grounded prompt, asks Gemini for a structured draft, and
 * saves it to `content` as an AI-generated draft.
 */

export const CONTENT_ENGINE_TYPES = [
  "blog",
  "linkedin",
  "social",
  "trend_report",
  "event_recap",
] as const;

export type ContentEngineType = (typeof CONTENT_ENGINE_TYPES)[number];

export interface GenerateContentInput {
  type: ContentEngineType;
  topic?: string | null;
  eventId?: string | null;
  sponsorId?: string | null;
  customPrompt?: string | null;
}

export interface GeneratedDraft {
  id: string;
  title: string;
  slug: string;
  type: ContentEngineType;
  status: string;
}

export class ContentEngineError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message);
    this.name = "ContentEngineError";
  }
}

/** The shape every template asks Gemini to return. */
interface ModelDraft {
  title: string;
  excerpt: string;
  body_markdown: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
}

const DRAFT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    excerpt: { type: Type.STRING },
    body_markdown: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    seo_title: { type: Type.STRING },
    seo_description: { type: Type.STRING },
  },
  required: ["title", "excerpt", "body_markdown", "tags", "seo_title", "seo_description"],
};

const SYSTEM_INSTRUCTION = [
  "You are the KLLCTRS content writer. KLLCTRS is a trading-card and collectibles hobby platform",
  "covering card shows, hobby shops, and sponsor brands across the United States.",
  "Write in a warm, knowledgeable, community-first voice. Never invent facts, dates, prices, or",
  "statistics that are not present in the supplied data — if a detail is missing, write around it.",
  "Return markdown in body_markdown using ## subheadings and short paragraphs. Do not wrap the",
  "response in code fences. Respond with the JSON object only.",
].join(" ");

interface TemplatePlan {
  prompt: string;
  wordTarget: number;
  relatedEventId: string | null;
  relatedSponsorId: string | null;
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return "date to be announced";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "date to be announced"
    : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function monthLabel(offsetMonths = 0): { label: string; start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 1);
  return {
    label: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

async function loadEvent(eventId: string) {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select(
      "id,name,slug,date_start,date_end,venue_name,venue_address,city,state,website,event_type,sponsors",
    )
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw new ContentEngineError("Could not load the selected event.", 500);
  if (!data) throw new ContentEngineError("The selected event was not found.", 404);
  return data;
}

async function loadSponsor(sponsorId: string) {
  const { data, error } = await supabaseAdmin
    .from("sponsors")
    .select(
      "id,name,slug,category,tagline,description,headquarters,website,offerings,product_categories,target_audience,service_area,founded_year",
    )
    .eq("id", sponsorId)
    .maybeSingle();
  if (error) throw new ContentEngineError("Could not load the selected sponsor.", 500);
  if (!data) throw new ContentEngineError("The selected sponsor was not found.", 404);
  return data;
}

/** Names of sponsors attached to an event — junction table first, text[] fallback. */
async function eventSponsorNames(event: {
  id: string;
  sponsors: string[] | null;
}): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("event_sponsors")
    .select("sponsor_id, sponsors(name)")
    .eq("event_id", event.id);

  const joined = (data ?? [])
    .map((row) => (row.sponsors as { name?: string } | null)?.name)
    .filter((n): n is string => Boolean(n));

  if (joined.length) return joined;
  return (event.sponsors ?? []).filter((s): s is string => Boolean(s));
}

async function sponsorAnalytics(sponsorId: string) {
  const { data } = await supabaseAdmin
    .from("sponsor_analytics")
    .select("events_this_year,total_events_sponsored,top_tier_count,states_present_in")
    .eq("sponsor_id", sponsorId)
    .maybeSingle();
  return data;
}

async function buildPlan(input: GenerateContentInput): Promise<TemplatePlan> {
  const extra = input.customPrompt?.trim()
    ? `\n\nAdditional instructions from the admin (follow where sensible): ${input.customPrompt.trim()}`
    : "";

  switch (input.type) {
    case "blog": {
      // Blog (sponsor spotlight) when a sponsor is chosen.
      if (input.sponsorId) {
        const sponsor = await loadSponsor(input.sponsorId);
        const analytics = await sponsorAnalytics(sponsor.id);
        const { data: recentEvents } = await supabaseAdmin
          .from("event_sponsors")
          .select("events(name,city,state,date_start)")
          .eq("sponsor_id", sponsor.id)
          .limit(8);
        const events = (recentEvents ?? [])
          .map((r) => r.events as { name?: string; city?: string; state?: string; date_start?: string } | null)
          .filter((e): e is NonNullable<typeof e> => Boolean(e?.name))
          .map((e) => ({ name: e.name, where: `${e.city}, ${e.state}`, when: fmtDate(e.date_start) }));
        const data = {
          name: sponsor.name,
          category: sponsor.category,
          tagline: sponsor.tagline,
          description: sponsor.description,
          headquarters: sponsor.headquarters,
          founded_year: sponsor.founded_year,
          offerings: sponsor.offerings,
          website: sponsor.website,
          events_this_year: analytics?.events_this_year ?? 0,
          total_events_sponsored: analytics?.total_events_sponsored ?? 0,
          states_present_in: analytics?.states_present_in ?? [],
          recent_events: events,
        };
        return {
          prompt:
            `Write a ~400 word blog SPONSOR SPOTLIGHT on this brand for the KLLCTRS community. ` +
            `Explain who they are, what they bring to the hobby, and where collectors can find them, ` +
            `grounded strictly in the supplied stats and events.\n\n` +
            `Sponsor data (facts only):\n${JSON.stringify(data, null, 2)}${extra}`,
          wordTarget: 400,
          relatedEventId: null,
          relatedSponsorId: sponsor.id,
        };
      }
      // Blog (event preview) when an event is chosen; otherwise a topical post.
      if (input.eventId) {
        const event = await loadEvent(input.eventId);
        const sponsors = await eventSponsorNames(event);
        const data = {
          name: event.name,
          when: `${fmtDate(event.date_start)}${event.date_end ? ` – ${fmtDate(event.date_end)}` : ""}`,
          venue: event.venue_name,
          location: `${event.city}, ${event.state}`,
          type: event.event_type,
          website: event.website,
          sponsors,
        };
        return {
          prompt:
            `Write a ~500 word blog PREVIEW for this upcoming card show / event. ` +
            `Build excitement, explain who should attend and what to expect, and mention the sponsors naturally if any are listed.\n\n` +
            `Event data (JSON, facts only):\n${JSON.stringify(data, null, 2)}${extra}`,
          wordTarget: 500,
          relatedEventId: event.id,
          relatedSponsorId: null,
        };
      }
      return {
        prompt:
          `Write a ~500 word blog post for the KLLCTRS hobby community on the topic below. ` +
          `Make it genuinely useful to card collectors.\n\nTopic: ${input.topic?.trim() || "an interesting trading-card hobby topic"}${extra}`,
        wordTarget: 500,
        relatedEventId: null,
        relatedSponsorId: null,
      };
    }

    case "social": {
      // Short multi-platform social copy, optionally tied to an event or topic.
      let context = "";
      let relatedEventId: string | null = null;
      if (input.eventId) {
        const event = await loadEvent(input.eventId);
        relatedEventId = event.id;
        context = `\n\nEvent data:\n${JSON.stringify(
          { name: event.name, when: fmtDate(event.date_start), location: `${event.city}, ${event.state}` },
          null,
          2,
        )}`;
      }
      return {
        prompt:
          `Write a punchy social media post (Instagram / X style, ~80 words) for KLLCTRS. ` +
          `Upbeat, concise, 3-5 relevant hashtags listed at the end of the body.` +
          `${input.topic?.trim() ? `\n\nTopic: ${input.topic.trim()}` : ""}${context}${extra}`,
        wordTarget: 80,
        relatedEventId,
        relatedSponsorId: null,
      };
    }

    case "linkedin": {
      if (!input.sponsorId) {
        throw new ContentEngineError("A sponsor is required for a LinkedIn post.", 400);
      }
      const sponsor = await loadSponsor(input.sponsorId);
      const analytics = await sponsorAnalytics(sponsor.id);
      const data = {
        name: sponsor.name,
        category: sponsor.category,
        tagline: sponsor.tagline,
        headquarters: sponsor.headquarters,
        events_this_year: analytics?.events_this_year ?? 0,
        total_events_sponsored: analytics?.total_events_sponsored ?? 0,
        states_present_in: analytics?.states_present_in ?? [],
      };
      return {
        prompt:
          `Write a ~200 word professional LinkedIn post highlighting this brand's presence and ` +
          `investment in the trading-card hobby, framed as an industry insight. Professional but human tone, ` +
          `a few relevant hashtags at the end.\n\nSponsor analytics (facts only):\n${JSON.stringify(data, null, 2)}${extra}`,
        wordTarget: 200,
        relatedEventId: null,
        relatedSponsorId: sponsor.id,
      };
    }

    case "trend_report": {
      const thisMonth = monthLabel(0);
      const [eventsThisMonth, totalUpcoming, sponsorCount] = await Promise.all([
        supabaseAdmin
          .from("events")
          .select("state", { count: "exact" })
          .gte("date_start", thisMonth.start)
          .lt("date_start", thisMonth.end),
        supabaseAdmin
          .from("events")
          .select("id", { count: "exact", head: true })
          .gte("date_start", new Date().toISOString().slice(0, 10)),
        supabaseAdmin.from("sponsors").select("id", { count: "exact", head: true }),
      ]);

      const states = new Set(
        (eventsThisMonth.data ?? []).map((r) => r.state).filter(Boolean),
      );
      const data = {
        month: thisMonth.label,
        events_this_month: eventsThisMonth.count ?? 0,
        states_active_this_month: states.size,
        upcoming_events_total: totalUpcoming.count ?? 0,
        active_sponsor_brands: sponsorCount.count ?? 0,
      };
      return {
        prompt:
          `Write a ~600 word "State of the Hobby" trend report for KLLCTRS using the aggregated ` +
          `monthly statistics below. Interpret the numbers, note what they suggest for collectors, and keep ` +
          `claims grounded strictly in the data.\n\nAggregated stats (facts only):\n${JSON.stringify(data, null, 2)}${extra}`,
        wordTarget: 600,
        relatedEventId: null,
        relatedSponsorId: null,
      };
    }

    case "event_recap": {
      if (!input.eventId) {
        throw new ContentEngineError("An event is required for a recap.", 400);
      }
      const event = await loadEvent(input.eventId);
      const sponsors = await eventSponsorNames(event);
      const { data: reviews } = await supabaseAdmin
        .from("event_reviews")
        .select("rating,comment")
        .eq("event_id", event.id)
        .limit(20);

      const ratings = (reviews ?? []).map((r) => r.rating).filter((n): n is number => typeof n === "number");
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      const data = {
        name: event.name,
        when: fmtDate(event.date_start),
        location: `${event.city}, ${event.state}`,
        venue: event.venue_name,
        sponsors,
        review_count: reviews?.length ?? 0,
        average_rating: avg ? Number(avg.toFixed(1)) : null,
        review_highlights: (reviews ?? [])
          .map((r) => r.comment)
          .filter((c): c is string => Boolean(c))
          .slice(0, 6),
      };
      return {
        prompt:
          `Write a ~400 word recap of this PAST event, celebrating the turnout and weaving in attendee ` +
          `review highlights where available. Stay grounded in the supplied data.\n\n` +
          `Event + reviews (facts only):\n${JSON.stringify(data, null, 2)}${extra}`,
        wordTarget: 400,
        relatedEventId: event.id,
        relatedSponsorId: null,
      };
    }

    default:
      throw new ContentEngineError("Unknown content type.", 400);
  }
}

function cleanTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return Array.from(
    new Set(
      tags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.replace(/^#+/, "").trim())
        .filter((t) => t.length > 1 && t.length <= 40),
    ),
  ).slice(0, 8);
}

async function callGemini(prompt: string): Promise<ModelDraft> {
  let response;
  try {
    response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: DRAFT_SCHEMA,
        temperature: 0.8,
      },
    });
  } catch (error) {
    console.error("Content engine Gemini error:", error);
    throw new ContentEngineError("The AI provider is unavailable right now. Try again shortly.", 503);
  }

  const text = response.text?.trim();
  if (!text) throw new ContentEngineError("The model returned an empty draft. Try again.", 502);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ContentEngineError("The model returned a draft in the wrong format. Try again.", 502);
  }

  const draft = parsed as Partial<ModelDraft>;
  if (!draft.title || !draft.body_markdown) {
    throw new ContentEngineError("The model returned an incomplete draft. Try again.", 502);
  }
  return {
    title: draft.title,
    excerpt: draft.excerpt ?? "",
    body_markdown: draft.body_markdown,
    tags: cleanTags(draft.tags),
    seo_title: draft.seo_title ?? draft.title,
    seo_description: draft.seo_description ?? draft.excerpt ?? "",
  };
}

/** Maps the engine type to the existing `content.category` vocabulary. */
function categoryForType(type: ContentEngineType): string {
  switch (type) {
    case "linkedin":
      return "brands";
    case "trend_report":
      return "market_intel";
    case "event_recap":
      return "community";
    case "social":
      return "community";
    default:
      return "editorial";
  }
}

export async function generateContent(input: GenerateContentInput): Promise<GeneratedDraft> {
  const plan = await buildPlan(input);
  const draft = await callGemini(plan.prompt);

  const title = draft.title.trim().slice(0, 160);
  const slugBase = slugify(title, { lower: true, strict: true }).slice(0, 70) || "draft";
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;

  const row: TablesInsert<"content"> = {
    type: input.type,
    status: "draft",
    title,
    slug,
    body: draft.body_markdown.trim(),
    excerpt: draft.excerpt.trim().slice(0, 300) || null,
    meta_description: draft.seo_description.trim().slice(0, 155) || null,
    seo_title: draft.seo_title.trim().slice(0, 160) || null,
    seo_description: draft.seo_description.trim().slice(0, 300) || null,
    tags: draft.tags,
    category: categoryForType(input.type),
    author: "KLLCTRS AI",
    is_ai_generated: true,
    ai_prompt_used: plan.prompt.slice(0, 8000),
    related_event_id: plan.relatedEventId,
    related_sponsor_id: plan.relatedSponsorId,
  };

  const { data, error } = await supabaseAdmin
    .from("content")
    .insert(row)
    .select("id,title,slug,type,status")
    .single();

  if (error || !data) {
    console.error("Content engine save error:", error);
    throw new ContentEngineError(
      `The draft was written but could not be saved: ${error?.message ?? "unknown error"}`,
      500,
    );
  }

  return {
    id: data.id,
    title: data.title ?? title,
    slug: data.slug ?? slug,
    type: input.type,
    status: data.status ?? "draft",
  };
}
