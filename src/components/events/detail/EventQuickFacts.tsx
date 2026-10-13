import { Calendar, MapPin, Tag, Star } from "lucide-react";
import type { Event } from "@/types";

interface Props {
  event: Event;
  dateRange: string;
  avgRating: number | null;
  reviewCount: number;
}

export default function EventQuickFacts({
  event,
  dateRange,
  avgRating,
  reviewCount,
}: Props) {
  return (
    <section aria-label="Event details" className="grid gap-5 rounded-2xl border border-[#E9E3F4] bg-white p-5 shadow-[0_12px_36px_rgba(21,30,60,0.05)] sm:grid-cols-2 sm:p-7 xl:grid-cols-4">
      <div className="min-w-0 rounded-xl bg-[#F8F5FF] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 shrink-0 text-[#8B5CF6]" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#596078]">
            Date
          </span>
        </div>
        <div className="break-words font-space-grotesk text-base font-semibold leading-6 text-[#151E3C] sm:text-lg">
          {dateRange}
        </div>
      </div>

      <div className="min-w-0 rounded-xl bg-[#F8F5FF] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 shrink-0 text-[#8B5CF6]" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#596078]">
            Venue
          </span>
        </div>
        <div className="min-w-0">
          {event.venue_name && (
            <div className="break-words font-space-grotesk text-base font-semibold leading-6 text-[#151E3C] sm:text-lg">
              {event.venue_name}
            </div>
          )}
          <div className="mt-1 break-words text-sm leading-5 text-[#596078]">
            {[event.city, event.state, event.zip_code].filter(Boolean).join(", ")}
          </div>
        </div>
      </div>

      <div className="min-w-0 rounded-xl bg-[#F8F5FF] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5 shrink-0 text-[#8B5CF6]" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#596078]">
            Sponsors
          </span>
        </div>
        <div className="break-words font-space-grotesk text-base font-semibold leading-6 text-[#151E3C] sm:text-lg">
          {event.sponsors?.slice(0, 2).join(", ") || "To be announced"}
        </div>
      </div>

      <div className="min-w-0 rounded-xl bg-[#F8F5FF] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-5 w-5 shrink-0 text-[#8B5CF6]" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#596078]">
            Reviews
          </span>
        </div>
        <div className="flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1">
          {avgRating ? (
            <>
              <div className="flex items-center gap-2">
                <span className="font-space-grotesk text-2xl font-semibold tracking-tight text-[#151E3C]">
                  {avgRating.toFixed(1)}
                </span>
                <Star className="h-4 w-4 fill-[#F0C040] text-[#F0C040]" />
              </div>
              <span className="text-xs text-[#596078]">
                {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </span>
            </>
          ) : (
            <span className="text-sm text-[#596078]">
              No reviews yet
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
