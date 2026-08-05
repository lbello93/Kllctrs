import Image from "next/image";
import { Space_Grotesk, Unica_One } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

export default function SponsorsHero() {
  return (
    <section className="relative w-full h-[300px] overflow-hidden">
      {/* Mobile Background */}
      <Image
        src="/sponsors/sponsMobile.png"
        alt="Brands Hero"
        fill
        priority
        sizes="100vw"
        className="block md:hidden object-cover object-center select-none pointer-events-none"
      />

      {/* Desktop Background */}
      <Image
        src="/sponsors/sponsors.jpeg"
        alt="Brands Hero"
        fill
        priority
        sizes="100vw"
        className="hidden md:block object-cover object-center select-none pointer-events-none"
      />

      {/* Content */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 md:left-[120px] md:top-[109px] md:translate-y-0 flex flex-col justify-center items-start gap-5 w-[90%] md:w-[463px]">
        <p
          className={`${spaceGrotesk.className} text-[11px] leading-[14px] font-medium tracking-[0.15em] uppercase text-[#FEF9FF] m-0 p-0`}
        >
          THE HOBBY INDEX
        </p>

        <h1
          className={`${unica.className} text-[32px] leading-[36px] md:text-[48px] md:leading-[50px] tracking-[-0.04em] font-normal text-[#FEF9FF] m-0 p-0`}
        >
          Explore Brands That
          <br />
          Shape Collecting
        </h1>
      </div>
    </section>
  );
}
