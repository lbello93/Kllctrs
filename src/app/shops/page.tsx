import { createClient } from "@/lib/supabase/server";
import ShopsClient from "../../components/shops/ShopsClient";
import type { Shop } from "@/types";

export const metadata = {
  title: "Card Shops Near You | KLLCTRS",
  description:
    "Find sports card shops and trading card stores across the US. Filter by state, city, and specialty.",
};

export default async function ShopsPage() {
  const supabase = await createClient();

  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let savedIds: string[] = [];
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("saved_shops")
      .eq("id", user.id)
      .single();
    savedIds = (profile?.saved_shops ?? []) as string[];
  }

  return (
    <ShopsClient initialShops={(shops ?? []) as Shop[]} savedIds={savedIds} />
  );
}
