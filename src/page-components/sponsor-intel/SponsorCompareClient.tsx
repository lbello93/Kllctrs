"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, X } from "lucide-react";
import { TIER_LABELS, type CompareEntry, type SharedEvent } from "./types";

interface Props {
  selectedIds: string[];
  sponsors: CompareEntry[];
  sharedEvents: SharedEvent[];
  options: { id: string; name: string }[];
}

export default function SponsorCompareClient({ selectedIds, sponsors, sharedEvents, options }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const setIds = (ids: string[]) => {
    const unique = [...new Set(ids)].slice(0, 4);
    router.push(unique.length ? `${pathname}?ids=${unique.join(",")}` : pathname, { scroll: false });
  };
  const add = (id: string) => id && setIds([...selectedIds, id]);
  const remove = (id: string) => setIds(selectedIds.filter((x) => x !== id));

  // Preserve the selected order for columns.
  const byId = new Map(sponsors.map((s) => [s.id, s]));
  const ordered = selectedIds.map((id) => byId.get(id)).filter((s): s is CompareEntry => Boolean(s));

  const available = options.filter((o) => !selectedIds.includes(o.id));

  const metricRows: { label: string; render: (s: CompareEntry) => ReactNode }[] = [
    { label: "Category", render: (s) => s.category ?? "—" },
    { label: "Total events", render: (s) => s.totalEvents },
    { label: "Events this year", render: (s) => s.eventsThisYear },
    { label: "States active", render: (s) => s.states.length },
    {
      label: "Tier distribution",
      render: (s) => (
        <span className="flex flex-wrap gap-1">
          {TIER_LABELS.map((t) => (
            <span key={t.key} className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] text-violet-700">
              {t.label}: {s.tierDistribution[t.key]}
            </span>
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">Compare Sponsors</h1>
          <p className="mt-1 text-sm text-[#4a3f6b]/60">Select 2–4 sponsors to compare side by side.</p>
        </div>
        <Link href="/sponsors" className="text-sm font-medium text-[#5B18BE] hover:text-violet-900">
          ← All sponsors
        </Link>
      </header>

      {/* Picker */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {selectedIds.map((id) => {
          const s = byId.get(id);
          return (
            <span key={id} className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white py-1 pl-3 pr-1.5 text-sm font-semibold text-[#1a0a3d]">
              {s?.name ?? "…"}
              <button onClick={() => remove(id)} aria-label="Remove" className="rounded-full p-0.5 hover:bg-violet-100">
                <X className="h-3.5 w-3.5 text-[#4a3f6b]/60" />
              </button>
            </span>
          );
        })}
        {selectedIds.length < 4 && (
          <label className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-violet-300 bg-white px-3 py-1 text-sm text-[#4a3f6b]/70">
            <Plus className="h-3.5 w-3.5" />
            <select
              value=""
              onChange={(e) => add(e.target.value)}
              className="bg-transparent text-sm focus:outline-none"
            >
              <option value="">Add sponsor…</option>
              {available.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {ordered.length === 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-white p-10 text-center text-sm text-[#4a3f6b]/60">
          Add sponsors above to start comparing.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-violet-100 bg-white">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-violet-100">
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-[#4a3f6b]/50">
                    Metric
                  </th>
                  {ordered.map((s) => (
                    <th key={s.id} className="px-4 py-3 text-left">
                      <Link href={`/sponsors/${s.id}`} className="font-black text-[#1a0a3d] hover:text-[#5f2eea]">
                        {s.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => (
                  <tr key={row.label} className="border-b border-violet-50 last:border-0">
                    <td className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-[#4a3f6b]/50">
                      {row.label}
                    </td>
                    {ordered.map((s) => (
                      <td key={s.id} className="px-4 py-3 text-[#1a0a3d]">{row.render(s)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shared events */}
          <section className="mt-5 rounded-2xl border border-violet-100 bg-white p-5">
            <h2 className="mb-3 text-lg font-black text-[#1a0a3d]">Shared events</h2>
            {sharedEvents.length === 0 ? (
              <p className="text-sm text-[#4a3f6b]/50">No events are sponsored by more than one of these sponsors.</p>
            ) : (
              <ul className="space-y-1.5">
                {sharedEvents.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/maps/events/${e.slug}`}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm hover:bg-violet-50"
                    >
                      <span className="truncate text-[#1a0a3d]">{e.name}</span>
                      <span className="shrink-0 text-xs text-[#4a3f6b]/50">{e.sponsorCount} of these sponsors</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
