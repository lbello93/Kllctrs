"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CalendarDays, List, Search, SlidersHorizontal, X } from "lucide-react";

import FilterSidebar from "./FilterSidebar";
import CalendarView from "./CalendarView";
import ListView from "./ListView";
import type { EventFilters, EventListItem, EventView } from "./types";

interface Props {
  events: EventListItem[];
  view: EventView;
  filters: EventFilters;
  page: number;
  pageSize: number;
  total: number;
  month: string;
}

export default function EventsExplorer({ events, view, filters, page, pageSize, total, month }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build the next URL from the current props + overrides (null clears a key).
  const navigate = (overrides: Record<string, string | null>) => {
    const base: Record<string, string> = {};
    if (view !== "calendar") base.view = view;
    if (filters.state) base.state = filters.state;
    if (filters.city) base.city = filters.city;
    if (filters.startDate) base.startDate = filters.startDate;
    if (filters.endDate) base.endDate = filters.endDate;
    if (filters.type) base.type = filters.type;
    if (filters.search) base.search = filters.search;
    if (filters.hasSponsors) base.hasSponsors = "true";
    if (month) base.month = month;
    if (page > 1) base.page = String(page);

    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "") delete base[k];
      else base[k] = v;
    }
    const qs = new URLSearchParams(base).toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Filter changes always reset pagination to page 1.
  const onFilterChange = (updates: Partial<Record<keyof EventFilters, string | boolean>>) => {
    const normalized: Record<string, string | null> = { page: null };
    for (const [k, v] of Object.entries(updates)) {
      normalized[k] = typeof v === "boolean" ? (v ? "true" : null) : v || null;
    }
    navigate(normalized);
  };

  const onClear = () =>
    navigate({
      state: null, city: null, startDate: null, endDate: null,
      type: null, search: null, hasSponsors: null, page: null,
    });

  const setView = (next: EventView) => navigate({ view: next === "calendar" ? null : next });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5">
        <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">Card Show Calendar</h1>
        <p className="mt-1 text-sm text-[#4a3f6b]/60">
          Every upcoming show, convention, auction, and meetup in the hobby.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
            navigate({ search: value || null, page: null });
          }}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3"
        >
          <Search className="h-4 w-4 shrink-0 text-[#4a3f6b]/40" />
          <input
            name="q"
            // Uncontrolled + key so it resets to the URL value on navigation.
            key={filters.search}
            defaultValue={filters.search}
            placeholder="Search events…"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#1a0a3d] placeholder-[#4a3f6b]/30 focus:outline-none"
          />
        </form>

        <button
          onClick={() => setFiltersOpen(true)}
          className="flex h-10 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-sm font-semibold text-[#4a3f6b] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>

        <div className="flex h-10 overflow-hidden rounded-xl border border-violet-200 bg-white">
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 px-3 text-sm font-semibold ${
              view === "calendar" ? "bg-[#5f2eea] text-white" : "text-[#4a3f6b] hover:bg-violet-50"
            }`}
          >
            <CalendarDays className="h-4 w-4" /> Calendar
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 text-sm font-semibold ${
              view === "list" ? "bg-[#5f2eea] text-white" : "text-[#4a3f6b] hover:bg-violet-50"
            }`}
          >
            <List className="h-4 w-4" /> List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar — static on desktop, drawer on mobile */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-[100px] rounded-2xl border border-violet-100 bg-white p-4">
            <FilterSidebar filters={filters} onChange={onFilterChange} onClear={onClear} />
          </div>
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs overflow-y-auto bg-white p-4 shadow-xl">
              <div className="mb-3 flex justify-end">
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X className="h-5 w-5 text-[#4a3f6b]" />
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={onFilterChange} onClear={onClear} />
            </div>
          </div>
        )}

        {/* Main content */}
        <section className="lg:col-span-9">
          {view === "calendar" ? (
            <CalendarView
              events={events}
              month={month}
              onMonthChange={(next) => navigate({ month: next, page: null })}
            />
          ) : (
            <ListView
              events={events}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={(next) => navigate({ page: next > 1 ? String(next) : null })}
            />
          )}
        </section>
      </div>
    </div>
  );
}
