"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Loader2,
  Sparkles,
  TriangleAlert,
  Lock,
  Database,
  Brain,
  BarChart3,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface EbayComp {
  title: string;
  price: number;
  currency: string;
  condition: string;
  date: string | null;
  image: string | null;
  url: string;
}

interface Valuation {
  low: number;
  mid: number;
  high: number;
  grade: string;
  trend: string;
  overview: string;
  recommendation: string;
  recommendationDetail: string;
  keyFactors: string[];
  recentSales: Array<{ label: string; price: string }>;
  remaining?: number | null;
}

const SPORTS = [
  "Baseball",
  "Basketball",
  "Football",
  "Hockey",
  "Soccer",
  "Pokemon",
  "Yu-Gi-Oh",
  "Magic",
  "Other",
];
const GRADES = [
  "Raw (Ungraded)",
  "PSA 10",
  "PSA 9",
  "PSA 8",
  "PSA 7",
  "BGS 10",
  "BGS 9.5",
  "BGS 9",
  "CGC 10",
  "CGC 9.5",
  "SGC 10",
  "SGC 9.5",
];
const GRADE_COLORS: Record<string, string> = {
  A: "text-green-600 bg-green-50 border border-green-200",
  B: "text-violet-600 bg-violet-50 border border-violet-200",
  C: "text-amber-700 bg-amber-50 border border-amber-200",
  D: "text-orange-600 bg-orange-50 border border-orange-200",
  F: "text-red-600 bg-red-50 border border-red-200",
};
const LOADING_STEPS = [
  {
    icon: Database,
    label: "Searching eBay for comparable sales…",
    duration: 2500,
  },
  { icon: BarChart3, label: "Analyzing market data…", duration: 2000 },
  { icon: Brain, label: "Running AI valuation model…", duration: 3000 },
  { icon: Sparkles, label: "Preparing your report…", duration: 1500 },
];

