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

export default function MobileHero() {
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
          <h1
            className={`${unica.className} text-[40px] leading-[40px] tracking-[-0.04em] text-black`}
          >
            Discover The
            <br />
            Hobby Near You
          </h1>

          <p
            className={`${inter.className} w-[213px] text-[12px] leading-[13px] tracking-[-0.02em] text-black`}
          >
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
              className={`${inter.className} flex-1 bg-transparent text-[12px] text-black placeholder-[#CBBEFB] outline-none`}
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
