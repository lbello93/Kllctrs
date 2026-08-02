import { format } from "date-fns";
import Link from "next/link";
import type { Event } from "@/types";

export default function RecommendedShowCard({ event }: { event: Event }) {
  return (
    <div className="flex w-full flex-col md:w-[427px]">
      <div className="relative flex h-[152px] w-full md:h-[178px]">
        <div className="relative flex-1 rounded-tl-2xl border border-[#F2EFFE] bg-[#FEF9FF]">
          <div className="absolute left-4 top-3 flex gap-2">
            <span className="rounded-[10px] border border-[#FCDB9F] bg-[#F0C040] px-3 py-1 text-[11px] text-[#FDEFCE]">
              Upcoming
            </span>
          </div>

          <div className="absolute left-4 top-11 flex flex-col gap-2">
            <h3 className="font-space-grotesk text-xl font-medium tracking-tight text-black">
              {event.name}
            </h3>
          </div>

          <div className="absolute left-4 top-[86px] flex items-center gap-1">
            <span className="text-[11px] font-bold tracking-tight text-[#8B5CF6]">
              {event.venue_name
                ? `${event.venue_name}, ${event.state}`
                : `${event.city}, ${event.state}`}
            </span>
          </div>

          {event.autograph_guests && (
            <p className="absolute left-4 top-[116px] w-[288px] text-[10px] tracking-tight text-black line-clamp-2">
              {event.autograph_guests}
            </p>
          )}
        </div>

        <div className="flex w-[107px] flex-col items-center justify-center gap-2 rounded-tr-lg border border-[#F2EFFE] bg-[#FEF9FF] px-2 py-3">
          <div className="text-base font-medium tracking-tight text-black">
            {format(new Date(event.date_start), "d MMM")}
          </div>
          {event.date_end && event.date_end !== event.date_start && (
            <>
              <div className="h-px w-[26px] bg-[#CBBEFB]" />
              <div className="text-base font-medium tracking-tight text-black">
                {format(new Date(event.date_end), "d MMM")}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex w-full">
        <button className="flex-1 border border-[#F2EFFE] bg-[#FEF9FF] py-3 text-xs font-medium tracking-tight text-[#8B5CF6]">
          Save
        </button>
        <Link
          href={`/events/${event.slug}`}
          className="flex-1 border border-[#F2EFFE] bg-[#FEF9FF] py-3 text-center text-xs font-medium tracking-tight text-[#8B5CF6]"
        >
          Details
        </Link>
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-br-lg border border-[#F2EFFE] bg-[#FEF9FF] py-3 text-center text-xs font-medium tracking-tight text-[#8B5CF6]"
          >
            Web
          </a>
        )}
      </div>
    </div>
  );
}
