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
    <div className="w-[363px] h-[239px]">
      {/* Header */}
      <div
        className={`h-[60px] rounded-t-[20px] px-4 py-[19px] flex items-start bg-cover bg-center ${
          isEditorial ? "bg-[#8B5CF6]" : "bg-[#151E3C]"
        }`}
        style={
          headerImage ? { backgroundImage: `url('${headerImage}')` } : undefined
        }
      >
        <div
          className={`px-3 py-1 rounded-[10px] text-[11px] border ${
            isEditorial
              ? "bg-[#8B5CF6] border-[#CBBEFB] text-white"
              : "bg-[#151E3C] border-[#8B9DD6] text-white"
          }`}
        >
          {tag}
        </div>
      </div>

      {/* Body */}
      <div className="h-[179px] bg-white rounded-b-[20px] p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-[20px] leading-[20px] font-medium text-black mb-2">
            {title}
          </h3>

          <p className="text-[12px] leading-[15px] text-black">{description}</p>
        </div>

        <div className="flex justify-between items-center text-[11px] text-black">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{author}</span>
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
  );
}

export default function AppraiseToolShowcase() {
  return (
    <section className="w-full h-[626px] bg-[#F2EFFE] flex justify-center">
      <div className="w-[1245px] h-full flex items-center justify-between">
        {/* Left Content */}
        <div className="w-[463px]">
          <div className="flex items-center gap-4 mb-[64px]">
            <img
              src="/Favicon/logo.png"
              alt="Gem"
              className="w-[16px] h-[29px]"
            />

            <span className="uppercase tracking-[0.15em] text-[14px] font-medium text-[#151E3C]">
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
            className="mt-8 w-[300px] h-[40px] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center text-[#8B5CF6] text-[14px]"
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
