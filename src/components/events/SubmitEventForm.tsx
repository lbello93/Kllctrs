"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";

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

import type { Event } from "@/types";

interface SubmitEventFormProps {
  mode?: "create" | "edit";
  eventId?: string;
  initialValues?: Partial<Event>;
}

export default function SubmitEventForm({
  mode = "create",
  eventId,
  initialValues,
}: SubmitEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    date_start: initialValues?.date_start ?? "",
    date_end: initialValues?.date_end ?? "",
    city: initialValues?.city ?? "",
    state: initialValues?.state ?? "",
    venue_name: initialValues?.venue_name ?? "",
    venue_address: initialValues?.venue_address ?? "",
    zip_code: initialValues?.zip_code ?? "",
    website: initialValues?.website ?? "",
    venue_website: initialValues?.venue_website ?? "",
    vendor_tables: initialValues?.vendor_tables?.toString() ?? "",
    contact_name: initialValues?.contact_name ?? "",
    contact_phone: initialValues?.contact_phone ?? "",
    contact_email: initialValues?.contact_email ?? "",
    autograph_guests: initialValues?.autograph_guests ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

    const payload = {
      ...form,
      slug,
      vendor_tables: form.vendor_tables
        ? parseInt(form.vendor_tables, 10)
        : null,
      date_end: form.date_end || null,
    };

    const endpoint =
      mode === "edit" ? `/api/admin/events/${eventId}` : "/api/events";

    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to submit. Please try again.");
      return;
    }

    setSuccess(true);

    if (mode === "edit") {
      router.refresh();
      return;
    }

    setTimeout(() => router.push("/maps"), 2500);
  };

  if (success) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <div className="text-3xl mb-3">✓</div>
        <h2 className="text-xl font-medium mb-2">
          {" "}
          {mode === "edit" ? "Changes saved" : "Submission received"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "The event has been updated successfully."
            : "Your show is in our review queue..."}
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full h-10 rounded-md border border-input bg-background px-3 text-sm";
  const labelClass = "text-xs text-muted-foreground block mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-border p-5 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Show Details
        </h2>

        <div>
          <label className={labelClass}>Show Name *</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Dallas Card Show 2026"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date *</label>
            <input
              name="date_start"
              type="date"
              required
              value={form.date_start}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input
              name="date_end"
              type="date"
              value={form.date_end}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Show Website</label>
          <input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Vendor Tables</label>
          <input
            name="vendor_tables"
            type="number"
            min="0"
            value={form.vendor_tables}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 200"
          />
        </div>

        <div>
          <label className={labelClass}>Autograph Guests</label>
          <textarea
            name="autograph_guests"
            rows={2}
            value={form.autograph_guests}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Names separated by commas"
          />
        </div>
      </section>

      <section className="rounded-xl border border-border p-5 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Venue
        </h2>

        <div>
          <label className={labelClass}>Venue Name</label>
          <input
            name="venue_name"
            value={form.venue_name}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Irving Convention Center"
          />
        </div>

        <div>
          <label className={labelClass}>Street Address</label>
          <input
            name="venue_address"
            value={form.venue_address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>City *</label>
            <input
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className={inputClass}
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
            <label className={labelClass}>ZIP Code</label>
            <input
              name="zip_code"
              value={form.zip_code}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Venue Website</label>
          <input
            name="venue_website"
            type="url"
            value={form.venue_website}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </section>

      <section className="rounded-xl border border-border p-5 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Contact (Optional)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact Name</label>
            <input
              name="contact_name"
              value={form.contact_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              name="contact_phone"
              type="tel"
              value={form.contact_phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            name="contact_email"
            type="email"
            value={form.contact_email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-500/50 bg-red-500/10 text-red-500 text-sm p-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {loading
            ? mode === "edit"
              ? "Saving..."
              : "Submitting..."
            : mode === "edit"
              ? "Save Changes"
              : "Submit for Review"}
        </button>
        <p className="text-xs text-muted-foreground">
          Reviewed within 48 hours. You&apos;ll get an email when approved.
        </p>
      </div>
    </form>
  );
}
