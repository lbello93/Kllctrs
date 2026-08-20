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

export default function MobileExplore() {
  return (
    <section className="relative w-full h-[500px] bg-[#F2EFFE] overflow-hidden">
      {/* Label */}
      <div className="absolute left-1/2 top-[24px] -translate-x-1/2 flex items-end gap-[9px]">
        <Image
          src="/Favicon/logo.png"
          alt="Gem"
          width={13}
          height={24}
          className="w-auto h-auto"
        />

        <span
          className={`${spaceGrotesk.className} text-[14px] leading-[18px] tracking-[0.15em] uppercase text-[#151E3C]`}
        >
          Explore
        </span>
      </div>

      {/* Heading */}
      <h2
        className={`${unica.className} absolute top-[60px] left-1/2 -translate-x-1/2 text-[32px] leading-[50px] tracking-[-0.04em] text-[#151E3C] text-center`}
      >
        The Hobby Map
      </h2>

      {/* Map Image */}
      <div className="absolute top-[106px] left-0 w-full h-[241px]">
        <Image
          src="/explore-mobile.png"
          alt="Hobby Map"
          fill
          sizes="393px"
          className="object-cover"
        />
      </div>

      {/* Description */}
      <p
        className={`${inter.className} absolute top-[370px] left-1/2 -translate-x-1/2 w-[217px] text-[14px] leading-[20px] text-center text-[#151E3C]`}
      >
        Your real time guide to the collector community everywhere
      </p>

      {/* Button */}
      <Link
        href="/maps"
        className="absolute top-[430px] left-1/2 -translate-x-1/2 w-[140px] h-[48px] bg-[#F0C040] rounded-[10px] flex items-center justify-center text-[14px] text-black"
      >
        Explore Map
      </Link>
    </section>
  );
}
