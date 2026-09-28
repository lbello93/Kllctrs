/**
 * ------------------------------------------------------------
 * FILE: queries.ts
 * PURPOSE:
 * Reads visits from Supabase and builds the numbers for the
 * analytics dashboard. One fetch per request, then everything
 * is counted in memory.
 * ------------------------------------------------------------
 */

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AnalyticsResponse } from "@/types/analytics";

export type AnalyticsRange = "today" | "7d" | "30d" | "90d" | "year" | "all";

export const ANALYTICS_RANGES: AnalyticsRange[] = [
  "today",
  "7d",
  "30d",
  "90d",
  "year",
  "all",
];

const PAGE_SIZE = 1000; // Supabase returns at most 1000 rows per request
const MAX_ROWS = 50000; // safety limit for the breakdowns (newest rows first)
const TOP_N = 10; // how many bars each chart shows

interface VisitRow {
  page: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  visited_at: string;
}

function getStartDate(range: AnalyticsRange): string | null {
  const date = new Date();

  switch (range) {
    case "today":
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    case "7d":
      date.setDate(date.getDate() - 7);
      return date.toISOString();
    case "30d":
      date.setDate(date.getDate() - 30);
      return date.toISOString();
    case "90d":
      date.setDate(date.getDate() - 90);
      return date.toISOString();
    case "year":
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    default:
      return null;
  }
}

async function loadVisits(startDate: string | null): Promise<VisitRow[]> {
  const rows: VisitRow[] = [];

  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    let query = supabaseAdmin
      .from("analytics_locations")
      .select("page, country, state, city, visited_at");

    if (startDate) query = query.gte("visited_at", startDate);

    const { data, error } = await query
      .order("visited_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    rows.push(...(data as VisitRow[]));

    if (data.length < PAGE_SIZE) break;
  }

  return rows;
}

async function countVisits(startDate: string | null): Promise<number | null> {
  let query = supabaseAdmin
    .from("analytics_locations")
    .select("*", { count: "exact", head: true });

  if (startDate) query = query.gte("visited_at", startDate);

  const { count, error } = await query;
  if (error) throw error;

  return count;
}

function tally(values: Array<string | null>): Array<[string, number]> {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export async function getAnalytics(
  range: AnalyticsRange = "all",
): Promise<AnalyticsResponse> {
  const startDate = getStartDate(range);

  const [rows, totalViews] = await Promise.all([
    loadVisits(startDate),
    countVisits(startDate),
  ]);

  const pages = tally(rows.map((r) => r.page));
  const countries = tally(rows.map((r) => r.country));
  const states = tally(rows.map((r) => r.state));
  const cities = tally(rows.map((r) => r.city));
  const days = tally(rows.map((r) => r.visited_at.slice(0, 10)));

  return {
    summary: {
      totalViews: totalViews ?? rows.length,
      uniqueCountries: countries.length,
      uniqueStates: states.length,
      uniqueCities: cities.length,
    },
    pages: pages.slice(0, TOP_N).map(([page, views]) => ({ page, views })),
    countries: countries
      .slice(0, TOP_N)
      .map(([country, views]) => ({ country, views })),
    states: states.slice(0, TOP_N).map(([state, views]) => ({ state, views })),
    cities: cities.slice(0, TOP_N).map(([city, views]) => ({ city, views })),
    timeline: days
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}