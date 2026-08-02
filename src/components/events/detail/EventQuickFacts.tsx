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
    <div className="flex flex-col gap-6 rounded-lg bg-[#FEF9FF] p-6 md:flex-row md:justify-between md:gap-6 md:p-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-6 w-6 text-[#8B5CF6]" strokeWidth={2.5} />
          <span className="text-sm font-bold uppercase tracking-tight">
            Date
          </span>
        </div>
        <div>
          <div className="text-xl tracking-tight text-black">{dateRange}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-6 w-6 text-[#8B5CF6]" strokeWidth={2.5} />
          <span className="text-sm font-bold uppercase tracking-tight">
            Venue
          </span>
        </div>
        <div>
          {event.venue_name && (
            <div className="text-xl tracking-tight text-black">
              {event.venue_name}
            </div>
          )}
          <div className="text-sm tracking-tight text-black">
            {event.city}, {event.state} {event.zip_code}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <Tag className="h-6 w-6 text-[#8B5CF6]" strokeWidth={2.5} />
          <span className="text-sm font-bold uppercase tracking-tight text-[#151E3C]">
            Categories
          </span>
        </div>
        <div>
          <div className="text-xl tracking-tight text-black">
            {event.sponsors?.slice(0, 2).join(", ") || "General"}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <Star className="h-6 w-6 text-[#8B5CF6]" strokeWidth={2.5} />
          <span className="text-sm font-bold uppercase tracking-tight">
            Reviews
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl tracking-tight text-black">
              {avgRating ? avgRating.toFixed(1) : "—"}
            </span>
            <Star className="h-5 w-5 fill-[#F0C040] text-[#F0C040]" />
          </div>
          <span className="text-sm tracking-tight text-black">
            ({reviewCount} Review{reviewCount === 1 ? "" : "s"})
          </span>
        </div>
      </div>
    </div>
  );
}
