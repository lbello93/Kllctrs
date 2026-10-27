"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import EventCard from "@/components/maps/cards/EventCard";
import { EmptyPanel, SectionHeader } from "../shared/SectionShell";
import type { Event } from "@/types";

interface Props {
  events?: Event[];
}

export default function SavedEvents({ events = [] }: Props) {
  const safeEvents = Array.isArray(events) ? events : [];

  const [savedEventIds, setSavedEventIds] = useState<string[]>(
    safeEvents.map((event) => event.id),
  );

  const visibleEvents = safeEvents.filter((event) =>
    savedEventIds.includes(event.id),
  );

  return (
    <section>
      <SectionHeader
        title="Saved events"
        subtitle="Card shows and meetups you want to remember."
        count={visibleEvents.length}
      />

      {visibleEvents.length === 0 ? (
        <EmptyPanel
          icon={<CalendarDays className="h-6 w-6" />}
          title="No saved events yet"
          text="Save a card show and it will show up here so you never miss it."
          ctaLabel="Browse events"
          ctaHref="/maps"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEventIds.includes(event.id)}
              savedEventIds={savedEventIds}
              setSavedEventIds={setSavedEventIds}
            />
          ))}
        </div>
      )}
    </section>
  );
}
