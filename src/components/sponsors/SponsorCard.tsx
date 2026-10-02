"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight, Globe } from "lucide-react";

import { getSponsorLogo } from "@/lib/sponsors/sponsorLogos";
import {
  CATEGORY_LABELS,
  TIER_STYLES,
  tierKey,
  withProtocol,
  type SponsorRow,
  type SponsorStats,
} from "./shared";

const MAX_VISIBLE = 3;

interface Props {
  sponsor: SponsorRow;
  stats: SponsorStats;
}

export default function SponsorCard({ sponsor, stats }: Props) {
  const logo = getSponsorLogo(sponsor.name);
  const tier = tierKey(sponsor.tier);
  const profileHref = `/sponsors/${sponsor.slug}`;
  const shows = stats.upcoming.slice(0, MAX_VISIBLE);
  const more = stats.upcoming.length - MAX_VISIBLE;

  function trackClick() {
    fetch(`/api/sponsors/${sponsor.id}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(139,92,246,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <Link href={profileHref} className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#F2EFFE] bg-[#FEF9FF]">
            {logo ? (
              <Image
                src={logo}
                alt={sponsor.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-space-grotesk text-[20px] text-[#8B5CF6]">
                {sponsor.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="line-clamp-2 font-space-grotesk text-[18px] leading-[22px] tracking-[-0.01em] text-[#151E3C]">
              {sponsor.name}
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[#8B5CF6]/10 px-2 py-0.5 font-inter text-[11px] font-medium leading-[14px] text-[#5B18BE]">
                {CATEGORY_LABELS[sponsor.category] ?? sponsor.category}
              </span>

              {tier && (
                <span
                  className={`rounded-full border px-2 py-0.5 font-inter text-[11px] font-medium capitalize leading-[14px] ${TIER_STYLES[tier]}`}
                >
                  {tier}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="shrink-0 text-right">
          <p className="font-space-grotesk text-[24px] leading-[28px] text-[#151E3C]">
            {stats.left}
          </p>
          <p className="font-inter text-[11px] leading-[14px] text-[#151E3C]/55">
            of {stats.total} left
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-inter text-[12px] font-semibold leading-[15px] text-[#8B5CF6]">
            Next shows
          </h3>

          {more > 0 && (
            <Link
              href={profileHref}
              className="font-inter text-[12px] leading-[15px] text-[#8B5CF6] hover:underline"
            >
              +{more} more
            </Link>
          )}
        </div>

        {shows.length === 0 ? (
          <p className="rounded-lg bg-[#FEF9FF] px-3 py-3 font-inter text-[12px] leading-[15px] text-[#151E3C]/50">
            No shows yet.
          </p>
        ) : (
          shows.map((show) => (
            <Link
              key={show.id}
              href={`/events/${show.slug}`}
              className="flex items-center gap-3 rounded-lg bg-[#FEF9FF] px-3 py-2 transition-colors hover:bg-[#F2EFFE]"
            >
              <div className="flex w-9 shrink-0 flex-col items-center">
                <span className="font-space-grotesk text-[18px] leading-5 text-[#151E3C]">
                  {format(parseISO(show.date_start), "d")}
                </span>
                <span className="font-inter text-[10px] uppercase leading-3 text-[#8B5CF6]">
                  {format(parseISO(show.date_start), "MMM")}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-inter text-[13px] font-medium leading-4 text-[#151E3C]">
                  {show.name}
                </p>
                {(show.city || show.state) && (
                  <p className="truncate font-inter text-[11px] leading-[14px] text-[#151E3C]/50">
                    {[show.city, show.state].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-[#8B5CF6]" />
            </Link>
          ))
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[#F2EFFE] pt-4">
        <Link
          href={profileHref}
          className="inline-flex items-center gap-1 font-inter text-[12px] font-medium leading-[15px] text-[#8B5CF6] hover:opacity-80"
        >
          View profile
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {sponsor.website && (
          <a
            href={withProtocol(sponsor.website)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick}
            aria-label={`${sponsor.name} website`}
            className="text-[#151E3C]/50 transition hover:text-[#8B5CF6]"
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
