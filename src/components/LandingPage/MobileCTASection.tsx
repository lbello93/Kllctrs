"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Unica_One } from "next/font/google";

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function MobileCTASection() {
  return (
    <section className="relative w-full h-[433px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="/cta-mobile.svg"
        alt="CTA Background"
        fill
        sizes="393px"
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[37px] px-4">
        {/* Heading */}
        <h2
          className={`${unica.className} text-[32px] leading-[32px] tracking-[-0.04em] text-center text-white max-w-[320px]`}
        >
          For people who never
          <br />
          stopped collecting
        </h2>

        {/* Buttons */}
        <div className="flex items-center gap-[26px]">
          <Link
            href="/maps"
            className={`${inter.className} w-[140px] h-[48px] bg-[#F0C040] rounded-[10px] flex items-center justify-center text-[14px] text-black`}
          >
            Explore Map
          </Link>

          <Link
            href="/shops/submit"
            className={`${inter.className} w-[140px] h-[48px] bg-[#8B5CF6] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center text-[14px] text-white`}
          >
            Get Listed
          </Link>
        </div>
      </div>
    </section>
  );
}
