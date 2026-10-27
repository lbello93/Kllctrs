"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Search,
  MapPin,
  X,
  ArrowRight,
  Navigation,
} from "lucide-react";
import type { Event } from "@/types";
import EventMap from "@/components/maps/map/EventMap";
import SaveButton from "@/components/auth/SaveButton";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

interface Props {
  initialEvents: Event[];
  savedIds: string[];
}

export default function EventsClient({ initialEvents, savedIds }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [stateFilter, setStateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filtered = useMemo(() => {
    let list = events.filter((item) => {
      const matchState = stateFilter === "all" || item.state === stateFilter;
      const matchSearch =
        !search ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.city?.toLowerCase().includes(search.toLowerCase()) ||
        item.venue_name?.toLowerCase().includes(search.toLowerCase());
      const matchDateFrom = !dateFrom || item.date_start >= dateFrom;
      const matchDateTo = !dateTo || item.date_start <= dateTo;
      return matchState && matchSearch && matchDateFrom && matchDateTo;
    });

    if (sortBy === "date_asc")
      list = [...list].sort(
        (a, b) =>
          new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
      );
    else if (sortBy === "date_desc")
      list = [...list].sort(
        (a, b) =>
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime(),
      );

    return list;
  }, [events, stateFilter, search, dateFrom, dateTo, sortBy]);

  const clearFilters = () => {
    setStateFilter("all");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSortBy("default");
  };

  const hasFilters =
    stateFilter !== "all" ||
    search ||
    dateFrom ||
    dateTo ||
    sortBy !== "default";

  return (
    <div className="min-h-screen bg-[#f4f3fb] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-black text-2xl sm:text-3xl text-[#1a0a3d]">
            Card Shows
          </h1>
          <p className="text-[#4a3f6b]/60 mt-1 text-sm">
            Find card shows and conventions across the country.
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="bg-white border-b border-violet-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a3f6b]/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or venue..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#f4f3fb] border border-violet-100 text-sm text-[#1a0a3d] placeholder-[#4a3f6b]/30 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all"
            />
          </div>

          {/* State filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#f4f3fb] border border-violet-100 text-sm text-[#1a0a3d] outline-none focus:border-violet-400 min-w-[100px]"
          >
            <option value="all">All States</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Date range */}
          <div className="flex items-center gap-1.5 bg-[#f4f3fb] border border-violet-100 rounded-xl px-3 h-9 shrink-0">
            <CalendarDays className="w-3.5 h-3.5 text-[#4a3f6b]/40 shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-sm text-[#1a0a3d] outline-none w-[120px]"
            />
            <span className="text-[#4a3f6b]/30 text-xs">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-sm text-[#1a0a3d] outline-none w-[120px]"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="text-[#4a3f6b]/40 hover:text-[#1a0a3d] ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#f4f3fb] border border-violet-100 text-sm text-[#1a0a3d] outline-none focus:border-violet-400 min-w-[140px]"
          >
            <option value="default">Sort: Default</option>
            <option value="date_asc">Earliest first</option>
            <option value="date_desc">Latest first</option>
          </select>

          {/* Results count + clear */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#4a3f6b]/50 bg-[#f4f3fb] border border-violet-100 px-3 py-1.5 rounded-full">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-violet-600 hover:text-violet-800 font-semibold"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map + List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden border border-violet-100 shadow-sm bg-white"
              style={{ height: "560px" }}
            >
              <EventMap
                events={filtered}
                selectedEvent={selectedEvent}
                onEventSelect={setSelectedEvent}
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-violet-100">
                <MapPin className="w-10 h-10 text-[#4a3f6b]/30 mx-auto mb-3" />
                <p className="text-sm text-[#4a3f6b]/50 mb-2">
                  No shows found matching your filters.
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <Link href={`/maps/events/${event.slug}`}>
                    <div
                      className={`group relative bg-white rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-md ${
                        selectedEvent?.id === event.id
                          ? "border-violet-400 shadow-md ring-2 ring-violet-200"
                          : "border-violet-100 hover:border-violet-300"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedEvent(event);
                      }}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black tracking-wider uppercase text-violet-600 bg-violet-100 px-2 py-0.5 rounded-lg">
                            {event.state}
                          </span>
                          {event.vendor_tables && (
                            <span className="text-[10px] text-[#4a3f6b]/40">
                              {event.vendor_tables} tables
                            </span>
                          )}
                        </div>
                        <div
                          className="shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SaveButton
                            eventId={event.id}
                            initialSaved={savedIds.includes(event.id)}
                            type="event"
                          />
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-bold text-sm text-[#1a0a3d] mb-1 group-hover:text-violet-700 transition-colors line-clamp-2">
                        {event.name}
                      </h3>

                      {/* Location */}
                      <p className="text-xs text-[#4a3f6b]/50 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue_name ? `${event.venue_name}, ` : ""}
                        {event.city}, {event.state}
                      </p>

                      {/* Date */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#4a3f6b]/60 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {format(new Date(event.date_start), "MMM d, yyyy")}
                          {event.date_end &&
                            event.date_end !== event.date_start && (
                              <>
                                {" "}
                                &ndash;{" "}
                                {format(new Date(event.date_end), "MMM d")}
                              </>
                            )}
                        </span>
                        <span className="text-[10px] text-violet-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
