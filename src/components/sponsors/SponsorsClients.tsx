"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

import SponsorCard from "./SponsorCard";
import {
  primaryLinkClass,
  type SponsorRow,
  type SponsorStats,
  type SponsorsSummary,
} from "./shared";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Grading", value: "grading" },
  { label: "Auction", value: "auction" },
  { label: "Manufacturer", value: "manufacturer" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Breaker", value: "breaker" },
  { label: "Shop", value: "shop" },
  { label: "Software", value: "software" },
  { label: "Media", value: "media" },
  { label: "Other", value: "other" },
];

const EMPTY_STATS: SponsorStats = { upcoming: [], left: 0, total: 0 };

interface Props {
  sponsors: SponsorRow[];
  stats: Record<string, SponsorStats>;
  summary: SponsorsSummary;
}

export default function SponsorsClients({ sponsors, stats, summary }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sponsors.filter((sponsor) => {
      const matchesCategory =
        category === "all" || sponsor.category === category;
      const matchesSearch =
        !query ||
        sponsor.name.toLowerCase().includes(query) ||
        sponsor.category.toLowerCase().includes(query) ||
        (sponsor.description ?? "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [sponsors, search, category]);

  const numbers = [
    { value: summary.brands, label: "Brands" },
    { value: summary.shows, label: "Shows" },
    { value: summary.states, label: "States" },
  ];

  return (
    <main className="min-h-screen bg-[#FEF9FF]">
      <section className="relative w-full overflow-hidden bg-[#151E3C]">
        <Image
          src="/sponsors/sponsMobile.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="block select-none object-cover object-center md:hidden"
        />
        <Image
          src="/sponsors/sponsors.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden select-none object-cover object-center md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#151E3C]/85 via-[#151E3C]/50 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1320px] flex-col justify-end gap-6 px-6 pb-10 pt-32">
          <div className="space-y-4">
            <p className="font-space-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.15em] text-[#CBBEFB]">
              The Hobby Index
            </p>
            <h1 className="font-unica-one text-[36px] leading-[38px] tracking-[-0.04em] text-[#FEF9FF] md:text-[48px] md:leading-[50px]">
              Brands That
              <br />
              Shape Collecting
            </h1>
          </div>

          <dl className="flex flex-wrap gap-3">
            {numbers.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <dt className="font-inter text-[12px] leading-[15px] text-[#FEF9FF]/70">
                  {item.label}
                </dt>
                <dd className="font-unica-one text-[28px] leading-[32px] text-[#FEF9FF]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex w-full overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map((item, index) => {
              const active = category === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item.value)}
                  className={`-ml-px h-8 whitespace-nowrap border border-[#8B5CF6] px-3 font-inter text-[11px] font-normal transition-all duration-200 first:ml-0 ${active ? "bg-[#8B5CF6] text-white" : "bg-[#FEF9FF] text-[#151E3C] hover:bg-[#F2EFFE]"} ${index === 0 ? "rounded-l-[20px]" : index === CATEGORIES.length - 1 ? "rounded-r-[20px]" : "rounded-none"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="relative h-10 w-full shrink-0 md:w-[320px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands"
              aria-label="Search brands"
              className="h-full w-full rounded-[10px] border border-[#B39EF9] bg-[#FEF9FF] pl-4 pr-10 font-inter text-[13px] text-[#151E3C] outline-none transition-all placeholder:text-[#B39EF9] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />

            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            ) : (
              <Search
                size={18}
                strokeWidth={1.5}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]"
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-8">
        {filtered.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-[#E5DFFD] bg-white px-6 py-12 text-center">
            <h2 className="font-space-grotesk text-[20px] leading-[26px] text-[#151E3C]">
              No sponsors found
            </h2>
            <p className="font-inter text-[14px] leading-5 text-[#151E3C]/60">
              Try another search or category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="font-inter text-[14px] leading-[17px] text-[#8B5CF6] underline-offset-4 hover:underline"
            >
              Show all
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                stats={stats[sponsor.id] ?? EMPTY_STATS}
              />
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-4 rounded-2xl bg-[#151E3C] p-6 sm:flex-row sm:items-center">
          <h2 className="font-space-grotesk text-[20px] leading-[26px] tracking-[-0.01em] text-[#FEF9FF]">
            Want your brand here?
          </h2>
          <Link href="/sponsors/submit" className={primaryLinkClass}>
            Become a sponsor
          </Link>
        </div>
      </section>
    </main>
  );
}
