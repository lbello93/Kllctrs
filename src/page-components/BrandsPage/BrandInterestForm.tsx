"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, LockKeyhole, MessageCircle } from "lucide-react";

import type { SponsorShow } from "./shared";

const GROUPS = [
  { key: "collecting_categories", title: "What do you collect?", choices: ["Sports cards", "Pokémon", "Trading card games", "Comics", "Toys & figures", "Other collectibles"] },
  { key: "product_interests", title: "What would you like this brand to share?", choices: ["New releases", "Exclusive products", "Grading services", "Breaks & live openings", "Accessories", "Deals & offers", "Events & meetups"] },
  { key: "preferred_channels", title: "Where should brands reach collectors?", choices: ["Instagram", "YouTube", "TikTok", "Email", "In-person events", "Discord / community"] },
] as const;

type ChoiceKey = (typeof GROUPS)[number]["key"];
type Answers = Record<ChoiceKey, string[]>;

const initialAnswers: Answers = {
  collecting_categories: [],
  product_interests: [],
  preferred_channels: [],
};

interface Props {
  sponsorId: string;
  sponsorName: string;
  events: SponsorShow[];
}

export default function BrandInterestForm({ sponsorId, sponsorName, events }: Props) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [purchaseFrequency, setPurchaseFrequency] = useState("");
  const [region, setRegion] = useState("");
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  function toggle(group: ChoiceKey, choice: string) {
    setResult(null);
    setAnswers((current) => ({
      ...current,
      [group]: current[group].includes(choice)
        ? current[group].filter((item) => item !== choice)
        : [...current[group], choice],
    }));
  }

  function toggleEvent(id: string) {
    setResult(null);
    setEventIds((current) => current.includes(id) ? current.filter((eventId) => eventId !== id) : [...current, id]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    try {
      const response = await fetch(`/api/sponsors/${sponsorId}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          purchase_frequency: purchaseFrequency,
          region,
          event_ids: eventIds,
          consent,
        }),
      });
      setResult(response.ok ? "success" : "error");
      if (response.ok) {
        setAnswers(initialAnswers);
        setPurchaseFrequency("");
        setRegion("");
        setEventIds([]);
        setConsent(false);
      }
    } catch {
      setResult("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="collector-insights" className="scroll-mt-28 overflow-hidden rounded-2xl border border-[#DDD2FA] bg-white shadow-[0_12px_40px_rgba(44,27,90,0.08)]">
      <div className="bg-[#151E3C] px-6 py-6 text-white sm:px-8">
        <p className="flex items-center gap-2 font-inter text-[11px] font-semibold uppercase tracking-[0.16em] text-[#CBBEFB]"><MessageCircle className="h-4 w-4" /> Collector voice</p>
        <h2 className="mt-2 font-space-grotesk text-[24px] leading-tight sm:text-[28px]">Help {sponsorName} show you what matters</h2>
        <p className="mt-2 max-w-2xl font-inter text-[14px] leading-6 text-white/70">Choose the collecting topics, products and events you care about. Your answers help shape aggregate collector insights for the hobby.</p>
      </div>

      <form onSubmit={submit} className="space-y-7 p-6 sm:p-8">
        {GROUPS.map((group) => (
          <fieldset key={group.key}>
            <legend className="mb-3 font-space-grotesk text-[17px] text-[#151E3C]">{group.title}</legend>
            <div className="flex flex-wrap gap-2">
              {group.choices.map((choice) => {
                const selected = answers[group.key].includes(choice);
                return <button key={choice} type="button" aria-pressed={selected} onClick={() => toggle(group.key, choice)} className={`rounded-full border px-3 py-2 font-inter text-[12px] transition ${selected ? "border-[#6C36CE] bg-[#6C36CE] text-white" : "border-[#E5DFFD] bg-white text-[#353753] hover:border-[#8B5CF6] hover:bg-[#F8F5FF]"}`}>{selected && <Check className="mr-1 inline h-3.5 w-3.5" />}{choice}</button>;
              })}
            </div>
          </fieldset>
        ))}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block font-space-grotesk text-[17px] text-[#151E3C]">How often do you buy collectibles?
            <select value={purchaseFrequency} onChange={(event) => setPurchaseFrequency(event.target.value)} className="mt-2 block h-11 w-full rounded-lg border border-[#E5DFFD] bg-white px-3 font-inter text-[13px] text-[#151E3C] outline-none focus:border-[#8B5CF6]">
              <option value="">Skip this question</option><option>Weekly</option><option>Monthly</option><option>A few times a year</option><option>Rarely</option>
            </select>
          </label>
          <label className="block font-space-grotesk text-[17px] text-[#151E3C]">Your state or region <span className="font-inter text-[12px] text-[#151E3C]/50">(optional)</span>
            <input value={region} onChange={(event) => setRegion(event.target.value)} maxLength={80} placeholder="e.g. Texas or Northeast" className="mt-2 block h-11 w-full rounded-lg border border-[#E5DFFD] px-3 font-inter text-[13px] text-[#151E3C] outline-none placeholder:text-[#151E3C]/40 focus:border-[#8B5CF6]" />
          </label>
        </div>

        {events.length > 0 && <fieldset>
          <legend className="mb-3 font-space-grotesk text-[17px] text-[#151E3C]">Which upcoming events interest you?</legend>
          <div className="grid gap-2 sm:grid-cols-2">{events.map((event) => {
            const selected = eventIds.includes(event.id);
            return <button key={event.id} type="button" aria-pressed={selected} onClick={() => toggleEvent(event.id)} className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition ${selected ? "border-[#8B5CF6] bg-[#F5F0FF]" : "border-[#E5DFFD] hover:bg-[#FEF9FF]"}`}>
              <span className="min-w-0"><span className="block truncate font-inter text-[13px] font-medium text-[#151E3C]">{event.name}</span><span className="mt-0.5 block font-inter text-[11px] text-[#151E3C]/55">{[event.city, event.state].filter(Boolean).join(", ")}</span></span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#6C36CE] bg-[#6C36CE] text-white" : "border-[#CBBEFB]"}`}>{selected && <Check className="h-3 w-3" />}</span>
            </button>;
          })}</div>
        </fieldset>}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#F8F5FF] p-4 font-inter text-[12px] leading-5 text-[#353753]">
          <input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#6C36CE]" />
          <span>I agree that KLLCTRS may use these answers, together with other collectors’ answers, in aggregated marketing and hobby trend reports. My name and email are not collected in this form, and individual answers are not shared with the brand.</span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 font-inter text-[11px] text-[#151E3C]/50"><LockKeyhole className="h-3.5 w-3.5" />Optional answers · anonymous trend reporting</p>
          <button disabled={pending || !consent} type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(94.43deg,#5B18BE_35.73%,#9C7CF7_100%)] px-5 font-inter text-[13px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{pending ? "Sharing…" : "Share my collector interests"}
          </button>
        </div>
        {result === "success" && <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 font-inter text-[13px] text-emerald-800">Thanks—your collector interests have been saved for aggregate insights.</p>}
        {result === "error" && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 font-inter text-[13px] text-rose-800">We couldn’t save your answers. Please try again.</p>}
      </form>
    </section>
  );
}
