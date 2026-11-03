import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listShops } from "@/lib/shops/finder";
import ShopFinderClient from "@/page-components/shop-finder/ShopFinderClient";
import type { ShopFilters } from "@/page-components/shop-finder/types";

export const metadata: Metadata = {
  title: "Card Shop Finder",
  description: "Find trading card and hobby shops near you — filter by category, rating, and distance.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const num = (v: string) => {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters: ShopFilters = {
    lat: num(one(sp.lat)),
    lng: num(one(sp.lng)),
    radius: num(one(sp.radius)) ?? 25,
    category: one(sp.category),
    minRating: num(one(sp.minRating)) ?? 0,
    search: one(sp.search),
    state: one(sp.state),
    city: one(sp.city),
  };

  const supabase = await createClient();
  const shops = await listShops(supabase, filters);

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <ShopFinderClient shops={shops} filters={filters} />
    </main>
  );
}
