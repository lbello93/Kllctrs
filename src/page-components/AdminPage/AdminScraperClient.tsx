"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  SkipForward,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

const HIGH_VOLUME_STATES = [
  "CA",
  "TX",
  "FL",
  "NY",
  "PA",
  "OH",
  "IL",
  "GA",
  "NC",
  "NJ",
];

interface ScrapeResult {
  success: boolean;
  scraped: number;
  inserted: number;
  skipped: number;
  errors: string[];
  message: string;
}

export default function AdminScraperClient() {
  const [selectedStates, setSelectedStates] =
    useState<string[]>(HIGH_VOLUME_STATES);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const toggleState = (s: string) =>
    setSelectedStates((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const selectAll = () => setSelectedStates([...US_STATES]);
  const selectNone = () => setSelectedStates([]);
  const selectTop = () => setSelectedStates(HIGH_VOLUME_STATES);

  const runScraper = async () => {
    if (selectedStates.length === 0) return;
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ states: selectedStates }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setResult({
        success: false,
        scraped: 0,
        inserted: 0,
        skipped: 0,
        errors: [err instanceof Error ? err.message : "Scraper request failed"],
        message: "Scraper failed to run.",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Event Scraper
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          Automated source collection is paused until we have permission or an
          approved data feed. New records will remain pending review.
        </p>
      </div>

      {/* Source info */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-[#5f2eea]" />
          </div>
          <div>
            <p className="text-sm font-black text-[#1a0a3d]">
              Source access status
            </p>
            <p className="text-xs text-[#4a3f6b]/40">
              TCDB prohibits scraping and commercial reuse without consent. CardShowHub requires written permission for automation. Sports Collectors Digest access is unverified; ingestion is gated for all three sources.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[#4a3f6b]/50">
          <span className="bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg">
            Scheduled ingestion unavailable
          </span>
          <span className="bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg">
            Source permission required
          </span>
          <span className="bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg">
            All events added as &quot;pending&quot; for your review
          </span>
          <span className="bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg">
            Organizer submissions remain available
          </span>
        </div>
      </div>

      {/* State selector */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
            Select States ({selectedStates.length} selected)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={selectTop}
              disabled
              className="text-xs px-2.5 py-1 rounded-lg border border-violet-200 text-[#5f2eea] hover:bg-violet-50 cursor-pointer transition-colors"
            >
              Top 10
            </button>
            <button
              onClick={selectAll}
              disabled
              className="text-xs px-2.5 py-1 rounded-lg border border-violet-200 text-[#5f2eea] hover:bg-violet-50 cursor-pointer transition-colors"
            >
              All
            </button>
            <button
              onClick={selectNone}
              disabled
              className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
            >
              None
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {US_STATES.map((s) => {
            const isSelected = selectedStates.includes(s);
            const isHot = HIGH_VOLUME_STATES.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleState(s)}
                disabled
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#5f2eea] text-white border-[#5f2eea] shadow-sm shadow-violet-500/20"
                    : isHot
                      ? "bg-violet-50 text-[#5f2eea] border-violet-300 hover:bg-violet-100"
                      : "bg-white text-[#4a3f6b]/50 border-violet-100 hover:border-violet-300"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-[#4a3f6b]/30 mt-3">
          State selection is paused until an authorized source feed is configured.
        </p>
      </div>

      {/* Run button */}
      <motion.button
        onClick={runScraper}
        disabled
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-12 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 border-0 shadow-xl shadow-violet-500/25 disabled:opacity-40 cursor-pointer"
        style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
      >
        {running ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Scraping{" "}
            {selectedStates.length} states…
          </>
        ) : (
          <>
            <Play className="w-4 h-4" /> Source access required
          </>
        )}
      </motion.button>

      {running && (
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 text-center space-y-2">
          <Loader2 className="w-6 h-6 text-[#5f2eea] animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#1a0a3d]">
            Scraping in progress…
          </p>
          <p className="text-xs text-[#4a3f6b]/50">
            Fetching {selectedStates.length} states from TCDB. This may take{" "}
            {Math.ceil(selectedStates.length * 1.5)} seconds.
          </p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div
              className={`rounded-2xl border p-5 ${
                result.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <p
                  className={`text-sm font-bold ${result.success ? "text-green-800" : "text-red-800"}`}
                >
                  {result.message}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/60 border border-green-200 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Globe className="w-3.5 h-3.5 text-[#5f2eea]" />
                  </div>
                  <p className="text-2xl font-black text-[#5f2eea]">
                    {result.scraped}
                  </p>
                  <p className="text-[10px] text-[#4a3f6b]/50 uppercase tracking-wider">
                    Found
                  </p>
                </div>
                <div className="rounded-xl bg-white/60 border border-green-200 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Database className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <p className="text-2xl font-black text-green-600">
                    {result.inserted}
                  </p>
                  <p className="text-[10px] text-[#4a3f6b]/50 uppercase tracking-wider">
                    Added
                  </p>
                </div>
                <div className="rounded-xl bg-white/60 border border-green-200 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <SkipForward className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-600">
                    {result.skipped}
                  </p>
                  <p className="text-[10px] text-[#4a3f6b]/50 uppercase tracking-wider">
                    Duplicates
                  </p>
                </div>
              </div>
            </div>

            {/* Next step */}
            {result.inserted > 0 && (
              <div className="rounded-2xl border border-violet-100 bg-white/80 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1a0a3d]">
                    {result.inserted} new events are pending review
                  </p>
                  <p className="text-xs text-[#4a3f6b]/50 mt-0.5">
                    Go to Events → Pending to approve or reject them
                  </p>
                </div>
                <a
                  href="/admin/events?status=pending"
                  className="h-9 px-4 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                  }}
                >
                  Review Events →
                </a>
              </div>
            )}

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <button
                  onClick={() => setShowErrors((s) => !s)}
                  className="flex items-center justify-between w-full cursor-pointer"
                >
                  <p className="text-sm font-bold text-red-700">
                    {result.errors.length} error
                    {result.errors.length !== 1 ? "s" : ""}
                  </p>
                  {showErrors ? (
                    <ChevronUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-red-500" />
                  )}
                </button>
                {showErrors && (
                  <ul className="mt-3 space-y-1">
                    {result.errors.map((e, i) => (
                      <li key={i} className="text-xs text-red-600 font-mono">
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
