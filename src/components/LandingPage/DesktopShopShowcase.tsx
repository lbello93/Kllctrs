"use client";

import Link from "next/link";

export default function ShopShowcase() {
  return (
    <section className="w-full h-[340px] bg-[#151E3C] overflow-hidden">
      <div className="relative w-[1440px] h-full mx-auto">
        {/* Left Cards */}
        <div className="absolute left-[182px] top-[26px]">
          <img
            src="/shop-card-1.png"
            alt="Shop Card"
            className="h-[248px] w-auto"
          />
        </div>

        <div className="absolute left-[305px] top-[14px] rotate-[10.35deg]">
          <img
            src="/shop-card-2.png"
            alt="Compleat Strategist"
            className="h-[252px] w-auto"
          />
        </div>

        {/* Right Content */}
        <div className="absolute left-[720px] top-[54px] w-[463px] flex flex-col gap-[28px]">
          {/* Heading Section */}
          <div className="flex flex-col gap-[31px]">
            {/* Label */}
            <div className="flex items-center gap-[16px]">
              <img
                src="/footer/Gem_Pink.png"
                alt="Gem"
                className="w-[16px] h-[29px]"
              />

              <span className="text-[14px] leading-[18px] tracking-[0.15em] uppercase font-medium text-[#FEF9FF]">
                For Shop Owners And Event Organizers
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-[48px] leading-[50px] tracking-[-0.04em] text-[#FEF9FF]"
              style={{ fontFamily: "Unica One" }}
            >
              Bring your shops
              <br />
              and shows online
            </h2>
          </div>

          {/* CTA */}
          <Link
            href="/signup"
            className="w-[140px] h-[40px] bg-[#8B5CF6] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center text-[14px] leading-[17px] tracking-[-0.01em] text-white hover:opacity-90 transition"
          >
            Get Listed
          </Link>
        </div>
      </div>
    </section>
  );
}
