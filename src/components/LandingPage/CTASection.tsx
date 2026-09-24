"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function DesktopCTASection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-8">
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-[24px] lg:rounded-[32px] h-[430px] lg:h-[484px]">
        {/* Background Image */}
        <Image
          src="/cta-bg.svg"
          alt="KLLCTRS CTA"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end lg:items-center justify-center">
          <div className="w-full max-w-[550px] px-6 pb-10 lg:pb-0 text-center">
            {/* Heading */}
            <h2 className="font-unica-one text-white text-[34px] leading-[0.95] sm:text-[48px] lg:text-[64px]">
              For People Who Never
              <br />
              Stopped Collecting.
            </h2>

            {/* Buttons */}
            <div className="mt-8 flex gap-3 justify-center">
              <Link href="/map" className="flex-1 max-w-[180px]">
                <Button
                  variant="gold"
                  className="h-12 w-full rounded-xl font-semibold"
                >
                  Explore Map
                </Button>
              </Link>

              <Link href="/shops/submit" className="flex-1 max-w-[180px]">
                <Button
                  variant="purple"
                  className="h-12 w-full rounded-xl font-semibold"
                >
                  Join KLLCTRS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileCTASection() {
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
        <h2 className="font-unica-one text-[32px] leading-[32px] tracking-[-0.04em] text-center text-white max-w-[320px]">
          For people who never
          <br />
          stopped collecting
        </h2>

        {/* Buttons */}
        <div className="flex items-center gap-[26px]">
          <Link
            href="/maps"
            className="font-inter w-[140px] h-[48px] bg-[#F0C040] rounded-[10px] flex items-center justify-center text-[14px] text-black"
          >
            Explore Map
          </Link>

          <Link
            href="/shops/submit"
            className="font-inter w-[140px] h-[48px] bg-[#8B5CF6] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center text-[14px] text-white"
          >
            Get Listed
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CTASection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopCTASection />
      </div>

      <div className="block md:hidden">
        <MobileCTASection />
      </div>
    </>
  );
}
