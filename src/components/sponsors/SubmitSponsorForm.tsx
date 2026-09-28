"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, ArrowLeft, Loader2, Trophy } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "grading", label: "Grading Company" },
  { value: "auction", label: "Auction House" },
  { value: "manufacturer", label: "Card Manufacturer" },
  { value: "marketplace", label: "Marketplace" },
  { value: "breaker", label: "Breaker" },
  { value: "shop", label: "Hobby Shop" },
  { value: "software", label: "Software / Tech" },
  { value: "media", label: "Media / Content" },
  { value: "other", label: "Other" },
];

const TIERS = [
  { value: "bronze", label: "Bronze", desc: "Logo + listing" },
  { value: "silver", label: "Silver", desc: "Featured placement" },
  { value: "gold", label: "Gold", desc: "Priority + show badges" },
  { value: "platinum", label: "Platinum", desc: "Full partnership" },
];

const TIER_STYLES: Record<string, string> = {
  bronze: "border-orange-200 bg-orange-50 text-orange-700",
  silver: "border-gray-300 bg-gray-100 text-gray-700",
  gold: "border-amber-200 bg-amber-50 text-amber-700",
  platinum: "border-slate-300 bg-slate-100 text-slate-700",
};

const TIER_ACTIVE: Record<string, string> = {
  bronze:
    "border-orange-400 bg-orange-100 text-orange-800 shadow-md shadow-orange-200/40",
  silver:
    "border-gray-400 bg-gray-200 text-gray-800 shadow-md shadow-gray-300/40",
  gold: "border-amber-400 bg-amber-100 text-amber-800 shadow-md shadow-amber-200/40",
  platinum:
    "border-slate-400 bg-slate-200 text-slate-800 shadow-md shadow-slate-300/40",
};

export default function SubmitSponsorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "grading",
    tier: "bronze",
    website: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    notes: "",
  });

  const update = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sponsors/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 px-3 rounded-xl border border-violet-200 bg-white text-[#151E3C] text-sm placeholder-[#151E3C]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-sm font-medium text-[#151E3C] mb-1.5 block";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-[#151E3C] mb-2">
          Application Submitted!
        </h2>
        <p className="text-sm text-[#151E3C]/60 mb-6 max-w-sm mx-auto">
          Thanks for your interest in sponsoring KLLCTRS. We&apos;ll review your
          application and reach out within 48 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/sponsors">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-[#8B5CF6] bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> View Sponsors
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-black text-white border-0 shadow-xl shadow-violet-500/25 cursor-pointer"
              style={{
                background: "linear-gradient(94.43deg, #5B18BE 35.73%, #9C7CF7 100%)",
              }}
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/8 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <div>
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#8B5CF6] uppercase">
            Sponsor Application
          </h2>
          <p className="text-xs text-[#151E3C]/40">
            Fields marked * are required
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div>
          <label className={labelClass}>Company / Brand Name *</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. PSA, Topps, eBay"
            required
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Brief description of your company and what you do in the hobby..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-white text-[#151E3C] text-sm placeholder-[#151E3C]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Selection */}
        <div>
          <label className={labelClass}>Sponsorship Tier *</label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            {TIERS.map((t) => {
              const active = form.tier === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update("tier", t.value)}
                  className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    active ? TIER_ACTIVE[t.value] : TIER_STYLES[t.value]
                  }`}
                >
                  <p className="text-sm font-bold capitalize">{t.label}</p>
                  <p
                    className={`text-xs mt-0.5 ${active ? "opacity-70" : "opacity-50"}`}
                  >
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Website */}
        <div>
          <label className={labelClass}>Website</label>
          <input
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://www.yourcompany.com"
            className={inputClass}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-violet-100 pt-5">
          <h3 className="text-[10px] font-black tracking-[0.25em] text-[#8B5CF6] uppercase mb-4">
            Contact Information
          </h3>
        </div>

        {/* Contact Name */}
        <div>
          <label className={labelClass}>Contact Name *</label>
          <input
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
            placeholder="John Smith"
            required
            className={inputClass}
          />
        </div>

        {/* Contact Email / Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact Email *</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
              placeholder="john@company.com"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              value={form.contact_phone}
              onChange={(e) => update("contact_phone", e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Additional Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any specific shows you'd like to sponsor, goals, or questions..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-white text-[#151E3C] text-sm placeholder-[#151E3C]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={
            loading ||
            !form.name.trim() ||
            !form.contact_name.trim() ||
            !form.contact_email.trim()
          }
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 border-0 shadow-xl shadow-violet-500/25 disabled:opacity-40 transition-all cursor-pointer"
          style={{ background: "linear-gradient(94.43deg, #5B18BE 35.73%, #9C7CF7 100%)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Application
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
