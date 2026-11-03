"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { SHOP_CATEGORIES } from "./types";
import { US_STATES } from "@/page-components/events-calendar/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const field =
  "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-[#1a0a3d] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30";
const label = "mb-1 block text-xs font-bold text-[#4a3f6b]/70";

export default function SubmitShopForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const toggleCat = (v: string) =>
    setCategories((prev) => (prev.includes(v) ? prev.filter((c) => c !== v) : [...prev, v]));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";

    const hours: Record<string, string> = {};
    for (const day of DAYS) {
      const v = get(`hours_${day}`);
      if (v) hours[day] = v;
    }

    try {
      const res = await fetch("/api/shops/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          address: get("address"),
          city: get("city"),
          state: get("state"),
          zip_code: get("zip_code"),
          phone: get("phone"),
          email: get("email"),
          website: get("website"),
          description: get("description"),
          categories,
          hours: Object.keys(hours).length ? hours : null,
        }),
      });
      if (res.status === 401) {
        router.push("/login?redirect=/shops/submit");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not submit the shop.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
        <h2 className="text-lg font-black text-emerald-800">Thanks — shop submitted!</h2>
        <p className="mt-1 text-sm text-emerald-700">
          Your shop is pending review and will appear once an admin approves it.
        </p>
        <Link href="/shops" className="mt-4 inline-block text-sm font-semibold text-[#5B18BE] hover:underline">
          Back to shops
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-violet-100 bg-white p-6">
      <div>
        <label className={label} htmlFor="name">Shop name *</label>
        <input id="name" name="name" required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="address">Address</label>
        <input id="address" name="address" className={field} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="city">City *</label>
          <input id="city" name="city" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="state">State *</label>
          <select id="state" name="state" required defaultValue="" className={field}>
            <option value="" disabled>Select…</option>
            {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="zip_code">ZIP</label>
          <input id="zip_code" name="zip_code" className={field} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="website">Website</label>
          <input id="website" name="website" className={field} />
        </div>
      </div>

      <div>
        <span className={label}>Categories</span>
        <div className="flex flex-wrap gap-1.5">
          {SHOP_CATEGORIES.filter((c) => c.value !== "multi").map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleCat(c.value)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                categories.includes(c.value)
                  ? "border-[#5f2eea] bg-[#5f2eea] text-white"
                  : "border-violet-200 bg-white text-[#4a3f6b] hover:bg-violet-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className={label}>Hours (optional)</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs capitalize text-[#4a3f6b]/60">{day}</span>
              <input name={`hours_${day}`} placeholder="e.g. 10am–6pm" className={field} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={label} htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} maxLength={2000} className={field} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
      >
        {submitting ? "Submitting…" : "Submit shop"}
      </button>
    </form>
  );
}
