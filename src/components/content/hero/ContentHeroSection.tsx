import Image from "next/image";
import { spaceGrotesk, unica } from "@/lib/fonts";
export default function ContentHeroSection() {
  return (
    <section className="relative h-[300px] w-full overflow-hidden">
      {/* Desktop Background */}

      <Image
        src="/Blog/HeroSection.webp"
        alt="Content Hero"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover md:block"
      />

      {/* Mobile Background */}

      <Image
        src="/Blog/BrandsHeroMobile.webp"
        alt="Content Hero Mobile"
        fill
        priority
        sizes="100vw"
        className="block object-cover md:hidden"
      />

      {/* Optional dark overlay */}

      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-[120px]">
          <div className="max-w-[463px]">
            <p
              className={`${spaceGrotesk.className} mb-5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#CBBEFB]`}
            >
              Stories and Culture
            </p>

            <h1
              className={`${unica.className} text-[36px] leading-[38px] tracking-[-0.04em] text-[#FEF9FF] md:text-[48px] md:leading-[50px]`}
            >
              What Collectors
              <br />
              Are Talking About
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
