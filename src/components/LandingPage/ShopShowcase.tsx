"use client";

import Image from "next/image";
import Link from "next/link";

function DesktopShopShowcase() {
  return (
    <section className="relative w-full h-[340px] bg-[#FEF9FF] overflow-hidden">
      {/* Background, fades from light on the left into the map art on the right */}
      <Image src="/shop-showcase-bg.png" alt="" fill className="object-cover" />

      <div className="relative w-[1440px] h-full mx-auto flex items-center justify-start pl-[81px]">
        {/* Text block, vertically centered, pinned to the left */}
        <div className="flex w-[463px] flex-col items-start gap-[28px]">
          {/* Frame 303: label + heading */}
          <div className="flex flex-col items-start gap-[31px]">
            {/* Frame 302: gem + label */}
            <div className="flex items-center gap-[16px]">
              <img
                src="/Favicon/logo.png"
                alt="Gem"
                className="w-[16px] h-[29px]"
              />

              <span className="text-[14px] leading-[18px] tracking-[0.15em] uppercase font-medium text-[#151E3C]">
                For Shop Owners And Event Organizers
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-unica-one text-[48px] leading-[50px] tracking-[-0.04em] text-black text-left">
              Bring your shops
              <br />
              and shows online
            </h2>
          </div>

          {/* Button: 129 by 40, per spec */}
          <Link
            href="/shops/submit"
            className="flex h-[40px] w-[129px] items-center justify-center rounded-[4px] bg-[#8B5CF6] text-[14px] font-normal leading-[17px] tracking-[-0.01em] text-[#FEF9FF] hover:opacity-90 transition"
          >
            Get on the Map
          </Link>
        </div>
      </div>
    </section>
  );
}

function MobileShopShowcase() {
  return (
    <section className="relative z-20 w-full h-[356px] bg-[#FEF9FF] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <Image src="/shop-showcase-bg.png" alt="" fill className="object-cover" />

      <div className="relative w-[311px] flex flex-col items-center gap-7">
        {/* Heading Block */}
        <div className="flex flex-col items-center gap-[31px]">
          {/* Label */}
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/Favicon/logo.png"
              alt="Gem"
              width={16}
              height={29}
              className="w-auto h-auto"
            />

            <span className="font-space-grotesk text-[14px] leading-[18px] tracking-[0.15em] uppercase text-center text-[#151E3C]">
              For shop owners and event organizers
            </span>
          </div>

          {/* Title */}
          <h2 className="font-unica-one text-[36px] leading-[38px] tracking-[-0.04em] text-center text-black">
            Bring your shops
            <br />
            and shows online
          </h2>
        </div>

        {/* CTA */}
        <Link
          href="/shops/submit"
          className="flex h-[40px] w-[129px] items-center justify-center rounded-[4px] bg-[#8B5CF6]"
        >
          <span className="font-inter text-[14px] leading-[17px] tracking-[-0.01em] text-[#FEF9FF]">
            Get on the Map
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function ShopShowcase() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopShopShowcase />
      </div>

      <div className="block md:hidden">
        <MobileShopShowcase />
      </div>
    </>
  );
}
