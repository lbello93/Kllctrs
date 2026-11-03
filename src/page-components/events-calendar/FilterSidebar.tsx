"use client";

import { X } from "lucide-react";
import type { EventFilters } from "./types";
import { EVENT_TYPES, US_STATES } from "./types";

interface FilterSidebarProps {
  filters: EventFilters;
  onChange: (updates: Partial<Record<keyof EventFilters, string | boolean>>) => void;
  onClear: () => void;
}

const fieldClass =
  "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-[#1a0a3d] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30";
const labelClass = "mb-1.5 block text-[11px] font-black uppercase tracking-wider text-[#4a3f6b]/50";

export default function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  const selectedTypes = new Set(filters.type.split(",").filter(Boolean));
  const toggleType = (value: string) => {
    const next = new Set(selectedTypes);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange({ type: [...next].join(",") });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-[#1a0a3d]">Filters</h2>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-state">State</label>
        <select
          id="filter-state"
          value={filters.state}
          onChange={(e) => onChange({ state: e.target.value })}
          className={fieldClass}
        >
          <option value="">All states</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="filter-city">City</label>
        <input
          id="filter-city"
          // Uncontrolled + key: resets to the committed value on navigation,
          // commits the draft on blur / Enter (no synchronous setState sync).
          key={filters.city}
          defaultValue={filters.city}
          onBlur={(e) => e.target.value !== filters.city && onChange({ city: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") onChange({ city: (e.target as HTMLInputElement).value });
          }}
          placeholder="e.g. Chicago"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass} htmlFor="filter-start">From</label>
          <input
            id="filter-start"
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-end">To</label>
          <input
            id="filter-end"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <span className={labelClass}>Event type</span>
        <div className="space-y-1.5">
          {EVENT_TYPES.map((t) => (
            <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-[#4a3f6b]">
              <input
                type="checkbox"
                checked={selectedTypes.has(t.value)}
                onChange={() => toggleType(t.value)}
                className="h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-400/30"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-violet-200 bg-white px-3 py-2">
        <span className="text-sm font-medium text-[#1a0a3d]">Has sponsors</span>
        <input
          type="checkbox"
          checked={filters.hasSponsors}
          onChange={(e) => onChange({ hasSponsors: e.target.checked })}
          className="h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-400/30"
        />
      </label>
    </div>
  );
}
