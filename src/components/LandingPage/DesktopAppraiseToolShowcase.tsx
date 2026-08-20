"use client";

import Link from "next/link";
import { User, Clock3, Calendar } from "lucide-react";

function ContentCard({
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

export default function AppraiseToolShowcase() {
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

          <h2
            className="text-[48px] leading-[50px] tracking-[-0.04em] text-[#151E3C]"
            style={{ fontFamily: "Unica One" }}
          >
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
          <ContentCard
            tag="Editorial"
            headerImage="/editorial.png"
            title="The Evolution of the Modern Collecting Culture"
            description="Exploring how the next generation of collectors is shaping the hobby"
            author="Sharanya O."
          />

          <ContentCard
            tag="Cards"
            headerImage="/content.png"
            title="Top 10 Rookie Cards Heating Up this Season"
            description="Rookies making waves on the market right now, and the ones to watch"
            author="Rajeev T."
          />

          <ContentCard
            tag="Editorial"
            headerImage="/editorial.png"
            title="The Evolution of the Modern Collecting Culture"
            description="Exploring how the next generation of collectors is shaping the hobby"
            author="Sharanya O."
          />

          <ContentCard
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
