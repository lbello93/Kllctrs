"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, FileText, Loader2, Search, Sparkles } from "lucide-react";

interface EventOption { id: string; name: string; date_start: string; city: string; state: string }
interface BrandOption { id: string; name: string; category: string }
interface Draft {
  id: string; title: string; slug: string; category: string; status: string;
  source_links: unknown; social_drafts: unknown;
}

const CATEGORIES = [
  { id: "card", title: "Cards", description: "Collecting guides, releases, grading, and card stories" },
  { id: "brands", title: "Brand updates", description: "Company news and brand information for collectors" },
  { id: "editorial", title: "Editorial", description: "Useful perspectives and informed hobby analysis" },
  { id: "community", title: "Community", description: "Shows, local collecting, and community highlights" },
  { id: "market_intel", title: "Market Intel", description: "Verified sales, releases, and market developments" },
] as const;

export default function ContentStudioClient({ events, brands }: { events: EventOption[]; brands: BrandOption[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("card");
  const [topic, setTopic] = useState("");
  const [eventId, setEventId] = useState("");
  const [eventScope, setEventScope] = useState(false);
  const [brandId, setBrandId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const generate = async () => {
    setGenerating(true);
    setDraft(null);
    try {
      const response = await fetch("/api/admin/content-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic, event_id: eventScope ? undefined : eventId || undefined, event_scope: eventScope ? "month" : undefined, brand_id: brandId || undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Content generation failed.");
      setDraft(result.draft as Draft);
      toast.success("Article and social drafts are ready for review.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Content generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const selectedCategory = CATEGORIES.find((item) => item.id === category)!;

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800"><Sparkles className="h-3.5 w-3.5" /> CLAUDE · CONTENT STUDIO</p>
          <h1 className="font-space-grotesk text-3xl font-bold tracking-tight text-[#151E3C]">Create collector content</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#596078]">Research a topic or event, then generate an article and social drafts together. Every run is saved as a draft for your review.</p>
        </div>
        <Link href="/admin/blog?status=draft" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-800 transition hover:bg-violet-50">
          Review drafts <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
        <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_12px_36px_rgba(21,30,60,0.06)] sm:p-8">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-[#151E3C]">1. Choose a content lane</h2>
            <p className="mt-1 text-xs text-[#68708A]">Claude will search current information and tailor the angle to collectors.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((item) => (
              <button key={item.id} type="button" onClick={() => { setCategory(item.id); setEventId(""); setEventScope(false); setBrandId(""); }} aria-pressed={category === item.id}
                className={`rounded-2xl border p-4 text-left transition ${category === item.id ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-[#E8E5EF] bg-white hover:border-violet-200 hover:bg-[#FCFAFF]"}`}>
                <span className="block text-sm font-bold text-[#151E3C]">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-[#68708A]">{item.description}</span>
              </button>
            ))}
          </div>

          <div className="mt-7">
            <h2 className="text-sm font-bold text-[#151E3C]">2. Add context</h2>
            <p className="mt-1 text-xs text-[#68708A]">Choose a record or describe the story. Details from KLLCTRS are provided as context and checked against web sources.</p>
          </div>
          {(category === "card" || category === "community") && (
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
                <input type="checkbox" checked={eventScope} onChange={(event) => { setEventScope(event.target.checked); if (event.target.checked) setEventId(""); }} className="mt-0.5 h-4 w-4 accent-violet-700" />
                <span><span className="block text-xs font-semibold text-[#26304B]">Create a roundup from this month’s approved U.S. events</span><span className="mt-1 block text-xs leading-5 text-[#68708A]">Uses events already in KLLCTRS and researches current context. Coverage depends on the records available.</span></span>
              </label>
              {!eventScope && (
                <label className="block text-xs font-semibold text-[#46506B]">Or feature one upcoming KLLCTRS event
                  <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD7EA] bg-white px-3 text-sm font-normal text-[#202642] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                    <option value="">No event selected</option>
                    {events.map((event) => <option key={event.id} value={event.id}>{event.name} · {format(new Date(`${event.date_start}T12:00:00`), "MMM d, yyyy")} · {event.city}, {event.state}</option>)}
                  </select>
                </label>
              )}
            </div>
          )}
          {category === "brands" && (
            <label className="mt-4 block text-xs font-semibold text-[#46506B]">Brand in KLLCTRS directory (optional)
              <select value={brandId} onChange={(event) => setBrandId(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD7EA] bg-white px-3 text-sm font-normal text-[#202642] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                <option value="">No brand selected</option>
                {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name} · {brand.category}</option>)}
              </select>
            </label>
          )}
          <label className="mt-4 block text-xs font-semibold text-[#46506B]">Story brief
            <textarea value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={500} rows={4} placeholder={category === "market_intel" ? "Example: Verify a recent public sale of a major rookie card and explain what collectors should know." : "What should the story cover? Add a date, brand, set, question, audience, or campaign angle."} className="mt-1.5 w-full resize-y rounded-xl border border-[#DDD7EA] bg-white p-3 text-sm font-normal leading-6 text-[#202642] outline-none placeholder:text-[#9A9FB0] focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            <span className="mt-1 block text-right font-normal text-[#8B90A3]">{topic.length}/500</span>
          </label>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#EEEAF5] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#68708A]">Creates one article, Instagram caption/carousel, LinkedIn post, and cited source list.</p>
            <motion.button type="button" onClick={generate} disabled={generating || (!topic.trim() && !eventId && !eventScope && !brandId)} whileTap={{ scale: 0.98 }} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5B18BE] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#48129A] disabled:cursor-not-allowed disabled:opacity-50">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Researching & writing…</> : <><Search className="h-4 w-4" /> Research & create draft</>}
            </motion.button>
          </div>
          {draft && (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div className="min-w-0"><p className="text-sm font-bold text-emerald-950">Draft created</p><p className="mt-0.5 break-words text-sm text-emerald-900">{draft.title}</p><p className="mt-1 text-xs text-emerald-800">{selectedCategory.title} · Saved for review</p></div></div>
              <Link href={`/admin/blog/${draft.id}`} className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"><FileText className="h-3.5 w-3.5" /> Review article & social copy</Link>
            </div>
          )}
        </section>

        <aside className="space-y-4 xl:sticky xl:top-36">
          <div className="rounded-3xl bg-[#151E3C] p-6 text-white shadow-[0_12px_36px_rgba(21,30,60,0.12)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">How it works</p>
            <ol className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">1</span><span><strong className="block">Research</strong><span className="mt-0.5 block leading-5 text-white/70">Claude searches the web and gathers source links.</span></span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">2</span><span><strong className="block">Create</strong><span className="mt-0.5 block leading-5 text-white/70">It drafts an article plus Instagram and LinkedIn copy.</span></span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">3</span><span><strong className="block">Review</strong><span className="mt-0.5 block leading-5 text-white/70">Check citations and facts in Drafts before publishing.</span></span></li>
            </ol>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold text-amber-950">API usage note</p>
            <p className="mt-1 text-xs leading-5 text-amber-900">Uses your Anthropic API balance, separate from Claude Pro. Web search costs $0.01 per search plus model tokens; each generation is capped at two searches. Set a Console spend limit and review usage there.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-white p-4">
            <p className="text-xs font-bold text-[#151E3C]">Always review before publishing</p>
            <p className="mt-1 text-xs leading-5 text-[#68708A]">Generated drafts stay unpublished. Confirm event dates, sale details, brand claims, and sources before sharing.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
