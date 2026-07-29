"use client";

import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter, Unica_One } from "next/font/google";

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export default function MobileShopShowcase() {
  return (
    <section className="w-full h-[356px] bg-[#151E3C] flex items-center justify-center">
      <div className="w-[311px] flex flex-col items-center gap-7">
        {/* Heading Block */}
        <div className="flex flex-col items-center gap-[31px]">
          {/* Label */}
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/footer/Gem_Pink.png"
              alt="Gem"
              width={16}
              height={29}
              className="w-auto h-auto"
            />

            <span
              className={`${spaceGrotesk.className} text-[14px] leading-[18px] tracking-[0.15em] uppercase text-center text-white`}
            >
              For shop owners and event organizers
            </span>
          </div>

          {/* Title */}
          <h2
            className={`${unica.className} text-[36px] leading-[38px] tracking-[-0.04em] text-center text-white`}
          >
            Bring your shops
            <br />
            and shows online
          </h2>
        </div>

        {/* CTA */}
        <Link
          href="/signup"
          className="w-[140px] h-[40px] bg-[#8B5CF6] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center"
        >
          <span
            className={`${inter.className} text-[14px] leading-[17px] tracking-[-0.01em] text-white`}
          >
            Get Listed Today
          </span>
        </Link>
      </div>
    </section>
  );
}
