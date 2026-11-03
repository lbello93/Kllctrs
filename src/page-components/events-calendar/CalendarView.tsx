"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { EventListItem } from "./types";
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL } from "./types";

const dayKey = (iso: string) => iso.slice(0, 10);

export default function CalendarView({
  events,
  month,
  onMonthChange,
}: {
  events: EventListItem[];
  month: string;
  onMonthChange: (month: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const [year, m] = month.split("-").map(Number);
  const monthDate = new Date(year, m - 1, 1);
  const gridStart = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const byDay = new Map<string, EventListItem[]>();
  for (const e of events) {
    const key = dayKey(e.date_start);
    const list = byDay.get(key) ?? [];
    list.push(e);
    byDay.set(key, list);
  }

  const selectedEvents = selected ? byDay.get(selected) ?? [] : [];

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-[#1a0a3d]">{format(monthDate, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => onMonthChange(format(addMonths(monthDate, -1), "yyyy-MM"))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-white text-[#4a3f6b] hover:bg-violet-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMonthChange(format(new Date(), "yyyy-MM"))}
            className="rounded-lg border border-violet-200 bg-white px-3 text-xs font-semibold text-[#4a3f6b] hover:bg-violet-50"
          >
            Today
          </button>
          <button
            onClick={() => onMonthChange(format(addMonths(monthDate, 1), "yyyy-MM"))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-white text-[#4a3f6b] hover:bg-violet-50"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-wider text-[#4a3f6b]/40">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = byDay.get(key) ?? [];
          const inMonth = isSameMonth(day, monthDate);
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => setSelected(dayEvents.length ? key : null)}
              className={`flex min-h-[64px] flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors sm:min-h-[84px] ${
                isSelected
                  ? "border-[#5f2eea] bg-violet-50"
                  : "border-violet-100 bg-white hover:border-violet-200"
              } ${inMonth ? "" : "opacity-40"} ${dayEvents.length ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`text-xs font-bold ${
                  isToday(day) ? "flex h-5 w-5 items-center justify-center rounded-full bg-[#5f2eea] text-white" : "text-[#1a0a3d]"
                }`}
              >
                {format(day, "d")}
              </span>
              <span className="flex flex-wrap gap-0.5">
                {dayEvents.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: EVENT_TYPE_COLOR[e.event_type ?? "default"] ?? EVENT_TYPE_COLOR.default }}
                    title={e.name}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[9px] font-bold text-[#4a3f6b]/50">+{dayEvents.length - 3}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected day's events */}
      {selected && (
        <div className="mt-5 rounded-xl border border-violet-100 bg-white p-4">
          <h3 className="mb-3 text-sm font-black text-[#1a0a3d]">
            {format(new Date(`${selected}T00:00:00`), "EEEE, MMMM d")}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-[#4a3f6b]/50">No events.</p>
          ) : (
            <ul className="space-y-2">
              {selectedEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/maps/events/${e.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-violet-50 px-3 py-2 hover:border-violet-200 hover:bg-violet-50/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#1a0a3d]">{e.name}</span>
                      <span className="flex items-center gap-1 text-xs text-[#4a3f6b]/50">
                        <MapPin className="h-3 w-3" /> {e.city}, {e.state}
                      </span>
                    </span>
                    {e.event_type && (
                      <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                        {EVENT_TYPE_LABEL[e.event_type] ?? e.event_type}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
