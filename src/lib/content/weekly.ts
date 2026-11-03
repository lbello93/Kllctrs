import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateContent, type GeneratedDraft } from "./generate";

export interface WeeklyBatchResult {
  generated: GeneratedDraft[];
  skipped: string[];
  errors: string[];
}

/** Upcoming events in the next 7 days, soonest first. */
async function upcomingEvents(limit: number) {
  const today = new Date().toISOString().slice(0, 10);
  const weekOut = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const { data } = await supabaseAdmin
    .from("events")
    .select("id,name")
    .gte("date_start", today)
    .lte("date_start", weekOut)
    .order("date_start", { ascending: true })
    .limit(limit);
  return data ?? [];
}

async function topSponsor(): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("sponsor_analytics")
    .select("sponsor_id,events_this_year")
    .order("events_this_year", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.sponsor_id ?? null;
}

async function run(
  result: WeeklyBatchResult,
  label: string,
  fn: () => Promise<GeneratedDraft>,
) {
  try {
    result.generated.push(await fn());
  } catch (error) {
    result.errors.push(`${label}: ${error instanceof Error ? error.message : "failed"}`);
  }
}

/**
 * Admin "Generate This Week's Content" button:
 * 1 event preview + 1 sponsor spotlight + 1 LinkedIn post.
 */
export async function generateWeeklyStudioBatch(): Promise<WeeklyBatchResult> {
  const result: WeeklyBatchResult = { generated: [], skipped: [], errors: [] };

  const events = await upcomingEvents(1);
  if (events[0]) {
    await run(result, "event preview", () =>
      generateContent({ type: "blog", eventId: events[0].id }),
    );
  } else {
    result.skipped.push("No upcoming events in the next 7 days for a preview.");
  }

  const sponsorId = await topSponsor();
  if (sponsorId) {
    await run(result, "sponsor spotlight", () =>
      generateContent({ type: "blog", sponsorId }),
    );
    await run(result, "LinkedIn post", () =>
      generateContent({ type: "linkedin", sponsorId }),
    );
  } else {
    result.skipped.push("No sponsor analytics available for a spotlight / LinkedIn post.");
  }

  return result;
}

/**
 * Weekly cron batch:
 * preview posts for the top 3 upcoming events + 1 trend report.
 */
export async function generateWeeklyCronBatch(): Promise<WeeklyBatchResult> {
  const result: WeeklyBatchResult = { generated: [], skipped: [], errors: [] };

  const events = await upcomingEvents(3);
  if (events.length === 0) {
    result.skipped.push("No upcoming events in the next 7 days for previews.");
  }
  for (const event of events) {
    await run(result, `preview: ${event.name}`, () =>
      generateContent({ type: "blog", eventId: event.id }),
    );
  }

  await run(result, "trend report", () => generateContent({ type: "trend_report" }));

  return result;
}
