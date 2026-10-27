import SponsorsClient from "@/page-components/BrandsPage/SponsorsClients";
import {
  tierRank,
  type SponsorRow,
  type SponsorShow,
  type SponsorStats,
  type SponsorsSummary,
} from "@/page-components/BrandsPage/shared";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Brands | KLLCTRS",
  description: "The brands behind the hobby and the shows they back.",
};

export default async function BrandsPage() {
  const supabase = await createClient();

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const { data: sponsorRows } = await supabase
    .from("sponsors")
    .select("*")
    .order("name");

  const sponsors = (sponsorRows ?? []) as SponsorRow[];

  // One query per brand, run together. The profile page uses the same match.
  const showsPerSponsor = await Promise.all(
    sponsors.map(async (sponsor) => {
      const { data } = await supabase
        .from("events")
        .select("id, name, slug, date_start, city, state, venue_name, date_end")
        .eq("status", "approved")
        .contains("sponsors", [sponsor.name])
        .order("date_start", { ascending: true });

      return (data ?? []) as SponsorShow[];
    }),
  );

  const stats: Record<string, SponsorStats> = {};
  const upcomingIds = new Set<string>();
  const upcomingStates = new Set<string>();

  sponsors.forEach((sponsor, index) => {
    const rows = showsPerSponsor[index];
    const upcoming = rows.filter((e) => e.date_start >= today);

    stats[sponsor.id] = {
      upcoming,
      left: upcoming.length,
      total: rows.length,
    };

    for (const show of upcoming) {
      upcomingIds.add(show.id);
      if (show.state) upcomingStates.add(show.state);
    }
  });

  // Higher tiers first, then more upcoming shows, then A to Z.
  sponsors.sort(
    (a, b) =>
      tierRank(b.tier) - tierRank(a.tier) ||
      stats[b.id].upcoming.length - stats[a.id].upcoming.length ||
      a.name.localeCompare(b.name),
  );

  const summary: SponsorsSummary = {
    brands: sponsors.length,
    shows: upcomingIds.size,
    states: upcomingStates.size,
  };

  return <SponsorsClient sponsors={sponsors} stats={stats} summary={summary} />;
}
