import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeState } from "../utils/state";

interface ShopSearchArgs {
  state?: string;
  city?: string;
  specialty?: "sports" | "pokemon" | "both";
  keyword?: string;
}

export async function searchShops(args: ShopSearchArgs) {
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
    `)
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

  if (args.keyword) {
  query = query.or(`
    name.ilike.%${args.keyword}%,
    city.ilike.%${args.keyword}%,
    address.ilike.%${args.keyword}%,
    state.ilike.%${args.keyword}%
  `);
}

  //--------------------------------------

  const { data, error } = await query;

if (error) {
  throw error;
}

const shops = data ?? [];

return {
  found: shops.length > 0,
  total: shops.length,
  shops,
};
}
