"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Clock3, Calendar } from "lucide-react";

export default function MobileAppraiseToolShowcase() {
  return (
    <section className="w-full bg-[#F2EFFE] py-10 px-[10px]">
      <div className="max-w-[364px] mx-auto flex flex-col items-center gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-12">
          <div className="flex items-center gap-4">
            <Image
              src="/Favicon/logo.png"
              alt="Gem"
              width={16}
              height={29}
              className="w-auto h-auto"
            />

            <span className="text-[14px] uppercase tracking-[0.15em] text-[#151E3C]">
              Content
            </span>
          </div>

          <div className="flex flex-col items-center gap-5">
            <h2
              className="text-[32px] leading-[32px] tracking-[-0.04em] text-center text-[#151E3C]"
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
        <div className="w-full flex flex-col gap-5">
          {/* Card 1 */}
          <article className="w-full overflow-hidden rounded-[20px]">
            <div className="relative h-[60px]">
              <Image
                src="/editorial.png"
                alt=""
                fill
                sizes="364px"
                className="object-cover"
              />

              <div className="absolute left-5 top-5 px-3 py-1 bg-[#8B5CF6] border border-[#CBBEFB] rounded-[10px] text-[11px] text-white">
                Editorial
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-[20px] leading-[20px] font-medium">
                    The Evolution of the Modern Collecting Culture
                  </h3>

                  <p className="mt-2 text-[12px] leading-[15px]">
                    Exploring how the next generation of collectors is shaping
                    the hobby
                  </p>
                </div>

                <div className="flex justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Sharanya O.</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock3 size={14} />
                    <span>5 Mins Read</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>May 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="w-full overflow-hidden rounded-[20px]">
            <div className="relative h-[60px]">
              <Image
                src="/content.png"
                alt=""
                fill
                sizes="364px"
                className="object-cover"
              />

              <div className="absolute left-4 top-5 px-3 py-1 bg-[#151E3C] border border-[#8B9DD6] rounded-[10px] text-[11px] text-white">
                Cards
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-[20px] leading-[20px] font-medium">
                    Top 10 Rookie Cards Heating Up this Season
                  </h3>

                  <p className="mt-2 text-[12px] leading-[15px]">
                    Rookies making waves on the market right now, and the ones
                    to watch
                  </p>
                </div>

                <div className="flex justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Rajeev T.</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock3 size={14} />
                    <span>5 Mins Read</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>May 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* CTA */}
        <Link
          href="/content"
          className="w-[188px] h-[40px] bg-[#8B5CF6] rounded-[10px] border border-[#8B5CF6] flex items-center justify-center text-white text-[14px]"
        >
          Explore Content
        </Link>
      </div>
    </section>
  );
}
