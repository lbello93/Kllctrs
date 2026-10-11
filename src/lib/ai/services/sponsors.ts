import { supabaseAdmin } from "@/lib/supabase/admin";

interface SponsorSearchArgs {
  category?: string;
  keyword?: string;
}

export async function searchSponsors(args: SponsorSearchArgs) {
  let query = supabaseAdmin
    .from("sponsors")
    .select(`
      name,
      slug,
      category,
      description,
      website
    `)
    .limit(10);

  if (args.category) {
    query = query.ilike(
      "category",
      `%${args.category}%`
    );
  }

  if (args.keyword) {
  query = query.or(`
    name.ilike.%${args.keyword}%,
    city.ilike.%${args.keyword}%,
    address.ilike.%${args.keyword}%,
    state.ilike.%${args.keyword}%
  `);
}

  const { data } = await query;

  const sponsors = data ?? [];

return {
  found: sponsors.length > 0,
  total: sponsors.length,
  sponsors,
};
}
