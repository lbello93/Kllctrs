"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

export interface SponsorEventItem {
  id: string;
  slug: string;
  name: string;
  date_start: string;
  date_end: string | null;
  state: string;
  city: string;
  event_type: string | null;
  tier: string;
}

const TIER_STYLE: Record<string, string> = {
  title: "bg-violet-100 text-violet-700",
  gold: "bg-amber-100 text-amber-700",
  silver: "bg-slate-100 text-slate-600",
  exhibitor: "bg-emerald-100 text-emerald-700",
};

export default function SponsorEventsList({ events }: { events: SponsorEventItem[] }) {
  const [year, setYear] = useState("");
  const [state, setState] = useState("");

  const years = useMemo(
    () => [...new Set(events.map((e) => e.date_start.slice(0, 4)))].sort((a, b) => b.localeCompare(a)),
    [events],
  );
  const states = useMemo(
    () => [...new Set(events.map((e) => e.state).filter(Boolean))].sort(),
    [events],
  );

  const filtered = events.filter(
    (e) => (!year || e.date_start.slice(0, 4) === year) && (!state || e.state === state),
  );

  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[#1a0a3d]">Events ({filtered.length})</h2>
        <div className="flex gap-2">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-9 rounded-lg border border-violet-200 bg-white px-2 text-sm text-[#1a0a3d]"
          >
            <option value="">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="h-9 rounded-lg border border-violet-200 bg-white px-2 text-sm text-[#1a0a3d]"
          >
            <option value="">All states</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#4a3f6b]/50">No events for this filter.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((e) => (
            <li key={e.id}>
              <Link
                href={`/maps/events/${e.slug}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-violet-50 px-3 py-2.5 hover:border-violet-200 hover:bg-violet-50/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1a0a3d]">{e.name}</p>
                  <p className="flex items-center gap-3 text-xs text-[#4a3f6b]/55">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {format(new Date(`${e.date_start.slice(0, 10)}T00:00:00`), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {e.city}, {e.state}
                    </span>
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                    TIER_STYLE[e.tier] ?? TIER_STYLE.exhibitor
                  }`}
                >
                  {e.tier}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
