"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Clock3, Calendar } from "lucide-react";

function DesktopContentCard({
  tag,
  title,
  description,
  author,
  headerImage,
}: {
  tag: string;
  title: string;
  description: string;
  author: string;
  headerImage?: string;
}) {
  const isEditorial = tag === "Editorial";

  return (
    <div
      className="
        group
        relative
        w-[363px]
        h-[239px]
        cursor-pointer
        rounded-[20px]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-2
        hover:shadow-[0_18px_45px_rgba(139,92,246,0.28)]
      "
    >
      {/* Soft hover glow */}
      <div
        className="
          pointer-events-none
          absolute
          -inset-1
          rounded-[22px]
          bg-[#8B5CF6]
          opacity-0
          blur-xl
          transition-opacity
          duration-300
          group-hover:opacity-20
        "
      />

      {/* Card */}
      <div className="relative h-full overflow-hidden rounded-[20px]">
        {/* Header */}
        <div
          className={`
            relative
            flex
            h-[60px]
            items-start
            rounded-t-[20px]
            bg-cover
            bg-center
            px-4
            py-[19px]
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.03]
            ${isEditorial ? "bg-[#8B5CF6]" : "bg-[#151E3C]"}
          `}
          style={
            headerImage
              ? {
                  backgroundImage: `url('${headerImage}')`,
                }
              : undefined
          }
        >
          {/* Header overlay */}
          {headerImage && (
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
          )}

          {/* Tag */}
          <div
            className={`
              relative
              z-10
              rounded-[10px]
              border
              px-3
              py-1
              text-[11px]
              transition-all
              duration-300
              group-hover:translate-x-1
              ${
                isEditorial
                  ? "border-[#CBBEFB] bg-[#8B5CF6] text-white"
                  : "border-[#8B9DD6] bg-[#151E3C] text-white"
              }
            `}
          >
            {tag}
          </div>
        </div>

        {/* Body */}
        <div
          className="
            flex
            h-[179px]
            flex-col
            justify-between
            rounded-b-[20px]
            bg-white
            p-6
            transition-colors
            duration-300
            group-hover:bg-[#FEF9FF]
          "
        >
          <div>
            <h3
              className="
                mb-2
                text-[20px]
                font-medium
                leading-[20px]
                text-black
                transition-colors
                duration-300
                group-hover:text-[#151E3C]
              "
            >
              {title}
            </h3>

            <p className="text-[12px] leading-[15px] text-black">
              {description}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-[11px] text-black">
            <div className="flex items-center gap-1">
              <User
                size={14}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>{author}</span>
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
  );
}

function DesktopAppraiseToolShowcase() {
  return (
    <section className="flex h-[626px] w-full justify-center bg-[#F2EFFE]">
      <div className="flex h-full w-[1245px] items-center justify-between">
        {/* Left Content */}
        <div className="w-[463px]">
          <div className="mb-[64px] flex items-center gap-4">
            <img
              src="/Favicon/logo.png"
              alt="Gem"
              className="h-[29px] w-[16px]"
            />

            <span className="text-[14px] font-medium uppercase tracking-[0.15em] text-[#151E3C]">
              Content
            </span>
          </div>

          <h2 className="font-unica-one text-[48px] leading-[50px] tracking-[-0.04em] text-[#151E3C]">
            Stay connected
            <br />
            to the hobby
          </h2>

          <p className="mt-6 w-[318px] text-[20px] leading-[20px] text-[#151E3C]">
            Instant guides and stories from brands and hobbies you love
          </p>

          <Link
            href="/blog"
            className="
              mt-8
              flex
              h-[40px]
              w-[300px]
              items-center
              justify-center
              rounded-[10px]
              border
              border-[#8B5CF6]
              text-[14px]
              text-[#8B5CF6]
              transition-all
              duration-300
              hover:bg-[#8B5CF6]
              hover:text-white
              hover:shadow-[0_8px_24px_rgba(139,92,246,0.25)]
            "
          >
            Explore Content
          </Link>
        </div>

        {/* Right Cards */}
        <div className="grid grid-cols-2 gap-x-[28px] gap-y-[24px]">
          <DesktopContentCard
            tag="Editorial"
            headerImage="/editorial.png"
            title="The Evolution of the Modern Collecting Culture"
            description="Exploring how the next generation of collectors is shaping the hobby"
            author="Sharanya O."
          />

          <DesktopContentCard
            tag="Cards"
            headerImage="/content.png"
            title="Top 10 Rookie Cards Heating Up this Season"
            description="Rookies making waves on the market right now, and the ones to watch"
            author="Rajeev T."
          />

          <DesktopContentCard
            tag="Editorial"
            headerImage="/editorial.png"
            title="The Evolution of the Modern Collecting Culture"
            description="Exploring how the next generation of collectors is shaping the hobby"
            author="Sharanya O."
          />

          <DesktopContentCard
            tag="Cards"
            headerImage="/content.png"
            title="Top 10 Rookie Cards Heating Up this Season"
            description="Rookies making waves on the market right now, and the ones to watch"
            author="Rajeev T."
          />
        </div>
      </div>
    </section>
  );
}

function MobileAppraiseToolShowcase() {
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
            <h2 className="font-unica-one text-center text-[32px] leading-[32px] tracking-[-0.04em] text-[#151E3C]">
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
          {[
            {
              tag: "Editorial",
              image: "/editorial.png",
              title: "The Evolution of the Modern Collecting Culture",
              description:
                "Exploring how the next generation of collectors is shaping the hobby",
              author: "Sharanya O.",
              tagStyle: "border-[#CBBEFB] bg-[#8B5CF6]",
            },
            {
              tag: "Cards",
              image: "/content.png",
              title: "Top 10 Rookie Cards Heating Up this Season",
              description:
                "Rookies making waves on the market right now, and the ones to watch",
              author: "Rajeev T.",
              tagStyle: "border-[#8B9DD6] bg-[#151E3C]",
            },
          ].map((card) => (
            <article
              key={card.title}
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
                    src={card.image}
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
                    className={`
                      absolute
                      left-5
                      top-5
                      rounded-[10px]
                      border
                      px-3
                      py-1
                      text-[11px]
                      text-white
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      ${card.tagStyle}
                    `}
                  >
                    {card.tag}
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
                        {card.title}
                      </h3>

                      <p className="mt-2 text-[12px] leading-[15px] text-black">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex justify-between text-[11px] text-black">
                      <div className="flex items-center gap-1">
                        <User
                          size={14}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span>{card.author}</span>
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
          ))}
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

export default function AppraiseToolShowcase() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopAppraiseToolShowcase />
      </div>

      <div className="block md:hidden">
        <MobileAppraiseToolShowcase />
      </div>
    </>
  );
}
