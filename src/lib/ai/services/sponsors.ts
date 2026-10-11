import { supabaseAdmin } from "@/lib/supabase/admin";

interface SponsorSearchArgs {
  category?: string;
  keyword?: string;
}

export async function searchSponsors(args: SponsorSearchArgs) {
  const keyword = args.keyword?.trim().replace(/[^\p{L}\p{N}\s'-]/gu, " ").replace(/\s+/g, " ").slice(0, 80);
  const category = args.category?.trim().replace(/[^\p{L}\p{N}\s'-]/gu, " ").slice(0, 50);
  let query = supabaseAdmin
    .from("sponsors")
    .select("name, slug, category, tagline, description, website, headquarters, founded_year, offerings, product_categories, target_audience, service_area, verified, info_source_url, info_verified_at", { count: "exact" })
    .order("name")
    .limit(10);

  if (keyword) query = query.ilike("name", `%${keyword}%`);
  if (category) query = query.ilike("category", `%${category}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  const sponsors = await Promise.all((data ?? []).map(async (brand) => {
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("name, slug, date_start, date_end, city, state, venue_name, website")
      .eq("status", "approved")
      .contains("sponsors", [brand.name])
      .gte("date_start", new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date()))
      .order("date_start")
      .limit(5);

    return {
      ...brand,
      profile_url: `/sponsors/${brand.slug}`,
      upcoming_events: eventsError ? [] : (events ?? []).map((event) => ({ ...event, directory_url: `/events/${event.slug}` })),
    };
  }));

  return { found: sponsors.length > 0, total: count ?? sponsors.length, returned: sponsors.length, truncated: (count ?? sponsors.length) > sponsors.length, sponsors };
}
