"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";

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

function matchesBrandCategory(brandCategory: string, selectedCategory: string) {
  if (selectedCategory === "grading") return ["grading", "grading_company"].includes(brandCategory);
  if (selectedCategory === "manufacturer") return ["manufacturer", "card_manufacturer"].includes(brandCategory);
  return brandCategory === selectedCategory;
}

interface Props {
  sponsors: SponsorRow[];
  stats: Record<string, SponsorStats>;
  summary: SponsorsSummary;
}

export default function SponsorsClients({ sponsors, stats, summary }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [productCategory, setProductCategory] = useState("all");
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const productCategories = useMemo(() => [...new Set(sponsors.flatMap((sponsor) => sponsor.product_categories ?? []))].sort((a, b) => a.localeCompare(b)), [sponsors]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const sponsor of sponsors) {
      const key = sponsor.category.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [sponsors]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sponsors.filter((sponsor) => {
      const matchesCategory =
        category === "all" || matchesBrandCategory(sponsor.category, category);
      const matchesProduct = productCategory === "all" || (sponsor.product_categories ?? []).includes(productCategory);
      const matchesEvents = !upcomingOnly || (stats[sponsor.id]?.upcoming.length ?? 0) > 0;
      const matchesSearch =
        !query ||
        sponsor.name.toLowerCase().includes(query) ||
        sponsor.category.toLowerCase().includes(query) ||
        [sponsor.description, sponsor.tagline, sponsor.service_area, sponsor.headquarters, ...(sponsor.offerings ?? []), ...(sponsor.product_categories ?? []), ...(sponsor.target_audience ?? [])]
          .some((value) => (value ?? "").toLowerCase().includes(query));

      return matchesCategory && matchesProduct && matchesEvents && matchesSearch;
    });
  }, [sponsors, stats, search, category, productCategory, upcomingOnly]);

  const numbers = [
    { value: summary.brands, label: "Brands" },
    { value: summary.shows, label: "Shows" },
    { value: summary.states, label: "States" },
  ];

  const selectedCategory = CATEGORIES.find((item) => item.value === category);
  const categoryLabel = selectedCategory?.label ?? "this category";
  const isCategoryEmpty = category !== "all" && !sponsors.some((sponsor) => matchesBrandCategory(sponsor.category, category));
  const suggestedBrands = sponsors
    .filter((sponsor) => category === "all" || (isCategoryEmpty ? sponsor.category !== category : true))
    .slice(0, 3);

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
                  {item.value !== "all" && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] ${active ? "bg-white/20 text-white" : "bg-[#F2EFFE] text-[#5B18BE]"}`}>
                      {item.value === "grading"
                        ? (categoryCounts.get("grading") ?? 0) + (categoryCounts.get("grading_company") ?? 0)
                        : item.value === "manufacturer"
                          ? (categoryCounts.get("manufacturer") ?? 0) + (categoryCounts.get("card_manufacturer") ?? 0)
                          : categoryCounts.get(item.value) ?? 0}
                    </span>
                  )}
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
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-inter text-[11px] font-medium uppercase tracking-wide text-[#151E3C]/45">Refine by</span>
          <select aria-label="Filter by collecting category" value={productCategory} onChange={(event) => setProductCategory(event.target.value)} className="h-9 rounded-full border border-[#E5DFFD] bg-white px-3 font-inter text-[12px] text-[#151E3C] outline-none focus:border-[#8B5CF6]">
            <option value="all">All collecting categories</option>
            {productCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" aria-pressed={upcomingOnly} onClick={() => setUpcomingOnly((value) => !value)} className={`h-9 rounded-full border px-3 font-inter text-[12px] transition ${upcomingOnly ? "border-[#6C36CE] bg-[#6C36CE] text-white" : "border-[#E5DFFD] bg-white text-[#151E3C] hover:border-[#8B5CF6]"}`}>Brands with upcoming events</button>
          {(productCategory !== "all" || upcomingOnly) && <button type="button" onClick={() => { setProductCategory("all"); setUpcomingOnly(false); }} className="font-inter text-[12px] text-[#6C36CE] underline">Clear filters</button>}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-8">
        {filtered.length === 0 ? (
          <div className="space-y-8">
            <div className="relative mx-auto flex max-w-3xl flex-col items-center overflow-hidden rounded-3xl border border-[#E5DFFD] bg-white px-6 py-10 text-center shadow-[0_18px_55px_rgba(21,30,60,0.06)] sm:px-10 sm:py-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8B5CF6] via-[#B39EF9] to-[#F0C040]" />
              <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B5CF6]">
                {isCategoryEmpty ? "A space for the hobby" : "No exact matches"}
              </p>
              <h2 className="mt-2 font-space-grotesk text-2xl font-semibold leading-tight text-[#151E3C] sm:text-3xl">
                {isCategoryEmpty ? `${categoryLabel} brands are missing from the directory` : "We couldn’t find a brand match"}
              </h2>
              <p className="mt-3 max-w-xl font-inter text-sm leading-6 text-[#596078] sm:text-base">
                {isCategoryEmpty
                  ? `We haven’t listed any ${categoryLabel.toLowerCase()} brands yet. Help grow the KLLCTRS hobby index by suggesting a brand, or explore the companies already here.`
                  : category !== "all"
                    ? `No ${categoryLabel.toLowerCase()} brands match the current search and filters. Clear them to browse the full category.`
                    : "Try a different search or clear your filters to browse all brands in the KLLCTRS hobby index."}
              </p>
              <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Link href="/sponsors/submit" className={primaryLinkClass}>
                  Suggest a brand <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setProductCategory("all");
                    setUpcomingOnly(false);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#D8C9FF] bg-white px-4 font-inter text-sm font-medium text-[#5B18BE] transition hover:bg-[#F8F5FF]"
                >
                  Browse all brands
                </button>
              </div>
            </div>

            {suggestedBrands.length > 0 && (
              <div>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8B5CF6]">Keep exploring</p>
                    <h3 className="mt-1 font-space-grotesk text-xl font-semibold text-[#151E3C]">Brands already in the hobby index</h3>
                  </div>
                  <button type="button" onClick={() => { setSearch(""); setCategory("all"); setProductCategory("all"); setUpcomingOnly(false); }} className="inline-flex items-center gap-1 font-inter text-sm font-medium text-[#6C36CE] hover:underline">
                    View all {sponsors.length} brands <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {suggestedBrands.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} stats={stats[sponsor.id] ?? EMPTY_STATS} />
                  ))}
                </div>
              </div>
            )}
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
