"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Clapperboard, Loader2, Sparkles, Wand2 } from "lucide-react";

import {
  CONTENT_TYPE_OPTIONS,
  STATUS_META,
  normalizeStatus,
  typeLabel,
  type ContentEngineType,
  type ContentRow,
  type ContentStats,
  type OptionRecord,
} from "./types";

interface Props {
  stats: ContentStats;
  content: ContentRow[];
  events: OptionRecord[];
  sponsors: OptionRecord[];
}

const card = "rounded-2xl border border-violet-100 bg-white p-5";
const field =
  "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-[#1a0a3d] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30";
const labelCls = "mb-1 block text-xs font-bold text-[#4a3f6b]/70";

const STATUS_FILTERS = ["all", "draft", "review", "published", "archived"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function ContentEngineClient({ stats, content, events, sponsors }: Props) {
  const router = useRouter();

  const [type, setType] = useState<ContentEngineType>("blog");
  const [eventId, setEventId] = useState("");
  const [sponsorId, setSponsorId] = useState("");
  const [topic, setTopic] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const needs = CONTENT_TYPE_OPTIONS.find((t) => t.value === type)?.needs ?? "none";
  const showEvent = needs === "event" || needs === "either";
  const showSponsor = needs === "sponsor" || needs === "either";

  const visible = useMemo(
    () => (statusFilter === "all" ? content : content.filter((c) => (c.status ?? "draft") === statusFilter)),
    [content, statusFilter],
  );

  const generate = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          eventId: eventId || undefined,
          sponsorId: sponsorId || undefined,
          topic: topic || undefined,
          customPrompt: customPrompt || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ kind: "err", text: data.error ?? "Generation failed." });
        return;
      }
      setMessage({ kind: "ok", text: `Draft created: “${data.draft?.title ?? "Untitled"}”.` });
      router.refresh();
    } catch {
      setMessage({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setGenerating(false);
    }
  };

  const generateWeek = async () => {
    setBulkRunning(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/generate-week", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ kind: "err", text: data.error ?? "Bulk generation failed." });
        return;
      }
      const count = data.generated?.length ?? 0;
      const errs = data.errors?.length ? ` (${data.errors.length} failed)` : "";
      setMessage({ kind: "ok", text: `Generated ${count} draft${count === 1 ? "" : "s"}${errs}.` });
      router.refresh();
    } catch {
      setMessage({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setBulkRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#1a0a3d]">
            <Wand2 className="h-6 w-6 text-[#5f2eea]" /> Content Engine
          </h1>
          <p className="mt-1 text-sm text-[#4a3f6b]/60">
            Auto-generate blog posts, social copy, and industry insights from your live data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/content/video"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5B18BE] hover:bg-violet-50"
          >
            <Clapperboard className="h-4 w-4" /> Video Studio
          </Link>
          <button
            onClick={generateWeek}
            disabled={bulkRunning}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
          >
            {bulkRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
            {bulkRunning ? "Generating…" : "Generate This Week's Content"}
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {([
          ["Total", stats.total, "text-[#1a0a3d]"],
          ["Drafts", stats.draft, "text-amber-600"],
          ["In review", stats.review, "text-sky-600"],
          ["Published", stats.published, "text-emerald-600"],
          ["Archived", stats.archived, "text-gray-500"],
        ] as const).map(([label, value, color]) => (
          <div key={label} className="rounded-2xl border border-violet-100 bg-white p-4">
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-xs font-semibold text-[#4a3f6b]/60">{label}</div>
          </div>
        ))}
      </div>

      {message && (
        <div
          className={`mb-5 rounded-xl border p-3 text-sm ${
            message.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Generate panel */}
        <section className={card}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-[#1a0a3d]">
            <Sparkles className="h-4 w-4 text-[#5f2eea]" /> Generate a draft
          </h2>

          <div className="space-y-3">
            <div>
              <label className={labelCls} htmlFor="ce-type">Type</label>
              <select
                id="ce-type"
                className={field}
                value={type}
                onChange={(e) => setType(e.target.value as ContentEngineType)}
              >
                {CONTENT_TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[#4a3f6b]/50">
                {CONTENT_TYPE_OPTIONS.find((t) => t.value === type)?.hint}
              </p>
            </div>

            {showEvent && (
              <div>
                <label className={labelCls} htmlFor="ce-event">
                  Related event {needs === "event" ? "*" : "(optional)"}
                </label>
                <select id="ce-event" className={field} value={eventId} onChange={(e) => setEventId(e.target.value)}>
                  <option value="">None</option>
                  {events.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}{o.detail ? ` — ${o.detail}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showSponsor && (
              <div>
                <label className={labelCls} htmlFor="ce-sponsor">
                  Related sponsor {needs === "sponsor" ? "*" : "(optional)"}
                </label>
                <select id="ce-sponsor" className={field} value={sponsorId} onChange={(e) => setSponsorId(e.target.value)}>
                  <option value="">None</option>
                  {sponsors.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}{o.detail ? ` — ${o.detail}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(type === "blog" || type === "social") && (
              <div>
                <label className={labelCls} htmlFor="ce-topic">Topic (if no record selected)</label>
                <input id="ce-topic" className={field} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. tips for first-time card show attendees" />
              </div>
            )}

            <div>
              <label className={labelCls} htmlFor="ce-custom">Custom instructions (optional)</label>
              <textarea id="ce-custom" rows={3} className={field} value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Tone, angle, things to emphasise…" />
            </div>

            <button
              onClick={generate}
              disabled={generating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {generating ? "Generating…" : "Generate Draft"}
            </button>
          </div>
        </section>

        {/* Content list */}
        <section className={card}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-[#1a0a3d]">Content</h2>
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusFilter === s
                      ? "bg-[#5f2eea] text-white"
                      : "bg-violet-50 text-[#4a3f6b] hover:bg-violet-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#4a3f6b]/50">No content in this view yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-violet-100 text-xs uppercase tracking-wide text-[#4a3f6b]/50">
                    <th className="py-2 pr-3 font-bold">Title</th>
                    <th className="py-2 pr-3 font-bold">Type</th>
                    <th className="py-2 pr-3 font-bold">Status</th>
                    <th className="py-2 pr-3 font-bold">Created</th>
                    <th className="py-2 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => {
                    const meta = STATUS_META[normalizeStatus(row.status)];
                    return (
                      <tr key={row.id} className="border-b border-violet-50 last:border-0">
                        <td className="py-2 pr-3">
                          <span className="font-semibold text-[#1a0a3d]">{row.title ?? "Untitled"}</span>
                          {row.is_ai_generated && (
                            <span className="ml-2 align-middle text-[10px] font-bold uppercase text-[#5f2eea]">AI</span>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-[#4a3f6b]/70">{typeLabel(row.type)}</td>
                        <td className="py-2 pr-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.className}`}>{meta.label}</span>
                        </td>
                        <td className="py-2 pr-3 text-[#4a3f6b]/60">{row.created_at?.slice(0, 10) ?? "—"}</td>
                        <td className="py-2">
                          <Link href={`/admin/content/${row.id}`} className="font-semibold text-[#5B18BE] hover:underline">
                            Edit
                          </Link>
                          {row.status === "published" && row.slug && (
                            <Link href={`/blog/${row.slug}`} className="ml-3 font-semibold text-[#4a3f6b]/60 hover:underline">
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
