import "server-only";
import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export type SponsorSort = "name" | "events" | "category";

export interface SponsorAnalyticsRow {
  sponsor_id: string;
  name: string | null;
  category: string | null;
  total_events_sponsored: number;
  events_this_year: number;
  states_present_in: string[] | null;
  top_tier_count: number;
}

export interface SponsorEventRow {
  id: string;
  slug: string;
  name: string;
  date_start: string;
  date_end: string | null;
  state: string;
  city: string;
  event_type: string | null;
  tier: string;
}

export interface SponsorListResult {
  rows: SponsorAnalyticsRow[];
  total: number;
  page: number;
  limit: number;
  categories: { category: string; count: number }[];
}

export interface SponsorListFilters {
  category?: string;
  search?: string;
  sortBy?: SponsorSort;
  hasEventsThisYear?: boolean;
  page?: number;
  limit?: number;
}

export async function listSponsors(
  supabase: ServerClient,
  filters: SponsorListFilters,
): Promise<SponsorListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const from = (page - 1) * limit;

  let query = supabase.from("sponsor_analytics").select("*", { count: "exact" });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.hasEventsThisYear) query = query.gt("events_this_year", 0);

  if (filters.sortBy === "events") {
    query = query.order("total_events_sponsored", { ascending: false });
  } else if (filters.sortBy === "category") {
    query = query.order("category", { ascending: true }).order("name", { ascending: true });
  } else {
    query = query.order("name", { ascending: true });
  }

  const { data, count } = await query.range(from, from + limit - 1);

  // Category summary counts across all sponsors.
  const { data: catRows } = await supabase.from("sponsors").select("category");
  const catTally = new Map<string, number>();
  for (const row of catRows ?? []) {
    const c = row.category || "Uncategorized";
    catTally.set(c, (catTally.get(c) ?? 0) + 1);
  }
  const categories = [...catTally.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    rows: (data ?? []) as SponsorAnalyticsRow[],
    total: count ?? (data?.length ?? 0),
    page,
    limit,
    categories,
  };
}

export interface SponsorDetail {
  sponsor: {
    id: string;
    name: string;
    slug: string;
    category: string;
    website: string | null;
    tagline: string | null;
    logo_url: string | null;
    headquarters: string | null;
    founded_year: number | null;
  };
  analytics: SponsorAnalyticsRow | null;
  events: SponsorEventRow[];
}

export async function getSponsorDetail(
  supabase: ServerClient,
  id: string,
): Promise<SponsorDetail | null> {
  const { data: sponsor } = await supabase
    .from("sponsors")
    .select("id,name,slug,category,website,tagline,logo_url,headquarters,founded_year")
    .eq("id", id)
    .maybeSingle();
  if (!sponsor) return null;

  const { data: analytics } = await supabase
    .from("sponsor_analytics")
    .select("*")
    .eq("sponsor_id", id)
    .maybeSingle();

  const { data: links } = await supabase
    .from("event_sponsors")
    .select("event_id,tier")
    .eq("sponsor_id", id);

  const tierByEvent = new Map<string, string>();
  for (const l of links ?? []) tierByEvent.set(l.event_id, l.tier);

  let events: SponsorEventRow[] = [];
  const ids = [...tierByEvent.keys()];
  if (ids.length > 0) {
    const { data: eventRows } = await supabase
      .from("events")
      .select("id,slug,name,date_start,date_end,state,city,event_type")
      .in("id", ids)
      .order("date_start", { ascending: false });
    events = (eventRows ?? []).map((e) => ({ ...e, tier: tierByEvent.get(e.id) ?? "exhibitor" }));
  }

  return {
    sponsor: sponsor as SponsorDetail["sponsor"],
    analytics: (analytics as SponsorAnalyticsRow) ?? null,
    events,
  };
}

export interface SponsorCompareEntry {
  id: string;
  name: string;
  category: string | null;
  website: string | null;
  slug: string;
  totalEvents: number;
  eventsThisYear: number;
  states: string[];
  tierDistribution: { title: number; gold: number; silver: number; exhibitor: number };
  eventIds: string[];
}

export interface SponsorCompareResult {
  sponsors: SponsorCompareEntry[];
  sharedEvents: { id: string; name: string; slug: string; sponsorCount: number }[];
}

export async function compareSponsors(
  supabase: ServerClient,
  ids: string[],
): Promise<SponsorCompareResult> {
  const unique = [...new Set(ids)].slice(0, 4);
  if (unique.length === 0) return { sponsors: [], sharedEvents: [] };

  const [{ data: sponsorRows }, { data: analyticsRows }, { data: links }] = await Promise.all([
    supabase.from("sponsors").select("id,name,category,website,slug").in("id", unique),
    supabase.from("sponsor_analytics").select("*").in("sponsor_id", unique),
    supabase.from("event_sponsors").select("sponsor_id,event_id,tier").in("sponsor_id", unique),
  ]);

  const analyticsById = new Map<string, SponsorAnalyticsRow>();
  for (const a of (analyticsRows ?? []) as SponsorAnalyticsRow[]) analyticsById.set(a.sponsor_id, a);

  const sponsors: SponsorCompareEntry[] = (sponsorRows ?? []).map((s) => {
    const a = analyticsById.get(s.id);
    const tiers = { title: 0, gold: 0, silver: 0, exhibitor: 0 };
    const eventIds: string[] = [];
    for (const l of links ?? []) {
      if (l.sponsor_id !== s.id) continue;
      eventIds.push(l.event_id);
      if (l.tier in tiers) tiers[l.tier as keyof typeof tiers] += 1;
    }
    return {
      id: s.id,
      name: s.name,
      category: s.category,
      website: s.website,
      slug: s.slug,
      totalEvents: a?.total_events_sponsored ?? eventIds.length,
      eventsThisYear: a?.events_this_year ?? 0,
      states: a?.states_present_in ?? [],
      tierDistribution: tiers,
      eventIds,
    };
  });

  // Shared events = sponsored by 2+ of the selected sponsors.
  const eventSponsorCount = new Map<string, number>();
  for (const s of sponsors) {
    for (const eid of new Set(s.eventIds)) {
      eventSponsorCount.set(eid, (eventSponsorCount.get(eid) ?? 0) + 1);
    }
  }
  const sharedIds = [...eventSponsorCount.entries()].filter(([, c]) => c >= 2).map(([id]) => id);

  let sharedEvents: SponsorCompareResult["sharedEvents"] = [];
  if (sharedIds.length > 0) {
    const { data: evs } = await supabase
      .from("events")
      .select("id,name,slug")
      .in("id", sharedIds);
    sharedEvents = (evs ?? []).map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      sponsorCount: eventSponsorCount.get(e.id) ?? 0,
    }));
  }

  return { sponsors, sharedEvents };
}
