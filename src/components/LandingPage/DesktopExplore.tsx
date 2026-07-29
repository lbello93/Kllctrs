"use client";

import Link from "next/link";
import { PartyPopper, Search, Signpost, Users } from "lucide-react";

export default function ExploreSection() {
  return (
    <section className="w-full h-[562px] bg-[#F2EFFE] flex items-center justify-center">
      <div className="w-[1320px] h-[395px] flex items-center justify-between">
        <div className="w-[463px] flex flex-col">
          <div className="flex items-center gap-[24px]">
            <img
              src="/footer/Gem_Pink.png"
              alt="Gem"
              className="w-[16px] h-[29px]"
            />

            <span className="text-[14px] leading-[18px] tracking-[0.15em] uppercase font-medium text-[#151E3C]">
              Explore
            </span>
          </div>

          <h2
            className="mt-[59px] text-[48px] leading-[50px] tracking-[-0.04em] text-[#151E3C]"
            style={{ fontFamily: "Unica One" }}
          >
            The Hobby Map
          </h2>

          <p className="mt-[23px] w-[318px] text-[20px] leading-[20px] text-[#151E3C]">
            Your real time guide to the collector community everywhere
          </p>

          <div className="mt-[43px] flex flex-col gap-[16px]">
            <div className="flex items-center gap-[18px]">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <PartyPopper className="w-4 h-4 text-white" />
              </div>
              <span className="text-[20px] leading-[20px] text-[#151E3C]">
                Discover nearby hobby shops
              </span>
            </div>

            <div className="flex items-center gap-[18px]">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-[20px] leading-[20px] text-[#151E3C]">
                Explore upcoming events
              </span>
            </div>

            <div className="flex items-center gap-[18px]">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <Signpost className="w-4 h-4 text-white" />
              </div>
              <span className="text-[20px] leading-[20px] text-[#151E3C]">
                Plan hobby roadtrips
              </span>
            </div>

            <div className="flex items-center gap-[18px]">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-[20px] leading-[20px] text-[#151E3C]">
                Find collector communities
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-[857px] h-[390px] rounded-[20px] overflow-hidden bg-[url('/explore-bg.png')] bg-cover bg-center">
          <div className="absolute bottom-[39px] right-[80px]">
            <Link
              href="/maps"
              className="w-[140px] h-[48px] bg-[#F0C040] rounded-[10px] flex items-center justify-center text-[14px] leading-[17px] text-black transition hover:opacity-90"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
