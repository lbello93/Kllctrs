import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeState } from "../utils/state";

interface ShopSearchArgs {
  state?: string;
  city?: string;
  specialty?: "sports" | "pokemon" | "both";
  keyword?: string;
}

export async function searchShops(args: ShopSearchArgs) {
  const keyword = args.keyword?.trim().replace(/[^\p{L}\p{N}\s'-]/gu, " ").replace(/\s+/g, " ").slice(0, 80);
  let query = supabaseAdmin
    .from("shops")
    .select(`
      name,
      slug,
      city,
      state,
      specialty,
      address,
      phone,
      website
    `, { count: "exact" })
    .eq("status", "approved")
    .order("name")
    .limit(20)

  //--------------------------------------
  // State
  //--------------------------------------

  const state = normalizeState(args.state);

if (state) {
  query = query.eq("state", state);
}

  //--------------------------------------
  // City
  //--------------------------------------

  if (args.city) {
    query = query.ilike(
      "city",
      `%${args.city}%`
    );
  }

  //--------------------------------------
  // Specialty
  //--------------------------------------

  if (args.specialty === "pokemon") {
    query = query.in(
      "specialty",
      ["pokemon", "both"]
    );
  }

  else if (args.specialty === "sports") {
    query = query.in(
      "specialty",
      ["sports", "both"]
    );
  }

  //--------------------------------------
  // Keyword
  //--------------------------------------

  if (keyword) query = query.ilike("name", `%${keyword}%`);

  //--------------------------------------

  const { data, error, count } = await query;

if (error) {
  throw error;
}

const shops = (data ?? []).map((shop) => ({ ...shop, directory_url: `/shops/${shop.slug}` }));

return {
  found: shops.length > 0,
  total: count ?? shops.length,
  returned: shops.length,
  truncated: (count ?? shops.length) > shops.length,
  shops,
};
}
