import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bookmark, Globe } from "lucide-react";
import { format } from "date-fns";

import type { Sponsor } from "@/types";

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

const MAX_VISIBLE = 3;

export default function SponsorUpcomingShows({ sponsor, shows }: Props) {
  const visibleShows = shows.slice(0, MAX_VISIBLE);
  const remaining = shows.length - MAX_VISIBLE;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Heading */}
      <h3 className="text-[12px] font-semibold leading-[15px] text-[#8B5CF6]">
        Next Shows
      </h3>

      {/* Show List */}
      {visibleShows.length === 0 ? (
        <p className="text-[11px] text-[#4a3f6b]/40 py-2">
          No upcoming shows linked yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleShows.map((show) => (
            <Link
              key={show.id}
              href={`/events/${show.slug}`}
              className="w-full rounded-[8px] bg-[#FEF9FF] px-3 py-[6px] flex items-center justify-between hover:bg-[#F2EFFE] transition-colors"
            >
              {/* Left */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Date */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[18px] leading-[22px] font-normal text-black">
                    {format(new Date(show.date_start), "d")}
                  </span>

                  <span className="text-[10px] leading-[12px] text-black">
                    {format(new Date(show.date_start), "MMM")}
                  </span>
                </div>

                {/* Title */}
                <span className="text-[12px] leading-[15px] font-semibold text-black truncate max-w-[200px]">
                  {show.name}
                </span>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4 shrink-0">
                <Bookmark
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#8B5CF6]"
                />

                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#8B5CF6]"
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* More Shows */}
        {remaining > 0 && (
          <Link
            href={`/sponsors/${sponsor.slug}`}
            className="flex items-center gap-1 text-[10px] font-bold text-[#8B5CF6] hover:opacity-80 transition"
          >
            +{remaining} More Upcoming Shows
            <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        )}

        {/* Website */}
        <Link
          href={sponsor.website ?? "#"}
          target="_blank"
          className="flex items-center gap-1 text-[10px] font-normal text-[#8B5CF6] hover:opacity-80 transition"
        >
          <Globe size={10} strokeWidth={1.5} />
          <span>Visit Website</span>
          <ArrowUpRight size={12} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