export default function CardValuation() {
  const [form, setForm] = useState({
    cardName: "",
    player: "",
    year: "",
    brand: "",
    sport: "Baseball",
    grade: "Raw (Ungraded)",
  });
  const [result, setResult] = useState<Valuation | null>(null);
  const [ebayComps, setEbayComps] = useState<EbayComp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading) {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
      return;
    }
    const advanceStep = (step: number) => {
      if (step >= LOADING_STEPS.length - 1) return;
      stepTimerRef.current = setTimeout(() => {
        setLoadingStep(step + 1);
        advanceStep(step + 1);
      }, LOADING_STEPS[step].duration);
    };
    advanceStep(0);
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [loading]);

  const update = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const analyze = async () => {
    if (!form.cardName.trim()) return;
    setLoadingStep(0);
    setLoading(true);
    setError("");
    setResult(null);
    setEbayComps([]);
    setLimitReached(false);

    try {
      // Step 1: Fetch real eBay comps
      const compsRes = await fetch("/api/cards/ebay-comps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const compsData = await compsRes.json();
      const comps: EbayComp[] = compsData.comps ?? [];
      setEbayComps(comps);

      // Step 2: AI valuation using the comps
      const valRes = await fetch("/api/cards/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ebayComps: comps }),
      });

      if (valRes.status === 401) {
        setError("Please log in to use card valuation.");
        return;
      }
      if (valRes.status === 429) {
        const d = await valRes.json();
        setLimitReached(true);
        setError(d.message);
        return;
      }
      if (!valRes.ok) throw new Error("Analysis failed");

      const valuation: Valuation = await valRes.json();
      setResult(valuation);
      if (valuation.remaining !== null && valuation.remaining !== undefined) {
        setRemaining(valuation.remaining);
      }
    } catch {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const trendNum = result ? parseFloat(result.trend) : 0;
  const hasResult = result || loading || limitReached;

  const inputClass =
    "w-full h-10 px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-sm font-medium text-[#4a3f6b] mb-1.5 block";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5f2eea] to-[#4a1fa8] flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">
                  AI Card Valuation
                </h1>
              </div>
              <p className="text-sm text-[#4a3f6b]/60">
                Get AI-powered market analysis and price estimates for any card
              </p>
            </div>
            {remaining !== null && (
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">
                  {remaining > 0 ? (
                    <>
                      <span className="text-[#5f2eea] font-black">
                        {remaining}
                      </span>{" "}
                      <span className="text-[#4a3f6b]/50">free left today</span>
                    </>
                  ) : (
                    <span className="text-[#4a3f6b]/50">0 free left</span>
                  )}
                </p>
                <Link
                  href="/pricing"
                  className="text-xs text-[#5f2eea] hover:text-[#4a1fa8] transition-colors"
                >
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`flex flex-col lg:flex-row gap-6 transition-all duration-500 ${hasResult ? "lg:items-start" : "items-center justify-center"}`}
        >
          {/* Form */}
          <motion.div
            layout
            className={`w-full transition-all duration-500 ${hasResult ? "lg:w-[420px] lg:shrink-0" : "max-w-xl"}`}
          >
            <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6 space-y-4 sticky top-28">
              <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
                Card Details
              </h2>

              <div>
                <label className={labelClass}>Card Name / Description *</label>
                <input
                  value={form.cardName}
                  onChange={(e) => update("cardName", e.target.value)}
                  placeholder="e.g. 1986 Fleer Michael Jordan #57"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Player / Character</label>
                  <input
                    value={form.player}
                    onChange={(e) => update("player", e.target.value)}
                    placeholder="e.g. Michael Jordan"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <input
                    value={form.year}
                    onChange={(e) => update("year", e.target.value)}
                    placeholder="e.g. 1986"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Brand / Set</label>
                  <input
                    value={form.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    placeholder="e.g. Fleer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sport / Category</label>
                  <select
                    value={form.sport}
                    onChange={(e) => update("sport", e.target.value)}
                    className={inputClass}
                  >
                    {SPORTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Condition / Grade</label>
                <select
                  value={form.grade}
                  onChange={(e) => update("grade", e.target.value)}
                  className={inputClass}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <motion.button
                onClick={analyze}
                disabled={loading || !form.cardName.trim() || limitReached}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 border-0 shadow-xl cursor-pointer"
                style={
                  limitReached
                    ? { background: "#e8e4f8", color: "#4a3f6b" }
                    : {
                        background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                        color: "white",
                        boxShadow: "0 8px 32px rgba(95,46,234,0.3)",
                      }
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                  </>
                ) : limitReached ? (
                  <>
                    <Lock className="w-4 h-4" /> Upgrade to Continue
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Analyze Value
                  </>
                )}
              </motion.button>

              {error && !limitReached && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center gap-2 text-sm text-red-600">
                  <TriangleAlert className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {(result || loading || limitReached) && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1 min-w-0 space-y-4"
              >
                {(result || loading) && !limitReached && (
                  <p className="text-[10px] font-black tracking-[0.25em] text-[#4a3f6b]/30 uppercase text-center">
                    AI estimates — for reference only
                  </p>
                )}

                {/* Loading steps */}
                {loading && (
                  <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6 space-y-5">
                    <div className="h-1.5 w-full bg-violet-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #5f2eea, #c9a84c)",
                        }}
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="space-y-3">
                      {LOADING_STEPS.map((step, i) => {
                        const StepIcon = step.icon;
                        const isActive = i === loadingStep;
                        const isDone = i < loadingStep;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: isDone || isActive ? 1 : 0.3,
                              x: 0,
                            }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                                isDone
                                  ? "bg-green-50 border border-green-200"
                                  : isActive
                                    ? "bg-violet-50 border border-violet-200"
                                    : "bg-[#f4f3fb] border border-violet-100"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : isActive ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "linear",
                                  }}
                                >
                                  <StepIcon className="w-4 h-4 text-[#5f2eea]" />
                                </motion.div>
                              ) : (
                                <StepIcon className="w-4 h-4 text-[#4a3f6b]/25" />
                              )}
                            </div>
                            <span
                              className={`text-sm transition-colors duration-300 ${
                                isDone
                                  ? "text-green-600 font-medium"
                                  : isActive
                                    ? "text-[#1a0a3d] font-semibold"
                                    : "text-[#4a3f6b]/30"
                              }`}
                            >
                              {isDone
                                ? step.label.replace("…", "")
                                : step.label}
                              {isDone && (
                                <span className="text-green-500 ml-1">✓</span>
                              )}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="pt-4 border-t border-violet-100 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="rounded-xl bg-violet-50 h-16"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                      <motion.div
                        className="rounded-xl bg-violet-50 h-20"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Limit reached */}
                {limitReached && (
                  <div className="rounded-2xl border border-violet-200 bg-violet-50 p-8 text-center shadow-lg shadow-violet-200/30">
                    <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-6 h-6 text-[#5f2eea]" />
                    </div>
                    <h3 className="text-lg font-black text-[#1a0a3d] mb-1">
                      Daily Limit Reached
                    </h3>
                    <p className="text-sm text-[#4a3f6b]/60 mb-5">
                      You&apos;ve used all 3 free appraisals for today. Upgrade for
                      unlimited valuations.
                    </p>
                    <Link href="/pricing">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 h-11 px-8 rounded-xl font-black text-sm text-white border-0 shadow-xl shadow-violet-500/25 cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                        }}
                      >
                        <Sparkles className="w-4 h-4" /> View Plans
                      </motion.button>
                    </Link>
                  </div>
                )}

                {result && (
                  <>
                    {/* Price Estimate */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6"
                    >
                      <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-5">
                        Estimated Value
                      </h2>
                      <div className="grid grid-cols-3 gap-4 mb-5">
                        <div className="text-center">
                          <p className="text-2xl font-black text-[#4a3f6b]/40">
                            ${result.low.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#4a3f6b]/30 uppercase tracking-wider mt-1">
                            Low
                          </p>
                        </div>
                        <div className="text-center relative">
                          <div className="absolute inset-0 bg-[#5f2eea]/5 rounded-xl -m-2" />
                          <p className="text-3xl font-black text-[#5f2eea] relative">
                            ${result.mid.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#5f2eea]/50 uppercase tracking-wider mt-1 relative">
                            Mid
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-[#4a3f6b]/40">
                            ${result.high.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#4a3f6b]/30 uppercase tracking-wider mt-1">
                            High
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-violet-100">
                        <div className="flex items-center gap-1.5 text-sm">
                          {trendNum > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : trendNum < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-[#4a3f6b]/30" />
                          )}
                          <span
                            className={
                              trendNum > 0
                                ? "text-green-600 font-bold"
                                : trendNum < 0
                                  ? "text-red-600 font-bold"
                                  : "text-[#4a3f6b]/40"
                            }
                          >
                            {result.trend}
                          </span>
                          <span className="text-[#4a3f6b]/30">
                            over 6 months
                          </span>
                        </div>
                        <div
                          className={`text-sm font-black px-3 py-1 rounded-lg ${GRADE_COLORS[result.grade] ?? GRADE_COLORS.C}`}
                        >
                          Grade {result.grade}
                        </div>
                      </div>
                    </motion.div>

                    {/* Market Overview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6"
                    >
                      <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-3">
                        Market Overview
                      </h2>
                      <p className="text-sm text-[#4a3f6b]/70 leading-relaxed mb-4">
                        {result.overview}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1.5 text-sm font-black px-4 py-2 rounded-xl border ${
                          result.recommendation === "Buy"
                            ? "text-green-600 bg-green-50 border-green-200"
                            : result.recommendation === "Sell"
                              ? "text-red-600 bg-red-50 border-red-200"
                              : "text-amber-700 bg-amber-50 border-amber-200"
                        }`}
                      >
                        {result.recommendation}
                      </div>
                      <p className="text-xs text-[#4a3f6b]/40 mt-2">
                        {result.recommendationDetail}
                      </p>
                    </motion.div>

                    {/* Key Factors */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6"
                    >
                      <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-3">
                        Key Value Factors
                      </h2>
                      <ul className="space-y-2.5">
                        {result.keyFactors.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-[#4a3f6b]/70"
                          >
                            <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-[#5f2eea] shrink-0" />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Recent Comparable Sales */}
                    {(() => {
                      // Filter out bad AI responses
                      const validAiSales = (result.recentSales ?? []).filter(
                        (s) =>
                          s.price &&
                          s.price !== "N/A" &&
                          s.label &&
                          !s.label.toLowerCase().includes("no comparable"),
                      );
                      const hasEbay = ebayComps.length > 0;
                      const hasAi = validAiSales.length > 0;

                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.45 }}
                          className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
                              Recent Comparable Sales
                            </h2>
                            {(hasEbay || hasAi) && (
                              <span className="text-[10px] text-[#4a3f6b]/30 flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                {hasEbay ? "eBay live data" : "AI estimates"}
                              </span>
                            )}
                          </div>

                          {hasEbay ? (
                            <>
                              <div className="space-y-2">
                                {ebayComps.map((comp, i) => (
                                  <a
                                    key={i}
                                    href={comp.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#f4f3fb] border border-violet-100 hover:border-[#5f2eea]/30 hover:bg-violet-50/50 transition-all group"
                                  >
                                    <div className="flex-1 min-w-0 mr-4">
                                      <p className="text-sm text-[#1a0a3d] font-medium truncate group-hover:text-[#5f2eea] transition-colors">
                                        {comp.title}
                                      </p>
                                      <p className="text-xs text-[#4a3f6b]/40 mt-0.5">
                                        {comp.condition}
                                        {comp.date &&
                                          ` · ${new Date(comp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-sm font-black text-[#1a0a3d]">
                                        $
                                        {comp.price.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        })}
                                      </span>
                                      <ExternalLink className="w-3.5 h-3.5 text-[#5f2eea]/30 group-hover:text-[#5f2eea] transition-colors" />
                                    </div>
                                  </a>
                                ))}
                              </div>
                              <p className="text-[10px] text-[#4a3f6b]/25 mt-3">
                                Active eBay listings · click any row to view ·
                                prices may vary
                              </p>
                            </>
                          ) : hasAi ? (
                            <>
                              <div className="space-y-2">
                                {validAiSales.map((sale, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#f4f3fb] border border-violet-100"
                                  >
                                    <span className="text-sm text-[#4a3f6b]/70 truncate mr-4 flex-1">
                                      {sale.label}
                                    </span>
                                    <span className="text-sm font-black text-[#1a0a3d] shrink-0">
                                      {sale.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] text-[#4a3f6b]/25 mt-3">
                                AI-estimated based on market knowledge · verify
                                before making decisions
                              </p>
                            </>
                          ) : (
                            /* No data at all — helpful empty state */
                            <div className="rounded-xl bg-[#f4f3fb] border border-violet-100 p-5 text-center">
                              <p className="text-sm font-bold text-[#1a0a3d] mb-1">
                                No recent sales found
                              </p>
                              <p className="text-xs text-[#4a3f6b]/50 mb-3">
                                Try searching more specifically — add the year,
                                brand, or grade for better results.
                              </p>
                              <a
                                href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent([form.year, form.brand, form.player, form.cardName, form.grade !== "Raw (Ungraded)" ? form.grade : ""].filter(Boolean).join(" "))}&_sop=13`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors"
                              >
                                Search eBay manually{" "}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </motion.div>
                      );
                    })()}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
