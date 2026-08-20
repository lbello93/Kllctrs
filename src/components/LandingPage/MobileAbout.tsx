"use client";

import Image from "next/image";
import { Inter, Space_Grotesk, Unica_One } from "next/font/google";

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

export default function MobileAbout() {
  return (
    <section className="relative w-full h-[375px] overflow-hidden">
      {/* Background */}
      <Image
        src="/aboutBG-mobile.png"
        alt="About Background"
        fill
        sizes="393px"
        priority
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {/* Label */}
        <div className="absolute left-[34px] top-[30px] flex items-center gap-6">
          <Image src="/Favicon/logo.png" alt="Gem" width={16} height={29} />

          <span
            className={`${spaceGrotesk.className} text-[14px] leading-[18px] tracking-[0.15em] uppercase text-white font-medium`}
          >
            Why Are We Doing This
          </span>
        </div>

        {/* Heading */}
        <h2
          className={`${unica.className} absolute left-[74px] top-[74px] w-[279px] text-[32px] leading-[90%] tracking-[-0.04em] text-white`}
        >
          The hobby was never
          <br />
          just about the cards
        </h2>

        {/* Description */}
        <div
          className={`${inter.className} absolute left-[203px] top-[170px] w-[156px] flex flex-col gap-7 text-white text-[12px] leading-[100%]`}
        >
          <p>
            It is about discovering the shop two towns away. About trade nights
            that become tradition. The conversations.
            <br />
            The stories. The people.
          </p>

          <p>
            KLLCTRS exists to make the hobby easier to discover, explore, and
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}
