"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Camera,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Handshake,
  LoaderCircle,
  Newspaper,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  CONTENT_TYPES,
  CONTENT_TYPE_META,
  type Audience,
  type ContentType,
  type StudioResult,
} from "@/AI integration/admin/content-studio/types";

interface EventOption {
  id: string;
  name: string;
  date_start: string;
  city: string;
  state: string;
}

interface BrandOption {
  id: string;
  name: string;
  category: string;
}

interface Props {
  events: EventOption[];
  brands: BrandOption[];
}

const TYPE_ICONS: Record<ContentType, LucideIcon> = {
  instagram_pack: Camera,
  trending_news: Newspaper,
  brand_spotlight: Handshake,
  event_promo: CalendarDays,
  market_intel: TrendingUp,
};

const PLACEHOLDERS: Record<ContentType, string> = {
  instagram_pack: "Example: 5 tips for your first card show, for new Pokemon collectors.",
  trending_news: "Optional. Example: focus on Pokemon and basketball this week.",
  brand_spotlight: "Optional extra angle. Example: their new grading service tiers.",
  event_promo: "Optional extra angle. Example: highlight free entry for kids.",
  market_intel: "Example: Verify a recent record sale of a vintage rookie card and explain it.",
};

type Tab = "instagram" | "linkedin" | "brand" | "article";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the text and copy it by hand.");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 text-xs font-bold text-[#5f2eea] transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {copied ? "Copied" : `Copy ${label.toLowerCase()}`}
    </button>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-[#DDD7EA] bg-white px-3 text-sm text-[#202642] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-60";

export default function ContentStudioClient({ events, brands }: Props) {
  const [type, setType] = useState<ContentType>("instagram_pack");
  const [brief, setBrief] = useState("");
  const [eventId, setEventId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [audience, setAudience] = useState<Audience>("collectors");
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudioResult | null>(null);
  const [tab, setTab] = useState<Tab>("instagram");

  const needs = CONTENT_TYPE_META[type].needs;
  const hasBrief = brief.trim().length >= 5;
  const canSubmit =
    !loading &&
    (needs === "none" ||
      (needs === "brief" && hasBrief) ||
      (needs === "event" && (!!eventId || hasBrief)) ||
      (needs === "brand" && (!!brandId || hasBrief)));

  useEffect(() => {
    if (!loading) return;
    // Derive elapsed from a start timestamp so setState only runs inside the
    // interval callback (avoids a synchronous setState in the effect body).
    const startedAt = Date.now();
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      250,
    );
    return () => clearInterval(timer);
  }, [loading]);

  function chooseType(next: ContentType) {
    setType(next);
    setEventId("");
    setBrandId("");
    setError(null);
  }

  async function generate() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/content-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          brief,
          eventId: eventId || undefined,
          brandId: brandId || undefined,
          audience,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }

      const next = data as StudioResult;
      setResult(next);
      setTab(next.output.brand_kit ? "brand" : "instagram");
      toast.success("Draft saved for review.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "instagram", label: "Instagram" },
    { id: "linkedin", label: "LinkedIn" },
    ...(result?.output.brand_kit ? [{ id: "brand" as Tab, label: "Brand kit" }] : []),
    { id: "article", label: "Article" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Claude · Content Studio
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#151E3C]">Create KLLCTRS content</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#596078]">
            Pick a format, add a brief, and Claude researches and writes it. Every run is saved as a draft for your review.
          </p>
        </div>
        <Link
          href="/admin/blog?status=draft"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
        >
          Review drafts <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Form */}
        <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_12px_36px_rgba(21,30,60,0.06)] sm:p-7">
          <fieldset disabled={loading}>
            <legend className="text-sm font-bold text-[#151E3C]">1. What do you want to make?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CONTENT_TYPES.map((id) => {
                const Icon = TYPE_ICONS[id];
                const meta = CONTENT_TYPE_META[id];
                const active = id === type;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => chooseType(id)}
                    aria-pressed={active}
                    className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                      active
                        ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                        : "border-[#E8E5EF] bg-white hover:border-violet-200 hover:bg-[#FCFAFF]"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-[#151E3C]">
                      <Icon className="h-4 w-4 text-violet-700" aria-hidden />
                      {meta.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#68708A]">{meta.description}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset disabled={loading} className="mt-7">
            <legend className="text-sm font-bold text-[#151E3C]">2. Who is it for?</legend>
            <div className="mt-3 inline-flex rounded-xl border border-[#E8E5EF] bg-[#FAF9FD] p-1">
              {([
                { id: "collectors", label: "Collectors", icon: Users },
                { id: "brands", label: "Brands", icon: Building2 },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAudience(id)}
                  aria-pressed={audience === id}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition ${
                    audience === id ? "bg-white text-violet-800 shadow-sm" : "text-[#68708A] hover:text-[#151E3C]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#68708A]">
              Brands mode adds a share kit with ready to post copy and talking points.
            </p>
          </fieldset>

          <fieldset disabled={loading} className="mt-7 space-y-4">
            <legend className="text-sm font-bold text-[#151E3C]">3. Add context</legend>

            {needs === "event" && (
              <div>
                <label htmlFor="studio-event" className="text-xs font-semibold text-[#46506B]">
                  Event from KLLCTRS
                </label>
                <select
                  id="studio-event"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className={`${fieldClass} h-11`}
                >
                  <option value="">No event selected</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} · {format(new Date(`${ev.date_start}T12:00:00`), "MMM d, yyyy")} · {ev.city}, {ev.state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {needs === "brand" && (
              <div>
                <label htmlFor="studio-brand" className="text-xs font-semibold text-[#46506B]">
                  Brand from KLLCTRS
                </label>
                <select
                  id="studio-brand"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className={`${fieldClass} h-11`}
                >
                  <option value="">No brand selected</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} · {b.category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="studio-brief" className="text-xs font-semibold text-[#46506B]">
                Brief {needs === "brief" ? "(required)" : "(optional)"}
              </label>
              <textarea
                id="studio-brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                maxLength={800}
                rows={4}
                placeholder={PLACEHOLDERS[type]}
                className={`${fieldClass} resize-y py-3 leading-6 placeholder:text-[#9A9FB0]`}
              />
              <p className="mt-1 text-right text-xs text-[#8B90A3]">{brief.length}/800</p>
            </div>
          </fieldset>

          <div className="mt-2 flex flex-col gap-3 border-t border-[#EEEAF5] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#68708A]" aria-live="polite">
              {loading
                ? `Researching and writing… ${elapsed}s. This can take up to 2 minutes.`
                : "Creates an article, Instagram post, LinkedIn post, and source list."}
            </p>
            <button
              type="button"
              onClick={generate}
              disabled={!canSubmit}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5B18BE] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#48129A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Working
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden /> Create draft
                </>
              )}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}
        </section>

        {/* Side info */}
        <aside className="space-y-4 xl:sticky xl:top-36">
          <div className="rounded-3xl bg-[#151E3C] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">How it works</p>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                ["Research", "Claude searches the web for current, primary sources."],
                ["Write", "It follows the KLLCTRS skill for voice and format."],
                ["Check", "Links it did not really find are removed."],
                ["Review", "You edit and publish from Blog drafts."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
                  <span>
                    <strong className="block">{title}</strong>
                    <span className="text-white/70">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold text-amber-950">Always review before posting</p>
            <p className="mt-1 text-xs leading-5 text-amber-900">
              Check dates, prices, and brand claims against the sources. Runs use your Anthropic API balance.
            </p>
          </div>
        </aside>
      </div>

      {/* Result */}
      {result && (
        <section className="rounded-3xl border border-violet-100 bg-white shadow-[0_12px_36px_rgba(21,30,60,0.06)]">
          <div className="flex flex-col gap-3 border-b border-violet-100 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Draft saved</p>
              <h2 className="mt-1 break-words text-lg font-bold text-[#151E3C]">{result.draft.title}</h2>
              <p className="mt-1 text-xs text-[#68708A]">
                {result.usage.webSearches} searches · {result.sources.length} sources · {result.usage.model}
              </p>
            </div>
            <Link
              href={`/admin/blog/${result.draft.id}`}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5B18BE] px-4 text-sm font-bold text-white transition hover:bg-[#48129A]"
            >
              <FileText className="h-4 w-4" aria-hidden /> Open full draft
            </Link>
          </div>

          {result.reviewFlags.length > 0 && (
            <div className="mx-5 mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-950">
                <AlertTriangle className="h-4 w-4" aria-hidden /> Check before publishing
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
                {result.reviewFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-5">
            <div className="mb-5 flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={tab === t.id}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    tab === t.id ? "bg-[#5f2eea] text-white" : "bg-violet-50 text-[#4a3f6b] hover:bg-violet-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "instagram" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold text-[#151E3C]">Carousel slides</h3>
                  <ol className="mt-3 space-y-2">
                    {result.output.instagram.carousel_slides.map((slide, i) => (
                      <li key={i} className="flex gap-3 rounded-xl border border-violet-100 bg-[#FCFAFF] p-3 text-sm text-[#202642]">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">{i + 1}</span>
                        {slide}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3">
                    <CopyButton
                      label="Slides"
                      text={result.output.instagram.carousel_slides.map((s, i) => `Slide ${i + 1}: ${s}`).join("\n")}
                    />
                  </div>
                  <h3 className="mt-6 text-sm font-bold text-[#151E3C]">Visual brief</h3>
                  <p className="mt-2 rounded-xl bg-[#FAF9FD] p-3 text-sm leading-6 text-[#46506B]">{result.output.instagram.visual_brief}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#151E3C]">Caption</h3>
                  <p className="mt-3 whitespace-pre-wrap rounded-xl border border-violet-100 p-4 text-sm leading-6 text-[#202642]">
                    {result.output.instagram.caption}
                    {"\n\n"}
                    {result.output.instagram.hashtags.join(" ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <CopyButton
                      label="Caption"
                      text={`${result.output.instagram.caption}\n\n${result.output.instagram.hashtags.join(" ")}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {tab === "linkedin" && (
              <div>
                <p className="whitespace-pre-wrap rounded-xl border border-violet-100 p-4 text-sm leading-6 text-[#202642]">
                  {result.output.linkedin.post}
                  {"\n\n"}
                  {result.output.linkedin.hashtags.join(" ")}
                </p>
                <div className="mt-3">
                  <CopyButton
                    label="Post"
                    text={`${result.output.linkedin.post}\n\n${result.output.linkedin.hashtags.join(" ")}`}
                  />
                </div>
              </div>
            )}

            {tab === "brand" && result.output.brand_kit && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#151E3C]">Headline</h3>
                  <p className="mt-2 text-lg font-bold text-[#202642]">{result.output.brand_kit.headline}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#151E3C]">Share copy for the brand</h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-xl border border-violet-100 p-4 text-sm leading-6 text-[#202642]">
                    {result.output.brand_kit.share_copy}
                  </p>
                  <div className="mt-3">
                    <CopyButton label="Share copy" text={result.output.brand_kit.share_copy} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#151E3C]">Talking points</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#202642]">
                    {result.output.brand_kit.talking_points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-[#68708A]">
                  The brand kit shows here after each run. The Blog edit page does not show it yet, so copy it now.
                </p>
              </div>
            )}

            {tab === "article" && (
              <div>
                <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl border border-violet-100 bg-[#FCFAFF] p-4 font-sans text-sm leading-6 text-[#202642]">
                  {result.output.article_markdown}
                </pre>
                <p className="mt-2 text-xs text-[#68708A]">Edit and publish the full article from the draft page.</p>
              </div>
            )}

            {result.sources.length > 0 && (
              <div className="mt-6 border-t border-violet-100 pt-5">
                <h3 className="text-sm font-bold text-[#151E3C]">Sources</h3>
                <ul className="mt-2 space-y-1.5">
                  {result.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f2eea] hover:underline"
                      >
                        {s.title}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}