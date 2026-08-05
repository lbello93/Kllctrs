import type { Sponsor } from "@/types";

import SponsorsCard from "./SponsorsCard";

interface ShowSummary {
  id: string;
  name: string;
  slug: string;
  date_start: string;
}

interface Props {
  sponsors: Sponsor[];
  showsBySponsor: Record<string, ShowSummary[]>;
}

export default function SponsorsGrid({ sponsors, showsBySponsor }: Props) {
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <SponsorsCard
              key={sponsor.id}
              sponsor={sponsor}
              shows={showsBySponsor[sponsor.name] ?? []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
