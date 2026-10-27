"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Crown,
  Search,
  Store,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

const SUGGESTIONS: { label: string; icon: LucideIcon }[] = [
  { label: "best pokemon shops in chicago", icon: Store },
  { label: "where is Nationals 2026", icon: CalendarDays },
  { label: "top rookies to invest in 2026", icon: TrendingUp },
];

const HERO_CARDS = [
  {
    src: "/homepage-articfacts/hero-card-1.webp",
    alt: "Graded card",
    left: "20.3%",
    top: "55.0%",
    width: "15.2%",
    height: "45.4%",
    z: "z-10",
    delay: "0s",
    duration: "4.2s",
  },
  {
    src: "/homepage-articfacts/hero-card-2.webp",
    alt: "Featured card",
    left: "37.9%",
    top: "27.1%",
    width: "15.9%",
    height: "49.4%",
    z: "z-30",
    delay: "0.6s",
    duration: "4.8s",
  },
  {
    src: "/homepage-articfacts/hero-card-3.webp",
    alt: "Featured card",
    left: "56.1%",
    top: "53.6%",
    width: "13.7%",
    height: "43.0%",
    z: "z-20",
    delay: "1.2s",
    duration: "5.4s",
  },
];

function useHeroSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    window.dispatchEvent(
      new CustomEvent("kllctbls:chat", { detail: { message: trimmed } }),
    );
    setQuery("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(query);
  };

  return { query, setQuery, handleSearch, onSubmit };
}

