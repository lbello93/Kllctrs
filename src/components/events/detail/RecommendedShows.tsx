import RecommendedShowCard from "./RecommendedShowCard";
import type { Event } from "@/types";

interface Props {
  events: Event[];
  savedEventIds: string[];
}

export default function RecommendedShows({ events, savedEventIds }: Props) {
  if (events.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-5">
      <div>
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#8B5CF6]">Keep exploring</p>
        <h2 className="mt-1 font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] sm:text-[28px]">
          Recommended Shows Nearby
        </h2>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((ev) => (
          <RecommendedShowCard
            key={ev.id}
            event={ev}
            isSaved={savedEventIds.includes(ev.id)}
          />
        ))}
      </div>
    </section>
  );
}
