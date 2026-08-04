"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, X } from "lucide-react";

const US_STATES: { slug: string; label: string }[] = [
  { slug: "alabama", label: "Alabama" },
  { slug: "alaska", label: "Alaska" },
  { slug: "arizona", label: "Arizona" },
  { slug: "arkansas", label: "Arkansas" },
  { slug: "california", label: "California" },
  { slug: "colorado", label: "Colorado" },
  { slug: "connecticut", label: "Connecticut" },
  { slug: "delaware", label: "Delaware" },
  { slug: "florida", label: "Florida" },
  { slug: "georgia", label: "Georgia" },
  { slug: "hawaii", label: "Hawaii" },
  { slug: "idaho", label: "Idaho" },
  { slug: "illinois", label: "Illinois" },
  { slug: "indiana", label: "Indiana" },
  { slug: "iowa", label: "Iowa" },
  { slug: "kansas", label: "Kansas" },
  { slug: "kentucky", label: "Kentucky" },
  { slug: "louisiana", label: "Louisiana" },
  { slug: "maine", label: "Maine" },
  { slug: "maryland", label: "Maryland" },
  { slug: "massachusetts", label: "Massachusetts" },
  { slug: "michigan", label: "Michigan" },
  { slug: "minnesota", label: "Minnesota" },
  { slug: "mississippi", label: "Mississippi" },
  { slug: "missouri", label: "Missouri" },
  { slug: "montana", label: "Montana" },
  { slug: "nebraska", label: "Nebraska" },
  { slug: "nevada", label: "Nevada" },
  { slug: "new-hampshire", label: "New Hampshire" },
  { slug: "new-jersey", label: "New Jersey" },
  { slug: "new-mexico", label: "New Mexico" },
  { slug: "new-york", label: "New York" },
  { slug: "north-carolina", label: "North Carolina" },
  { slug: "north-dakota", label: "North Dakota" },
  { slug: "ohio", label: "Ohio" },
  { slug: "oklahoma", label: "Oklahoma" },
  { slug: "oregon", label: "Oregon" },
  { slug: "pennsylvania", label: "Pennsylvania" },
  { slug: "rhode-island", label: "Rhode Island" },
  { slug: "south-carolina", label: "South Carolina" },
  { slug: "south-dakota", label: "South Dakota" },
  { slug: "tennessee", label: "Tennessee" },
  { slug: "texas", label: "Texas" },
  { slug: "utah", label: "Utah" },
  { slug: "vermont", label: "Vermont" },
  { slug: "virginia", label: "Virginia" },
  { slug: "washington", label: "Washington" },
  { slug: "west-virginia", label: "West Virginia" },
  { slug: "wisconsin", label: "Wisconsin" },
  { slug: "wyoming", label: "Wyoming" },
];

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, "0");
interface ScrapeResult {
  inserted: number;
  skipped: number;
  results: { name: string; city: string; state: string }[];
  errors: string[];
}

