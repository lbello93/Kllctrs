import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EventsExplorer from "@/page-components/events-calendar/EventsExplorer";
import type { EventListItem, EventFilters, EventView } from "@/page-components/events-calendar/types";

export const metadata: Metadata = {
  title: "Card Show Calendar",
  description: "Browse upcoming trading card shows, conventions, and meetups by date, state, and type.",
};

const PAGE_SIZE = 20;
const MONTH_RE = /^\d{4}-\d{2}$/;

function monthBounds(month: string): { start: string; end: string } {
  const [year, m] = month.split("-").map(Number);
  const start = `${month}-01`;
  const lastDay = new Date(year, m, 0).getDate(); // day 0 of next month = last day
  const end = `${month}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const view: EventView = one(sp.view) === "list" ? "list" : "calendar";
  const filters: EventFilters = {
    state: one(sp.state),
    city: one(sp.city),
    startDate: one(sp.startDate),
    endDate: one(sp.endDate),
    type: one(sp.type),
    search: one(sp.search),
    hasSponsors: one(sp.hasSponsors) === "true",
  };
  const page = Math.max(1, Number(one(sp.page)) || 1);
  const month = MONTH_RE.test(one(sp.month)) ? one(sp.month) : new Date().toISOString().slice(0, 7);

  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select(
      "id,slug,name,city,state,date_start,date_end,venue_name,event_type,is_featured,is_verified,sponsors",
      { count: "exact" },
    )
    .eq("status", "approved")
    .order("date_start", { ascending: true });

  const types = filters.type.split(",").filter(Boolean);
  if (filters.state) query = query.eq("state", filters.state);
  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (types.length === 1) query = query.eq("event_type", types[0]);
  else if (types.length > 1) query = query.in("event_type", types);
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,venue_name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`,
    );
  }

  if (view === "calendar") {
    const { start, end } = monthBounds(month);
    query = query.gte("date_start", start).lte("date_start", end).limit(500);
  } else {
    if (filters.startDate) query = query.gte("date_start", filters.startDate);
    if (filters.endDate) query = query.lte("date_start", filters.endDate);
    query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  }

  const { data, count } = await query;
  const rows = data ?? [];

  // Tiered-sponsor counts from the junction, with a fallback to sponsors[].
  const ids = rows.map((e) => e.id);
  const tally = new Map<string, number>();
  if (ids.length > 0) {
    const { data: links } = await supabase
      .from("event_sponsors")
      .select("event_id")
      .in("event_id", ids);
    for (const link of links ?? []) {
      tally.set(link.event_id, (tally.get(link.event_id) ?? 0) + 1);
    }
  }

  let events: EventListItem[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    state: row.state,
    date_start: row.date_start,
    date_end: row.date_end,
    venue_name: row.venue_name,
    event_type: row.event_type,
    is_featured: row.is_featured,
    is_verified: row.is_verified,
    sponsorCount: tally.get(row.id) || row.sponsors?.length || 0,
  }));

  if (filters.hasSponsors) events = events.filter((e) => e.sponsorCount > 0);

  const total = count ?? events.length;

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <EventsExplorer
        events={events}
        view={view}
        filters={filters}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        month={month}
      />
    </main>
  );
}
