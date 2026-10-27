"use client";

import { CalendarDays } from "lucide-react";

export type DateRange = "today" | "7d" | "30d" | "90d" | "year" | "all";

interface Props {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

const ranges: {
  label: string;
  value: DateRange;
}[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

export default function DateFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <CalendarDays className="h-5 w-5 text-slate-500" />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DateRange)}
        className="bg-transparent text-sm font-medium outline-none"
      >
        {ranges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}