export default function ImportPage() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, "0");
  const [selectedMonth, setSelectedMonth] = useState<string>(CURRENT_MONTH);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [totals, setTotals] = useState({ inserted: 0, skipped: 0 });
  const [allResults, setAllResults] = useState<ScrapeResult["results"]>([]);
  const [allErrors, setAllErrors] = useState<string[]>([]);
  const cancelledRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const BATCH_SIZE = 5;

  const toggleState = (slug: string) => {
    setSelectedStates((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const selectAll = () => setSelectedStates(US_STATES.map((s) => s.slug));
  const clearAll = () => setSelectedStates([]);

  const runScrape = async (statesToRun: string[]) => {
    if (statesToRun.length === 0) return;
    cancelledRef.current = false;
    setIsRunning(true);
    setTotals({ inserted: 0, skipped: 0 });
    setAllResults([]);
    setAllErrors([]);
    setProgress({ done: 0, total: statesToRun.length });

    for (let i = 0; i < statesToRun.length; i += BATCH_SIZE) {
      if (cancelledRef.current) break;
      const batch = statesToRun.slice(i, i + BATCH_SIZE);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const res = await fetch("/api/admin/events/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            states: batch,
            month: selectedMonth ? `${CURRENT_YEAR}-${selectedMonth}` : null,
          }),
          signal: controller.signal,
        });

        const data: ScrapeResult = await res.json();

        setTotals((prev) => ({
          inserted: prev.inserted + data.inserted,
          skipped: prev.skipped + data.skipped,
        }));
        setAllResults((prev) => [...prev, ...data.results]);
        setAllErrors((prev) => [...prev, ...data.errors]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setAllErrors((prev) => [...prev, "Scrape cancelled by user"]);
          break;
        }
        setAllErrors((prev) => [
          ...prev,
          `Batch ${batch.join(", ")}: request failed`,
        ]);
      }

      setProgress((prev) => ({
        ...prev,
        done: Math.min(i + BATCH_SIZE, statesToRun.length),
      }));
    }

    setIsRunning(false);
  };

  const cancelScrape = () => {
    cancelledRef.current = true;
    abortControllerRef.current?.abort();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Import Events
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          Select states to scrape, or run all 50
        </p>
      </div>

      {/* State picker */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm p-6">
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-bold text-[#4a3f6b]/70">
            Filter by month:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={isRunning}
            className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm text-[#1a0a3d] outline-none disabled:opacity-50"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#5f2eea]">
            Select States ({selectedStates.length} selected)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              disabled={isRunning}
              className="text-xs font-bold text-[#5f2eea] hover:underline disabled:opacity-50"
            >
              Select All
            </button>
            <span className="text-xs text-[#4a3f6b]/30">·</span>
            <button
              onClick={clearAll}
              disabled={isRunning}
              className="text-xs font-bold text-[#4a3f6b]/50 hover:underline disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
          {US_STATES.map((s) => (
            <label
              key={s.slug}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                selectedStates.includes(s.slug)
                  ? "border-[#5f2eea] bg-[#5f2eea]/8 text-[#5f2eea]"
                  : "border-violet-100 text-[#4a3f6b]/60 hover:border-violet-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedStates.includes(s.slug)}
                onChange={() => toggleState(s.slug)}
                disabled={isRunning}
                className="accent-[#5f2eea]"
              />
              {s.label}
            </label>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => runScrape(selectedStates)}
            disabled={isRunning || selectedStates.length === 0}
            className="flex items-center gap-2 rounded-lg bg-[#5f2eea] px-5 py-3 text-sm font-bold text-white hover:bg-[#4a1fa8] disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running... ({progress.done}/{progress.total} states)
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Scrape Selected States
              </>
            )}
          </button>

          <button
            onClick={() => runScrape(US_STATES.map((s) => s.slug))}
            disabled={isRunning}
            className="rounded-lg border border-violet-200 px-5 py-3 text-sm font-bold text-[#4a3f6b]/70 hover:bg-violet-50 disabled:opacity-50"
          >
            Run Full USA Scrape
          </button>

          {isRunning && (
            <button
              onClick={cancelScrape}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        {isRunning && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-violet-50">
            <div
              className="h-full bg-[#5f2eea] transition-all"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        )}

        {(totals.inserted > 0 || totals.skipped > 0) && (
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="font-bold text-[#1a0a3d]">
                {totals.inserted}
              </span>
              <span className="text-[#4a3f6b]/60">
                new events added (pending review)
              </span>
            </div>
            <div className="text-sm text-[#4a3f6b]/60">
              <span className="font-bold">{totals.skipped}</span> duplicates
              skipped
            </div>
          </div>
        )}
      </div>

      {allResults.length > 0 && (
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm p-6">
          <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-[#5f2eea]">
            Newly Added ({allResults.length})
          </h2>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {allResults.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-violet-50 p-3 text-sm"
              >
                <span className="font-medium text-[#1a0a3d]">{r.name}</span>
                <span className="text-[#4a3f6b]/50">
                  {r.city}, {r.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allErrors.length > 0 && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-red-600">
            Errors ({allErrors.length})
          </h2>
          <div className="space-y-1 text-xs text-red-500">
            {allErrors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
