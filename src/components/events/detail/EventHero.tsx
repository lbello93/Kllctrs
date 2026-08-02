import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types";

export default function EventHero({ event }: { event: Event }) {
  return (
    <div
      className="relative h-[285px] w-full overflow-hidden md:h-[285px]"
      style={{
        background: "linear-gradient(89.06deg, #8B5CF6 0.7%, #151E3C 73.95%)",
      }}
    >
      <Image
        src="/EventSlug/Sho.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div className="absolute left-6 top-16 flex w-[calc(100%-48px)] max-w-[463px] flex-col gap-5 md:left-[120px] md:top-[109px]">
        <span className="font-space-grotesk text-[11px] font-medium uppercase tracking-[0.15em] text-[#FEF9FF]">
          Discover
        </span>
        <h1 className="font-unica-one text-4xl leading-[50px] tracking-[-0.04em] text-[#FEF9FF] md:text-[48px]">
          {event.name}
        </h1>
        <p className="font-inter text-base leading-[18px] text-[#FEF9FF]">
          {event.venue_name
            ? `at ${event.venue_name}`
            : `${event.city}, ${event.state}`}
        </p>
      </div>

      <div className="absolute bottom-6 left-6 flex gap-3 md:bottom-auto md:left-[112px] md:top-[237px] md:gap-5">
        <button className="flex h-12 items-center justify-center rounded bg-[#F0C040] px-3.5 font-inter text-sm font-bold text-black">
          Go Pro
        </button>
        <button className="flex h-12 items-center justify-center rounded bg-[#8B5CF6] px-8 font-inter text-sm text-[#FEF9FF]">
          Save
        </button>
        {event.website && (
          <Link
            href={event.website}
            target="_blank"
            className="flex h-12 items-center justify-center rounded bg-[#8B5CF6] px-8 font-inter text-sm text-[#FEF9FF]"
          >
            Visit
          </Link>
        )}
      </div>
    </div>
  );
}
