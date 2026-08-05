import SponsorsClient from "@/components/sponsors/SponsorsClients";
import { createClient } from "@/lib/supabase/server";
import type { Sponsor } from "@/types";

export default async function SponsorsPage() {
  const supabase = await createClient();

  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("name");

  const { data: events } = await supabase
    .from("events")
    .select("id, name, slug, date_start, sponsors")
    .eq("status", "approved")
    .gte("date_start", new Date().toISOString().split("T")[0])
    .order("date_start", { ascending: true });

  // Build a map: sponsor name -> list of upcoming events that mention it
  const showsBySponsor: Record
    string,
    { id: string; name: string; slug: string; date_start: string }[]
  > = {};

  for (const event of events ?? []) {
    for (const sponsorName of event.sponsors ?? []) {
      if (!showsBySponsor[sponsorName]) showsBySponsor[sponsorName] = [];
      showsBySponsor[sponsorName].push({
        id: event.id,
        name: event.name,
        slug: event.slug,
        date_start: event.date_start,
      });
    }
  }

  return (
    <SponsorsClient
      initialSponsors={(sponsors ?? []) as Sponsor[]}
      showsBySponsor={showsBySponsor}
    />
  );
}