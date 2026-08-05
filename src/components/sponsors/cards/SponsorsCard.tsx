import type { Sponsor } from "@/types";

import SponsorHeader from "./SponsorHeader";
import SponsorUpcomingShows from "./SponsorUpcomingShows";

interface ShowSummary {
  id: string;
  name: string;
  slug: string;
  date_start: string;
}

interface Props {
  sponsor: Sponsor;
  shows: ShowSummary[];
}

export default function SponsorsCard({ sponsor, shows }: Props) {
  return (
    <article className="w-full max-w-[420px] min-h-[300px] bg-[#FEFEFE] border border-[#EBEAF0] rounded-[16px] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(139,92,246,0.12)] p-6">
      <div className="flex flex-col justify-between h-full gap-[18px]">
        {/* Header */}
        <SponsorHeader sponsor={sponsor} />

        {/* Upcoming Shows */}
        <SponsorUpcomingShows sponsor={sponsor} shows={shows} />
      </div>
    </article>
  );
}
