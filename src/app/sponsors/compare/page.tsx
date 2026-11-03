import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { compareSponsors } from "@/lib/sponsors/intel";
import SponsorCompareClient from "@/page-components/sponsor-intel/SponsorCompareClient";

export const metadata: Metadata = {
  title: "Compare Sponsors",
  description: "Compare trading card sponsors side by side.",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type SearchParams = Record<string, string | string[] | undefined>;

export default async function SponsorComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawIds = sp.ids;
  const idList = (Array.isArray(rawIds) ? rawIds : rawIds ? rawIds.split(",") : [])
    .map((s) => s.trim())
    .filter((s) => UUID_RE.test(s));
  const ids = [...new Set(idList)].slice(0, 4);

  const supabase = await createClient();
  const [comparison, { data: options }] = await Promise.all([
    ids.length > 0 ? compareSponsors(supabase, ids) : Promise.resolve({ sponsors: [], sharedEvents: [] }),
    supabase.from("sponsors").select("id,name").order("name").limit(500),
  ]);

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <SponsorCompareClient
        selectedIds={ids}
        sponsors={comparison.sponsors}
        sharedEvents={comparison.sharedEvents}
        options={options ?? []}
      />
    </main>
  );
}
