"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Section = "events" | "sponsors" | "shops";

const SECTIONS: { value: Section; label: string }[] = [
  { value: "events", label: "Events" },
  { value: "sponsors", label: "Sponsors" },
  { value: "shops", label: "Shops" },
];

export default function HubSearch() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("events");
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    const param = section === "shops" ? "city" : "search";
    router.push(q ? `/${section}?${param}=${encodeURIComponent(q)}` : `/${section}`);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-violet-100 bg-white p-2 shadow-[0_8px_30px_rgba(21,30,60,0.06)] sm:flex-row sm:items-center"
    >
      <label htmlFor="hub-section" className="sr-only">Search section</label>
      <select
        id="hub-section"
        value={section}
        onChange={(e) => setSection(e.target.value as Section)}
        className="rounded-xl bg-violet-50 px-3 py-2.5 text-sm font-semibold text-[#5B18BE] focus:outline-none focus:ring-2 focus:ring-violet-400/30"
      >
        {SECTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <label htmlFor="hub-query" className="sr-only">Search the trading card hub</label>
      <input
        id="hub-query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          section === "shops"
            ? "City or state…"
            : section === "sponsors"
              ? "Brand name…"
              : "Card show, city, or keyword…"
        }
        className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm text-[#1a0a3d] focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
      >
        <Search className="h-4 w-4" /> Search
      </button>
    </form>
  );
}
