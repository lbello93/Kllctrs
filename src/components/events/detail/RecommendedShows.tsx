import RecommendedShowCard from "./RecommendedShowCard";
import type { Event } from "@/types";

interface Props {
  events: Event[];
  savedEventIds: string[];
}

export default function RecommendedShows({ events, savedEventIds }: Props) {
  if (events.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-5">
      <h2 className="font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] md:text-[32px]">
        Recommended Shows Nearby
      </h2>
      <div className="flex flex-col gap-6 overflow-x-auto md:flex-row">
        {events.map((ev) => (
          <RecommendedShowCard
            key={ev.id}
            event={ev}
            isSaved={savedEventIds.includes(ev.id)}
          />
        ))}
      </div>
    </div>
  );
}
