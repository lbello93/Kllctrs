"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PartyPopper, Search, Signpost, Users } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EXPLORE_ITEMS = [
  { icon: PartyPopper, label: "Discover nearby hobby shops" },
  { icon: Search, label: "Explore upcoming events" },
  { icon: Signpost, label: "Plan hobby roadtrips" },
  { icon: Users, label: "Find collector communities" },
];

function DesktopExplore() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mapRef.current,
        { scale: 1 },
        {
          scale: 1.35,
          transformOrigin: "top right",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full h-[640px] bg-[#F2EFFE] flex items-center justify-center"
    >
      <div className="w-[1320px] h-[540px] flex items-center">
        <div className="w-[400px] flex flex-col shrink-0">
          <div className="flex items-center gap-[24px]">
            <img
              src="/Favicon/logo.png"
              alt="Gem"
              className="w-[16px] h-[29px]"
            />

            <span className="text-[14px] leading-[18px] tracking-[0.15em] uppercase font-medium text-[#151E3C]">
              Explore
            </span>
          </div>

          <h2 className="font-unica-one mt-[59px] text-[48px] leading-[50px] tracking-[-0.04em] text-[#151E3C]">
            The Hobby Map
          </h2>

          <p className="mt-[23px] w-[318px] text-[20px] leading-[20px] text-[#151E3C]">
            Your real time guide to the collector community everywhere
          </p>

          <div className="mt-[43px] flex flex-col gap-[16px]">
            {EXPLORE_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-[18px]">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[20px] leading-[20px] text-[#151E3C]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map, flush to the section's own top right corner, not the centered wrapper */}
      <div className="absolute top-0 right-0 w-[860px] h-full">
        <div ref={mapRef} className="absolute inset-0 origin-top-right">
          <Image
            src="/explore-map-cut.png"
            alt="Map of hobby shops and shows"
            fill
            className="object-contain object-right-top"
          />
        </div>
      </div>
    </section>
  );
}

function MobileExplore() {
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

        <span className="font-space-grotesk text-[14px] leading-[18px] tracking-[0.15em] uppercase text-[#151E3C]">
          Explore
        </span>
      </div>

      {/* Heading */}
      <h2 className="font-unica-one absolute top-[60px] left-1/2 -translate-x-1/2 text-[32px] leading-[50px] tracking-[-0.04em] text-[#151E3C] text-center">
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
      <p className="font-inter absolute top-[370px] left-1/2 -translate-x-1/2 w-[217px] text-[14px] leading-[20px] text-center text-[#151E3C]">
        Your real time guide to the collector community everywhere
      </p>
    </section>
  );
}

export default function ExploreSection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopExplore />
      </div>

      <div className="block md:hidden">
        <MobileExplore />
      </div>
    </>
  );
}
