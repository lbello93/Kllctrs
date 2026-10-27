import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { spaceGrotesk, inter } from "@/lib/fonts";
import { CATEGORY_CONFIG } from "../config/categoryConfig";
import type { ContentItem } from "../types";

interface Props {
  item: ContentItem;
}

export default function BlogCard({ item }: Props) {
  const categoryKey = (item.category || "card")
    .toLowerCase()
    .replace(/\s+/g, "_") as keyof typeof CATEGORY_CONFIG;

  const config = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG.card;

  return (
    <Link href={`/blog/${item.slug}`} className="group block w-full">
      <div className="overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Top Image */}

        <div className="relative h-[60px] w-full">
          <Image
            src={config.image}
            alt={config.label}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />

          {/* Tag */}

          <div className="absolute left-5 top-5">
            <span
              className={`
                flex
                h-[20px]
                items-center
                justify-center
                rounded-[10px]
                border
                px-3
                text-[11px]
                font-normal

                ${config.bg}
                ${config.border}
                ${config.text}
              `}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* White Body */}

        <div className="rounded-b-[20px] bg-[#FEF9FF] p-6">
          <div className="flex min-h-[130px] flex-col justify-between">
            {/* Title + Description */}

            <div>
              <h2
                className={`${spaceGrotesk.className} mb-2 line-clamp-2 text-[20px] font-medium leading-[20px] tracking-[-0.01em] text-black`}
              >
                {item.title}
              </h2>

              <p
                className={`${inter.className} line-clamp-3 text-[12px] leading-[15px] tracking-[-0.01em] text-black`}
              >
                {item.meta_description}
              </p>
            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between text-[11px] text-black">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{item.author || "KLLCTRS Editorial"}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>5 Mins Read</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={14} />

                <span>
                  {item.published_at
                    ? format(new Date(item.published_at), "MMM yyyy")
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
