"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Clock3, Calendar } from "lucide-react";

export default function MobileAppraiseToolShowcase() {
  return (
    <section className="w-full bg-[#F2EFFE] px-[10px] py-10">
      <div className="mx-auto flex max-w-[364px] flex-col items-center gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-12">
          <div className="flex items-center gap-4">
            <Image
              src="/Favicon/logo.png"
              alt="Gem"
              width={16}
              height={29}
              className="h-auto w-auto"
            />

            <span className="text-[14px] uppercase tracking-[0.15em] text-[#151E3C]">
              Content
            </span>
          </div>

          <div className="flex flex-col items-center gap-5">
            <h2
              className="text-center text-[32px] leading-[32px] tracking-[-0.04em] text-[#151E3C]"
              style={{ fontFamily: "var(--font-unica)" }}
            >
              Stay Connected
              <br />
              To The Hobby
            </h2>

            <p className="w-[249px] text-center text-[14px] leading-[20px] text-[#151E3C]">
              Instant guides and stories from brands and hobbies you love
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="flex w-full flex-col gap-5">
          {/* Card 1 */}
          <article
            className="
              group
              relative
              w-full
              overflow-hidden
              rounded-[20px]
              transition-all
              duration-300
              ease-out
              hover:-translate-y-2
              hover:shadow-[0_16px_40px_rgba(139,92,246,0.28)]
              active:scale-[0.985]
              active:shadow-[0_10px_25px_rgba(139,92,246,0.22)]
            "
          >
            {/* Soft purple glow */}
            <div
              className="
                pointer-events-none
                absolute
                -inset-1
                z-0
                rounded-[22px]
                bg-[#8B5CF6]
                opacity-0
                blur-xl
                transition-opacity
                duration-300
                group-hover:opacity-20
              "
            />

            {/* Card content */}
            <div className="relative z-10 overflow-hidden rounded-[20px]">
              {/* Header Image */}
              <div className="relative h-[60px] overflow-hidden">
                <Image
                  src="/editorial.png"
                  alt=""
                  fill
                  sizes="364px"
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.05]
                  "
                />

                {/* Slight image overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/10
                    transition-colors
                    duration-300
                    group-hover:bg-transparent
                  "
                />

                {/* Tag */}
                <div
                  className="
                    absolute
                    left-5
                    top-5
                    rounded-[10px]
                    border
                    border-[#CBBEFB]
                    bg-[#8B5CF6]
                    px-3
                    py-1
                    text-[11px]
                    text-white
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  Editorial
                </div>
              </div>

              {/* Body */}
              <div
                className="
                  bg-white
                  p-6
                  transition-colors
                  duration-300
                  group-hover:bg-[#FEF9FF]
                "
              >
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[20px] font-medium leading-[20px] text-black">
                      The Evolution of the Modern Collecting Culture
                    </h3>

                    <p className="mt-2 text-[12px] leading-[15px] text-black">
                      Exploring how the next generation of collectors is shaping
                      the hobby
                    </p>
                  </div>

                  <div className="flex justify-between text-[11px] text-black">
                    <div className="flex items-center gap-1">
                      <User
                        size={14}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>Sharanya O.</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock3
                        size={14}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>5 Mins Read</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar
                        size={14}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>May 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article
            className="
              group
              relative
              w-full
              overflow-hidden
              rounded-[20px]
              transition-all
              duration-300
              ease-out
              hover:-translate-y-2
              hover:shadow-[0_16px_40px_rgba(139,92,246,0.28)]
              active:scale-[0.985]
              active:shadow-[0_10px_25px_rgba(139,92,246,0.22)]
            "
          >
            {/* Soft purple glow */}
            <div
              className="
                pointer-events-none
                absolute
                -inset-1
                z-0
                rounded-[22px]
                bg-[#8B5CF6]
                opacity-0
                blur-xl
                transition-opacity
                duration-300
                group-hover:opacity-20
              "
            />

            {/* Card content */}
            <div className="relative z-10 overflow-hidden rounded-[20px]">
              {/* Header Image */}
              <div className="relative h-[60px] overflow-hidden">
                <Image
                  src="/content.png"
                  alt=""
                  fill
                  sizes="364px"
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.05]
                  "
                />

                {/* Slight image overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/10
                    transition-colors
                    duration-300
                    group-hover:bg-transparent
                  "
                />

                {/* Tag */}
                <div
                  className="
                    absolute
                    left-4
                    top-5
                    rounded-[10px]
                    border
                    border-[#8B9DD6]
                    bg-[#151E3C]
                    px-3
                    py-1
                    text-[11px]
                    text-white
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  Cards
                </div>
              </div>

              {/* Body */}
              <div
                className="
                  bg-white
                  p-6
                  transition-colors
                  duration-300
                  group-hover:bg-[#FEF9FF]
                "
              >
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[20px] font-medium leading-[20px] text-black">
                      Top 10 Rookie Cards Heating Up this Season
                    </h3>

                    <p className="mt-2 text-[12px] leading-[15px] text-black">
                      Rookies making waves on the market right now, and the ones
                      to watch
                    </p>
                  </div>

                  <div className="flex justify-between text-[11px] text-black">
                    <div className="flex items-center gap-1">
                      <User
                        size={14}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>Rajeev T.</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock3
                        size={14}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>5 Mins Read</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar
                        size={14}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>May 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* CTA */}
        <Link
          href="/content"
          className="
            flex
            h-[40px]
            w-[188px]
            items-center
            justify-center
            rounded-[10px]
            border
            border-[#8B5CF6]
            bg-[#8B5CF6]
            text-[14px]
            text-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-[#7C4FE3]
            hover:shadow-[0_8px_24px_rgba(139,92,246,0.30)]
            active:scale-[0.97]
          "
        >
          Explore Content
        </Link>
      </div>
    </section>
  );
}
