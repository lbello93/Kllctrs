"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { primaryLinkClass, TIER_STYLES } from "./shared";

const CATEGORIES = [
  { value: "grading", label: "Grading company" },
  { value: "auction", label: "Auction house" },
  { value: "manufacturer", label: "Card manufacturer" },
  { value: "marketplace", label: "Marketplace" },
  { value: "breaker", label: "Breaker" },
  { value: "shop", label: "Hobby shop" },
  { value: "software", label: "Software or tech" },
  { value: "media", label: "Media" },
  { value: "other", label: "Other" },
];

const TIERS = [
  { value: "bronze", label: "Bronze", desc: "Logo + listing" },
  { value: "silver", label: "Silver", desc: "Featured placement" },
  { value: "gold", label: "Gold", desc: "Priority + show badges" },
  { value: "platinum", label: "Platinum", desc: "Full partnership" },
];

const inputClass =
  "h-11 w-full rounded-[10px] border border-[#CBBEFB] bg-white px-3 font-inter text-[14px] text-[#151E3C] outline-none transition placeholder:text-[#151E3C]/35 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20";

const labelClass =
  "mb-1.5 block font-inter text-[12px] font-medium leading-[15px] text-[#151E3C]/70";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SubmitSponsorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "grading",
    tier: "bronze",
    website: "",
    description: "",
    contact_name: "",
    contact_email: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSubmit =
    form.name.trim() && form.contact_name.trim() && form.contact_email.trim();

  async function handleSubmit(e: React.FormEvent) {
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
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#E5DFFD] bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-500" />
        <h2 className="font-space-grotesk text-[24px] leading-[30px] text-[#151E3C]">
          Application sent
        </h2>
        <p className="mt-2 font-inter text-[14px] leading-6 text-[#151E3C]/60">
          We will reply within 48 hours.
        </p>
        <Link
          href="/sponsors"
          className={`${primaryLinkClass} mx-auto mt-6 w-fit`}
        >
          View sponsors
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand name *" htmlFor="sponsor-name">
          <input
            id="sponsor-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="PSA, Topps, eBay"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Category *" htmlFor="sponsor-category">
          <select
            id="sponsor-category"
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
        </Field>
      </div>

      <Field label="Website" htmlFor="sponsor-website">
        <input
          id="sponsor-website"
          inputMode="url"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          placeholder="yourbrand.com"
          className={inputClass}
        />
      </Field>

      <fieldset>
        <legend className={labelClass}>Tier *</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIERS.map((tier) => {
            const active = form.tier === tier.value;

            return (
              <button
                key={tier.value}
                type="button"
                aria-pressed={active}
                onClick={() => update("tier", tier.value)}
                className={`rounded-xl border p-3 text-left transition ${TIER_STYLES[tier.value]} ${active ? "ring-2 ring-[#8B5CF6] ring-offset-1" : "opacity-70 hover:opacity-100"}`}
              >
                <p className="font-inter text-[14px] font-semibold leading-[17px]">
                  {tier.label}
                </p>
                <p className="mt-0.5 font-inter text-[11px] leading-[14px] opacity-80">
                  {tier.desc}
                </p>
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label="About your brand" htmlFor="sponsor-about">
        <textarea
          id="sponsor-about"
          rows={2}
          maxLength={300}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What you do in the hobby (optional)"
          className="w-full resize-none rounded-[10px] border border-[#CBBEFB] bg-white px-3 py-2.5 font-inter text-[14px] text-[#151E3C] outline-none transition placeholder:text-[#151E3C]/35 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
        />
      </Field>

      <div className="grid gap-4 border-t border-[#F2EFFE] pt-5 sm:grid-cols-2">
        <Field label="Contact name *" htmlFor="sponsor-contact-name">
          <input
            id="sponsor-contact-name"
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
            placeholder="John Smith"
            autoComplete="name"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Contact email *" htmlFor="sponsor-contact-email">
          <input
            id="sponsor-contact-email"
            type="email"
            value={form.contact_email}
            onChange={(e) => update("contact_email", e.target.value)}
            placeholder="john@brand.com"
            autoComplete="email"
            required
            className={inputClass}
          />
        </Field>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-[10px] border border-red-200 bg-red-50 p-3 font-inter text-[14px] leading-5 text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className={`${primaryLinkClass} w-full disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit application
          </>
        )}
      </button>
    </form>
  );
}
