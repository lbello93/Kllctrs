"use client";

import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Trophy, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import type { EventListItem } from "./types";
import { EVENT_TYPE_LABEL } from "./types";

function dateLabel(start: string, end: string | null) {
  const s = new Date(`${start.slice(0, 10)}T00:00:00`);
  if (!end || end.slice(0, 10) === start.slice(0, 10)) return format(s, "EEE, MMM d, yyyy");
  const e = new Date(`${end.slice(0, 10)}T00:00:00`);
  return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
}

export default function ListView({
  events,
  page,
  pageSize,
  total,
  onPageChange,
}: {
  events: EventListItem[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-violet-100 bg-white p-10 text-center">
        <p className="text-sm text-[#4a3f6b]/60">No events match your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              href={`/maps/events/${e.slug}`}
              className="block rounded-xl border border-violet-100 bg-white p-4 shadow-sm transition-all hover:border-[#5f2eea]/40 hover:shadow-violet-200/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-black text-[#1a0a3d]">{e.name}</h3>
                    {e.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-label="Verified" />}
                    {e.is_featured && (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#4a3f6b]/60">
                    <CalendarDays className="h-3.5 w-3.5" /> {dateLabel(e.date_start, e.date_end)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#4a3f6b]/60">
                    <MapPin className="h-3.5 w-3.5" />
                    {e.venue_name ? `${e.venue_name} · ` : ""}{e.city}, {e.state}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {e.event_type && (
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                      {EVENT_TYPE_LABEL[e.event_type] ?? e.event_type}
                    </span>
                  )}
                  {e.sponsorCount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-[#4a3f6b]/50">
                      <Trophy className="h-3.5 w-3.5" /> {e.sponsorCount} sponsor{e.sponsorCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#4a3f6b] disabled:opacity-40 hover:enabled:bg-violet-50"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-sm text-[#4a3f6b]/60">Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#4a3f6b] disabled:opacity-40 hover:enabled:bg-violet-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
