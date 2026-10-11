import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeState } from "../utils/state";

interface EventSearchArgs {
  state?: string;
  city?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function searchEvents(args: EventSearchArgs) {
  const keyword = args.keyword?.trim().replace(/[^\p{L}\p{N}\s'-]/gu, " ").replace(/\s+/g, " ").slice(0, 80);
  let query = supabaseAdmin
    .from("events")
    .select(
      `
      name,
      slug,
      city,
      state,
      venue_name,
      website,
      date_start,
      date_end,
      venue_website
      `,
      { count: "exact" },
    )
    .eq("status", "approved")
    .order("date_start")
    .limit(20);

  const state = normalizeState(args.state);

if (state) {
    query=query.eq("state", state);
}
  if (args.city)
    query = query.ilike("city", `%${args.city}%`);

  if (keyword) {
    query = query.ilike("name", `%${keyword}%`);
}

  const validDate = (value?: string) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)));
  const requestedDateFrom = validDate(args.dateFrom) ? args.dateFrom : undefined;
  const dateTo = validDate(args.dateTo) ? args.dateTo : undefined;
  const defaultDateFrom = !requestedDateFrom && !dateTo
    ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())
    : undefined;
  const dateFrom = requestedDateFrom ?? defaultDateFrom;

  // Include multi-day events that overlap the requested window, not only
  // events whose start date falls inside it.
  if (dateFrom && dateTo) {
    query = query.or(`and(date_end.gte.${dateFrom},date_start.lte.${dateTo}),and(date_end.is.null,date_start.gte.${dateFrom},date_start.lte.${dateTo})`);
  } else if (dateFrom) {
    query = query.or(`date_end.gte.${dateFrom},and(date_end.is.null,date_start.gte.${dateFrom})`);
  } else if (dateTo) {
    query = query.lte("date_start", dateTo);
  }

  const { data, error, count } = await query;

if (error) {
  throw error;
}

const events = (data ?? []).map((event) => ({
  ...event,
  directory_url: `/events/${event.slug}`,
}));

return {
  found: events.length > 0,
  total: count ?? events.length,
  returned: events.length,
  truncated: (count ?? events.length) > events.length,
  events,
};
}
