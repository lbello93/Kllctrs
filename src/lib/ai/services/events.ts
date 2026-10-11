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
      date_end
      `
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

  if (args.keyword) {
  query = query.or(`
    name.ilike.%${args.keyword}%,
    venue_name.ilike.%${args.keyword}%,
    city.ilike.%${args.keyword}%,
    state.ilike.%${args.keyword}%,
    venue_address.ilike.%${args.keyword}%
  `);
}

  if (args.dateFrom)
    query = query.gte(
      "date_start",
      args.dateFrom
    );

  if (args.dateTo)
    query = query.lte(
      "date_start",
      args.dateTo
    );

  const { data, error } = await query;

if (error) {
  throw error;
}

const events = data ?? [];

return {
  found: events.length > 0,
  total: events.length,
  events,
};
}
