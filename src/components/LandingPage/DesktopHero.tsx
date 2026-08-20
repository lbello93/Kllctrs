"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Inter, Unica_One } from "next/font/google";

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function HeroSection() {
  const [query, setQuery] = useState("");

  const handleSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    window.dispatchEvent(
      new CustomEvent("kllctbls:chat", { detail: { message: trimmed } }),
    );
    setQuery("");
  };

  return (
    <section className="relative w-full h-[710px] overflow-hidden bg-[#FEF9FF]">
      {/* Background */}
      <Image
        src="/Layer_1.png"
        alt="Hero Background"
        fill
        priority
        className="absolute inset-0 z-0 object-cover"
      />

      {/* Left Content */}
      <div className="absolute left-[68px] top-[168px] z-20 w-[576px]">
        {/* Heading */}
        <h1
          className={`${unica.className} text-[84px] leading-[68px] tracking-[-0.04em] text-black`}
        >
          Discover The
          <br />
          Hobby Near You
        </h1>

        {/* Description */}
        <p
          className={`${inter.className} mt-4 max-w-[576px] text-[16px] leading-[28px] tracking-[-0.02em] text-black`}
        >
          Explore card shows, local shops, and events near you. The most active
          hobby community, mapped in real time!
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-5">
          <Link
            href="/maps"
            className="flex h-[48px] w-[140px] items-center justify-center rounded-[10px] bg-[#F0C040] text-[14px] text-black transition hover:opacity-90"
          >
            Explore Map
          </Link>

          <Link
            href="/shops/submit"
            className="flex h-[48px] w-[184px] items-center justify-center rounded-[10px] border border-[#8B5CF6] bg-[#8B5CF6] text-[14px] text-white transition hover:opacity-90"
          >
            Get Listed Today
          </Link>
        </div>

        {/* Search */}
        <div className="mt-[97px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex h-[40px] w-[576px] items-center justify-between rounded-full border border-[#B39EF9] bg-white px-4 shadow-sm"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the hobby..."
              className={`${inter.className} flex-1 bg-transparent text-[14px] text-black placeholder-[#CBBEFB] outline-none`}
            />

            <button type="submit" aria-label="Search">
              <Search size={16} strokeWidth={1.6} className="text-[#5B18BE]" />
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-2 flex gap-[6px]">
            <button
              onClick={() => handleSearch("best pokemon shops in chicago")}
              className="flex h-[24px] items-center justify-center rounded-full border border-[#E5DFFD] bg-[#F2EFFE] px-[14px] hover:bg-[#E5DFFD] transition-colors"
            >
              <span className="text-[11px] text-[#151E3C]">
                best pokemon shops in chicago
              </span>
            </button>

            <button
              onClick={() => handleSearch("where is Nationals 2026")}
              className="flex h-[24px] items-center justify-center rounded-full border border-[#E5DFFD] bg-[#F2EFFE] px-[14px] hover:bg-[#E5DFFD] transition-colors"
            >
              <span className="text-[11px] text-[#151E3C]">
                where is Nationals 2026
              </span>
            </button>

            <button
              onClick={() => handleSearch("top rookies to invest in 2026")}
              className="flex h-[24px] items-center justify-center rounded-full border border-[#E5DFFD] bg-[#F2EFFE] px-[14px] hover:bg-[#E5DFFD] transition-colors"
            >
              <span className="text-[11px] text-[#151E3C]">
                top rookies to invest in 2026
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
