"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

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

  return { query, setQuery, handleSearch };
}

function DesktopHero() {
  const { query, setQuery, handleSearch } = useHeroSearch();

  return (
    <section className="relative w-full h-[710px] overflow-hidden bg-[#FEF9FF]">
      <div className="relative w-[1440px] h-full mx-auto">
        {/* Heading */}
        <h1 className="absolute left-[73px] top-[219px] w-[480px] font-unica-one text-[64px] leading-[62px] tracking-[-0.04em] text-black">
          Discover The
          <br />
          Hobby <span className="text-[#8B5CF6]">Near You</span>
        </h1>

        {/* Description */}
        <p className="absolute left-[73px] top-[374px] w-[480px] font-inter text-[16px] leading-[21px] tracking-[-0.02em] text-black">
          Explore card shows, local shops, and events near you. The most active
          hobby community, mapped in real time!
        </p>

        {/* Buttons */}
        <div className="absolute left-[73px] top-[443px] flex items-center gap-[11px]">
          <Link
            href="/pro"
            className="flex h-[48px] w-[149px] items-center justify-center rounded-[4px] bg-[#F0C040] text-[14px] font-normal tracking-[-0.01em] text-black transition hover:opacity-90"
          >
            Go Pro
          </Link>

          <Link
            href="/join"
            className="flex h-[48px] w-[120px] items-center justify-center rounded-[4px] bg-[#8B5CF6] text-[14px] font-normal tracking-[-0.01em] text-[#FEF9FF] transition hover:opacity-90"
          >
            Join KLLCTRS
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="absolute left-[73px] top-[536px] flex h-[40px] w-[576px] items-center gap-2 rounded-full border border-[#B39EF9] bg-[#FEF9FF] px-4"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find shows, shops, brands & grails"
            className="font-inter flex-1 bg-transparent text-[14px] text-black placeholder-[#CBBEFB] outline-none"
          />

          <button type="submit" aria-label="Search">
            <Search size={16} strokeWidth={1.6} className="text-[#5B18BE]" />
          </button>
        </form>

        {/* Suggestion chips */}
        <div className="absolute left-[73px] top-[592px] flex h-[24px] w-[576px] items-center gap-[6px]">
          {[
            "best pokemon shops in chicago",
            "where is Nationals 2026",
            "top rookies to invest in 2026",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className="flex h-[24px] w-[188px] items-center justify-center rounded-[20px] border border-[#E5DFFD] bg-[#F2EFFE] px-[14px] hover:bg-[#E5DFFD] transition-colors"
            >
              <span className="text-[11px] text-[#151E3C]">{suggestion}</span>
            </button>
          ))}
        </div>

        {/* Map with floating cards */}
        <div className="absolute left-[551px] top-[56px] w-[960px] h-[540px]">
          <Image
            src="/KllctrsMap.png"
            alt="Map of hobby shops and shows across the US"
            fill
            priority
            className="object-contain"
          />

          {/* Slab card, bottom left */}
          <div
            className="kllctrs-hero-card absolute z-10 drop-shadow-xl"
            style={{
              left: "20.3%",
              top: "55.0%",
              width: "15.2%",
              height: "45.4%",
              animationDelay: "0s",
              animationDuration: "4.2s",
            }}
          >
            <Image
              src="/hero-card-1.png"
              alt="Graded card"
              fill
              className="object-contain"
            />
          </div>

          {/* Featured card, top center, tallest */}
          <div
            className="kllctrs-hero-card absolute z-30 drop-shadow-xl"
            style={{
              left: "37.9%",
              top: "27.1%",
              width: "15.9%",
              height: "49.4%",
              animationDelay: "0.6s",
              animationDuration: "4.8s",
            }}
          >
            <Image
              src="/hero-card-2.png"
              alt="Featured card"
              fill
              className="object-contain"
            />
          </div>

          {/* Card, bottom right */}
          <div
            className="kllctrs-hero-card absolute z-20 drop-shadow-xl"
            style={{
              left: "56.1%",
              top: "53.6%",
              width: "13.7%",
              height: "43.0%",
              animationDelay: "1.2s",
              animationDuration: "5.4s",
            }}
          >
            <Image
              src="/hero-card-3.png"
              alt="Featured card"
              fill
              className="object-contain"
            />
          </div>
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
        }
      `}</style>
    </section>
  );
}
function MobileHero() {
  const { query, setQuery, handleSearch } = useHeroSearch();

  return (
    <section className="relative w-full h-[637px] bg-[#FEF9FF] overflow-hidden">
      {/* Background Map */}
      <div className="absolute left-[-99px] top-[-25px] w-[576px] h-[471px]">
        <Image
          src="/hero_mobile.png"
          alt="Hobby Map"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 576px"
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="absolute left-[33px] top-[381px] w-[279px]">
        <div className="flex flex-col gap-4">
          <h1 className="font-unica-one text-[40px] leading-[40px] tracking-[-0.04em] text-black">
            Discover The
            <br />
            Hobby Near You
          </h1>

          <p className="font-inter w-[213px] text-[12px] leading-[13px] tracking-[-0.02em] text-black">
            Explore card shows, local shops, and events near you. The most
            active hobby community, mapped in real time!
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/maps"
              className="w-[109px] h-[36px] bg-[#F0C040] rounded-[10px] flex items-center justify-center text-[14px] text-black"
            >
              Explore Map
            </Link>

            <Link
              href="/shops/submit"
              className="w-[120px] h-[36px] bg-[#8B5CF6] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center text-[14px] text-white"
            >
              Get Listed
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex h-[36px] w-full items-center justify-between rounded-full border border-[#B39EF9] bg-white px-3 shadow-sm"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the hobby..."
              className="font-inter flex-1 bg-transparent text-[12px] text-black placeholder-[#CBBEFB] outline-none"
            />

            <button type="submit" aria-label="Search">
              <Search size={14} strokeWidth={1.6} className="text-[#5B18BE]" />
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
