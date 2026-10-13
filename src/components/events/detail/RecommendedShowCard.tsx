"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Event } from "@/types";

interface Props {
  event: Event;
  isSaved: boolean;
}

export default function RecommendedShowCard({
  event,
  isSaved: initialSaved,
}: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/events/${event.id}/save`, {
        method: "POST",
      });

      if (res.status === 401) {
        setIsSaved(wasSaved);
        router.push(`/login?redirect=/events/${event.slug}`);
        return;
      }

      if (!res.ok) {
        setIsSaved(wasSaved);
        toast.error("Something went wrong");
        return;
      }

      const data: { saved: boolean } = await res.json();
      setIsSaved(data.saved);
    } catch {
      setIsSaved(wasSaved);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E9E3F4] bg-white shadow-[0_8px_24px_rgba(21,30,60,0.05)]">
      <div className="flex min-w-0 flex-1 gap-3 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-[#FFF5D9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#80621B]">Upcoming</span>
          <h3 className="mt-3 line-clamp-2 break-words font-space-grotesk text-base font-semibold leading-6 text-[#151E3C] sm:text-lg">
            {event.name}
          </h3>
          <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-[#596078]">
            {event.venue_name ? `${event.venue_name} · ${event.city}, ${event.state}` : `${event.city}, ${event.state}`}
          </p>
          {event.autograph_guests && (
            <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-[#596078]">
              {event.autograph_guests}
            </p>
          )}
        </div>
        <div className="flex w-[76px] shrink-0 flex-col items-center justify-center self-start rounded-xl bg-[#F5F0FF] px-2 py-3 text-center sm:w-[88px]">
          <span className="font-space-grotesk text-lg font-semibold text-[#5B18BE]">
            {format(parseISO(event.date_start), "d")}
          </span>
          <span className="font-inter text-xs font-medium uppercase tracking-wide text-[#5B18BE]">
            {format(parseISO(event.date_start), "MMM")}
          </span>
          {event.date_end && event.date_end !== event.date_start && (
            <span className="mt-1 border-t border-[#D8C9FF] pt-1 font-inter text-[10px] text-[#777B8D]">
              thru {format(parseISO(event.date_end), "d MMM")}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full border-t border-[#EEE9F7] bg-[#FCFBFE]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 border-r border-[#EEE9F7] px-2 py-3 text-xs font-semibold text-[#5B18BE] transition hover:bg-[#F5F0FF] disabled:opacity-60"
        >
          {isSaved ? "Saved" : "Save"}
        </button>
        <Link
          href={`/events/${event.slug}`}
          className="flex-1 border-r border-[#EEE9F7] px-2 py-3 text-center text-xs font-semibold text-[#5B18BE] transition hover:bg-[#F5F0FF]"
        >
          Details
        </Link>
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-2 py-3 text-center text-xs font-semibold text-[#5B18BE] transition hover:bg-[#F5F0FF]"
          >
            Web
          </a>
        )}
      </div>
    </article>
  );
}
