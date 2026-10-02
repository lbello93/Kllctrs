import SponsorsCard from "./SponsorsCard";
import type { SponsorRow, SponsorStats } from "../shared";

interface Props {
  sponsors: SponsorRow[];
  stats: Record<string, SponsorStats>;
}

const EMPTY_STATS: SponsorStats = { upcoming: [], left: 0, total: 0 };

export default function SponsorsGrid({ sponsors, stats }: Props) {
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sponsors.map((sponsor) => (
            <SponsorsCard
              key={sponsor.id}
              sponsor={sponsor}
              stats={stats[sponsor.id] ?? EMPTY_STATS}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
