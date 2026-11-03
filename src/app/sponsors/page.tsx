import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listSponsors, type SponsorSort } from "@/lib/sponsors/intel";
import SponsorsListClient from "@/page-components/sponsor-intel/SponsorsListClient";

export const metadata: Metadata = {
  title: "Sponsor Intelligence",
  description: "Track which companies sponsor trading card shows, how often, and where.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function SponsorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const sortByRaw = one(sp.sortBy);
  const sortBy: SponsorSort = sortByRaw === "events" || sortByRaw === "category" ? sortByRaw : "name";
  const filters = {
    category: one(sp.category),
    search: one(sp.search),
    sortBy,
    hasEventsThisYear: one(sp.hasEventsThisYear) === "true",
  };
  const page = Math.max(1, Number(one(sp.page)) || 1);

  const supabase = await createClient();
  const result = await listSponsors(supabase, { ...filters, page, limit: 20 });

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <SponsorsListClient
        rows={result.rows}
        categories={result.categories}
        total={result.total}
        page={result.page}
        limit={result.limit}
        filters={filters}
      />
    </main>
  );
}
