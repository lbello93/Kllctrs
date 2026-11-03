"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowUpDown, ChevronLeft, ChevronRight, GitCompare, Search } from "lucide-react";
import type {
  CategorySummary,
  SponsorListFiltersState,
  SponsorRow,
  SponsorSort,
} from "./types";

interface Props {
  rows: SponsorRow[];
  categories: CategorySummary[];
  total: number;
  page: number;
  limit: number;
  filters: SponsorListFiltersState;
}

const COLS: { key: SponsorSort | null; label: string; className?: string }[] = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "events", label: "Events", className: "text-right" },
  { key: null, label: "States", className: "text-right" },
  { key: null, label: "Top Tier", className: "text-right" },
];

export default function SponsorsListClient({ rows, categories, total, page, limit, filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const navigate = (overrides: Record<string, string | null>) => {
    const base: Record<string, string> = {};
    if (filters.category) base.category = filters.category;
    if (filters.search) base.search = filters.search;
    if (filters.sortBy !== "name") base.sortBy = filters.sortBy;
    if (filters.hasEventsThisYear) base.hasEventsThisYear = "true";
    if (page > 1) base.page = String(page);
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "") delete base[k];
      else base[k] = v;
    }
    const qs = new URLSearchParams(base).toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setSort = (key: SponsorSort) => navigate({ sortBy: key === "name" ? null : key, page: null });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">Sponsor Intelligence</h1>
          <p className="mt-1 text-sm text-[#4a3f6b]/60">
            Who sponsors the hobby&apos;s shows — how often, at what tier, and where.
          </p>
        </div>
        <Link
          href="/sponsors/compare"
          className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-[#4a3f6b] hover:bg-violet-50"
        >
          <GitCompare className="h-4 w-4" /> Compare sponsors
        </Link>
      </header>

      {/* Category summary cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.slice(0, 10).map((c) => (
          <button
            key={c.category}
            onClick={() => navigate({ category: filters.category === c.category ? null : c.category, page: null })}
            className={`rounded-xl border p-3 text-left transition-colors ${
              filters.category === c.category
                ? "border-[#5f2eea] bg-violet-50"
                : "border-violet-100 bg-white hover:border-violet-200"
            }`}
          >
            <div className="text-lg font-black text-[#5f2eea]">{c.count}</div>
            <div className="truncate text-xs text-[#4a3f6b]/60">{c.category}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
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
            key={filters.search}
            defaultValue={filters.search}
            placeholder="Search sponsors…"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#1a0a3d] placeholder-[#4a3f6b]/30 focus:outline-none"
          />
        </form>

        <select
          value={filters.category}
          onChange={(e) => navigate({ category: e.target.value || null, page: null })}
          className="h-10 rounded-xl border border-violet-200 bg-white px-3 text-sm text-[#1a0a3d]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>{c.category}</option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => navigate({ sortBy: e.target.value === "name" ? null : e.target.value, page: null })}
          className="h-10 rounded-xl border border-violet-200 bg-white px-3 text-sm text-[#1a0a3d]"
        >
          <option value="name">Sort: Name</option>
          <option value="events">Sort: Event count</option>
          <option value="category">Sort: Category</option>
        </select>

        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-sm font-medium text-[#1a0a3d]">
          <input
            type="checkbox"
            checked={filters.hasEventsThisYear}
            onChange={(e) => navigate({ hasEventsThisYear: e.target.checked ? "true" : null, page: null })}
            className="h-4 w-4 rounded border-violet-300 text-violet-600"
          />
          Active this year
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-violet-100 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-violet-100 text-left text-[11px] font-black uppercase tracking-wider text-[#4a3f6b]/50">
              {COLS.map((col) => (
                <th key={col.label} className={`px-4 py-3 ${col.className ?? ""}`}>
                  {col.key ? (
                    <button
                      onClick={() => setSort(col.key as SponsorSort)}
                      className={`inline-flex items-center gap-1 hover:text-[#5f2eea] ${
                        filters.sortBy === col.key ? "text-[#5f2eea]" : ""
                      }`}
                    >
                      {col.label} <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="px-4 py-10 text-center text-[#4a3f6b]/50">
                  No sponsors match your filters.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.sponsor_id}
                  onClick={() => router.push(`/sponsors/${r.sponsor_id}`)}
                  className="cursor-pointer border-b border-violet-50 last:border-0 hover:bg-violet-50/50"
                >
                  <td className="px-4 py-3 font-semibold text-[#1a0a3d]">{r.name ?? "—"}</td>
                  <td className="px-4 py-3 text-[#4a3f6b]/70">
                    {r.category && (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700">
                        {r.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#1a0a3d]">{r.total_events_sponsored}</td>
                  <td className="px-4 py-3 text-right text-[#4a3f6b]/70">{r.states_present_in?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right text-[#4a3f6b]/70">{r.top_tier_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate({ page: page > 2 ? String(page - 1) : null })}
            disabled={page <= 1}
            className="flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#4a3f6b] disabled:opacity-40 hover:enabled:bg-violet-50"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-sm text-[#4a3f6b]/60">Page {page} of {totalPages}</span>
          <button
            onClick={() => navigate({ page: String(page + 1) })}
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