function DesktopHero() {
  const { query, setQuery, handleSearch, onSubmit } = useHeroSearch();

  return (
    <section className="relative h-[710px] w-full overflow-hidden bg-[#FEF9FF]">
      {/* Soft glow behind the map */}
      <div
        className="pointer-events-none absolute right-[8%] top-[10%] h-[420px] w-[420px] rounded-full"
        style={{ background: "rgba(139,92,246,0.12)", filter: "blur(90px)" }}
      />

      {/* Fixed canvas, centered so smaller screens crop evenly */}
      <div className="absolute left-1/2 top-0 h-full w-[1440px] -translate-x-1/2">
        {/* Heading */}
        <h1 className="absolute left-[73px] top-[219px] w-[480px] font-unica-one text-[64px] leading-[62px] tracking-[-0.04em] text-black">
          Discover The
          <br />
          Hobby <span className="text-[#8B5CF6]">Near You</span>
        </h1>

        {/* Description */}
        <p className="absolute left-[73px] top-[374px] w-[480px] font-inter text-[16px] leading-[21px] tracking-[-0.02em] text-black">
          Find card shows, local shops, and collector communities near you on
          the KLLCTRS hobby map.
        </p>

        {/* Buttons */}
        <div className="absolute left-[73px] top-[443px] z-40 flex items-center gap-[11px]">
          <Link
            href="/pricing"
            className="flex h-[48px] items-center justify-center gap-2 rounded-[4px] bg-[#F0C040] px-6 text-[14px] font-medium tracking-[-0.01em] text-black shadow-[0_4px_14px_rgba(240,192,64,0.4)] transition hover:-translate-y-0.5 hover:opacity-95"
          >
            <Crown size={16} aria-hidden />
            Go Pro
          </Link>

          <Link
            href="/login?mode=signup"
            className="flex h-[48px] items-center justify-center gap-2 rounded-[4px] bg-[#8B5CF6] px-6 text-[14px] font-medium tracking-[-0.01em] text-[#FEF9FF] shadow-[0_4px_14px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 hover:opacity-95"
          >
            <UserPlus size={16} aria-hidden />
            Join KLLCTRS
          </Link>
        </div>

        {/* Search */}
        <form
          role="search"
          onSubmit={onSubmit}
          className="absolute left-[73px] top-[536px] z-40 flex h-[44px] w-[576px] items-center gap-2 rounded-full border border-[#B39EF9] bg-[#FEF9FF] pl-4 pr-1.5 transition focus-within:border-[#8B5CF6] focus-within:ring-4 focus-within:ring-[#8B5CF6]/15"
        >
          <label htmlFor="hero-search-desktop" className="sr-only">
            Ask about shows, shops, brands and grails
          </label>
          <input
            id="hero-search-desktop"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find shows, shops, brands & grails"
            autoComplete="off"
            className="font-inter min-w-0 flex-1 bg-transparent text-[14px] text-black outline-none placeholder:text-[#CBBEFB]"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5B18BE] text-white transition hover:bg-[#4a12a0]"
          >
            <Search size={15} strokeWidth={2} aria-hidden />
          </button>
        </form>

        {/* Suggestion chips */}
        <div
          aria-label="Search suggestions"
          className="absolute left-[73px] top-[596px] z-40 flex w-[576px] flex-wrap items-center gap-[6px]"
        >
          {SUGGESTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleSearch(label)}
              className="inline-flex h-[26px] items-center gap-1.5 rounded-[20px] border border-[#E5DFFD] bg-[#F2EFFE] px-[12px] text-[11px] text-[#151E3C] transition-colors hover:bg-[#E5DFFD]"
            >
              <Icon size={12} className="text-[#7c3aed]" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        {/* Map with floating cards */}
        <div className="pointer-events-none absolute left-[551px] top-[56px] h-[540px] w-[960px]">
          <Image
            src="/homepage-articfacts/KllctrsMap.webp"
            alt="Map of hobby shops and shows across the US"
            fill
            priority
            sizes="960px"
            className="object-contain"
          />

          {HERO_CARDS.map((card) => (
            <div
              key={card.src}
              className={`kllctrs-hero-card absolute drop-shadow-xl ${card.z}`}
              style={{
                left: card.left,
                top: card.top,
                width: card.width,
                height: card.height,
                animationDelay: card.delay,
                animationDuration: card.duration,
              }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="160px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes kllctrs-hero-card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        .kllctrs-hero-card {
          animation-name: kllctrs-hero-card-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .kllctrs-hero-card { animation: none; }
        }
      `}</style>
    </section>
  );
}

function MobileHero() {
  const { query, setQuery, onSubmit } = useHeroSearch();

  return (
    <section className="relative h-[637px] w-full overflow-hidden bg-[#FEF9FF]">
      {/* Background Map */}
      <div className="absolute left-[-99px] top-[-25px] h-[471px] w-[576px]">
        <Image
          src="/hero_mobile.webp"
          alt="Hobby Map"
          fill
          priority
          sizes="576px"
          className="object-contain"
        />
      </div>

      {/* Fade the map into the page */}
      <div className="absolute inset-x-0 top-[330px] h-[80px] bg-gradient-to-t from-[#FEF9FF] to-transparent" />

      {/* Content */}
      <div className="absolute left-[33px] top-[381px] w-[calc(100%-66px)] max-w-[330px]">
        <div className="flex flex-col gap-4">
          <h1 className="font-unica-one text-[40px] leading-[40px] tracking-[-0.04em] text-black">
            Discover The
            <br />
            Hobby Near You
          </h1>

          <p className="font-inter max-w-[240px] text-[13px] leading-[17px] tracking-[-0.01em] text-black/80">
            Find card shows, local shops, and collector communities near you.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/maps"
              className="flex h-[40px] items-center justify-center rounded-[10px] bg-[#F0C040] px-4 text-[14px] font-medium text-black transition active:scale-[0.98]"
            >
              Explore Map
            </Link>

            <Link
              href="/shops/submit"
              className="flex h-[40px] items-center justify-center rounded-[10px] border border-[#8B5CF6] bg-[#8B5CF6] px-4 text-[14px] font-medium text-white transition active:scale-[0.98]"
            >
              Get Listed
            </Link>
          </div>

          {/* Search */}
          <form
            role="search"
            onSubmit={onSubmit}
            className="flex h-[44px] w-full items-center gap-2 rounded-full border border-[#B39EF9] bg-white pl-4 pr-1.5 shadow-sm transition focus-within:border-[#8B5CF6] focus-within:ring-4 focus-within:ring-[#8B5CF6]/15"
          >
            <label htmlFor="hero-search-mobile" className="sr-only">
              Ask anything about the hobby
            </label>
            {/* 16px text stops iPhone Safari from zooming in on focus */}
            <input
              id="hero-search-mobile"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the hobby..."
              autoComplete="off"
              enterKeyHint="search"
              className="font-inter min-w-0 flex-1 bg-transparent text-[16px] text-black outline-none placeholder:text-[#CBBEFB]"
            />

            <button
              type="submit"
              aria-label="Search"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5B18BE] text-white"
            >
              <Search size={14} strokeWidth={2} aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHero />
      </div>

      <div className="block md:hidden">
        <MobileHero />
      </div>
    </>
  );
}
