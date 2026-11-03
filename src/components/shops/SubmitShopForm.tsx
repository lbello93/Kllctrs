"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import slugify from "slugify";
import { Send, CheckCircle2, ArrowLeft, Loader2, Store } from "lucide-react";
import Link from "next/link";

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

export default function SubmitShopForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    website: "",
    specialty: "both",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const slug = slugify(`${form.name}-${form.city}-${form.state}`, {
      lower: true,
      strict: true,
    });

    const res = await fetch("/api/shops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to submit. Please try again.");
      return;
    }

    setSuccess(true);
  };

  const inputClass =
    "w-full h-10 px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-sm font-medium text-[#4a3f6b] mb-1.5 block";

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-[#1a0a3d] mb-2">
          Submission Received
        </h2>
        <p className="text-sm text-[#4a3f6b]/60 mb-6 max-w-sm mx-auto">
          Your shop is in our review queue. You&apos;ll see it on the map once
          approved (usually within 48 hours).
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shops">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-[#5f2eea] bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Shops
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-black text-white border-0 shadow-xl shadow-violet-500/25 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Shop Details */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#5f2eea]/8 flex items-center justify-center">
            <Store className="w-5 h-5 text-[#5f2eea]" />
          </div>
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
            Shop Details
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Shop Name *</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Card Castle"
            />
          </div>

          <div>
            <label className={labelClass}>Specialty *</label>
            <select
              name="specialty"
              required
              value={form.specialty}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="both">Sports & Pokémon</option>
              <option value="sports">Sports Cards</option>
              <option value="pokemon">Pokémon</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="(214) 555-0100"
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-5">
          Location
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>City *</label>
              <input
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="Dallas"
              />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <select
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>ZIP</label>
              <input
                name="zip_code"
                value={form.zip_code}
                onChange={handleChange}
                className={inputClass}
                placeholder="75201"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 flex-wrap">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="h-12 px-8 rounded-xl font-black text-sm text-white flex items-center gap-2 border-0 shadow-xl shadow-violet-500/25 disabled:opacity-40 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit for Review
            </>
          )}
        </motion.button>
        <p className="text-xs text-[#4a3f6b]/40">Reviewed within 48 hours.</p>
      </div>
    </motion.form>
  );
}
