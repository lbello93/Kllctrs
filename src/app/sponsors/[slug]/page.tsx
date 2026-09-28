import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSponsorLogo } from "@/lib/sponsors/sponsorLogos";
import SponsorWebsiteLink from "@/components/sponsors/SponsorWebsiteLink";
import type { Sponsor } from "@/types";

interface Params {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  grading: "Grading",
  grading_company: "Grading",
  auction: "Auctions",
  manufacturer: "Manufacturer",
  card_manufacturer: "Manufacturer",
  marketplace: "Marketplace",
  breaker: "Breakers",
  shop: "Shop",
  software: "Software",
  media: "Media",
  other: "Other",
};

// One database read per request, shared by the page and its metadata.
const getSponsor = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("*")
    .eq("slug", slug)
    .single();

  return data as Sponsor | null;
});

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);

  if (!sponsor) return { title: "Sponsor Not Found | KLLCTRS" };

  return {
    title: `${sponsor.name} | KLLCTRS`,
    description:
      sponsor.description?.slice(0, 155) ??
      `Upcoming card shows sponsored by ${sponsor.name}.`,
  };
}

export default async function SponsorPage({ params }: Params) {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);

  if (!sponsor) notFound();

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: shows } = await supabase
    .from("events")
    .select("id, name, slug, date_start, city, state")
    .eq("status", "approved")
    .contains("sponsors", [sponsor.name])
    .gte("date_start", today)
    .order("date_start", { ascending: true });

  // Count this visit after the page has been sent to the browser.
  after(async () => {
    const { data } = await supabaseAdmin
      .from("sponsors")
      .select("profile_views")
      .eq("id", sponsor.id)
      .single();

    await supabaseAdmin
      .from("sponsors")
      .update({ profile_views: (data?.profile_views ?? 0) + 1 })
      .eq("id", sponsor.id);
  });

  const logo = getSponsorLogo(sponsor.name);
  const categoryLabel = CATEGORY_LABELS[sponsor.category] ?? sponsor.category;
  const upcoming = shows ?? [];

  return (
    <div className="min-h-screen bg-[#FEF9FF] px-4 pb-16 pt-28">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/sponsors"
          className="inline-flex items-center gap-1.5 font-inter text-[14px] leading-[17px] text-[#8B5CF6] transition hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          All sponsors
        </Link>

        <section className="rounded-2xl border border-[#F2EFFE] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#F2EFFE] bg-[#FEF9FF]">
              {logo ? (
                <Image
                  src={logo}
                  alt={sponsor.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-space-grotesk text-[28px] text-[#8B5CF6]">
                  {sponsor.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <span className="inline-flex rounded-full bg-[#8B5CF6]/10 px-3 py-1 font-inter text-[12px] font-medium leading-[15px] text-[#5B18BE]">
                {categoryLabel}
              </span>
              <h1 className="font-space-grotesk text-[28px] font-medium leading-[34px] tracking-[-0.01em] text-[#151E3C] sm:text-[32px]">
                {sponsor.name}
              </h1>
            </div>

            {sponsor.website && (
              <SponsorWebsiteLink
                sponsorId={sponsor.id}
                website={sponsor.website}
              />
            )}
          </div>

          {sponsor.description && (
            <p className="mt-6 font-inter text-[15px] leading-7 text-[#151E3C]/70">
              {sponsor.description}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[#F2EFFE] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-space-grotesk text-[20px] leading-[26px] tracking-[-0.01em] text-[#151E3C]">
              Upcoming shows
            </h2>
            <span className="font-inter text-[12px] leading-[15px] text-[#151E3C]/50">
              {upcoming.length} {upcoming.length === 1 ? "show" : "shows"}
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBBEFB] bg-[#FEF9FF] py-10 text-center">
              <CalendarDays className="mx-auto mb-3 h-6 w-6 text-[#8B5CF6]/50" />
              <p className="font-inter text-[14px] leading-[17px] text-[#151E3C]/60">
                No upcoming shows linked to {sponsor.name} yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((show) => (
                <Link
                  key={show.id}
                  href={`/events/${show.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-[#F2EFFE] bg-[#FEF9FF] p-3 transition hover:border-[#CBBEFB] hover:bg-[#F2EFFE]"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
                    <span className="font-space-grotesk text-[20px] leading-[22px] text-[#151E3C]">
                      {format(parseISO(show.date_start), "d")}
                    </span>
                    <span className="font-inter text-[11px] uppercase leading-[13px] text-[#8B5CF6]">
                      {format(parseISO(show.date_start), "MMM")}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-inter text-[15px] font-medium leading-5 text-[#151E3C]">
                      {show.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 font-inter text-[13px] leading-4 text-[#151E3C]/55">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {show.city}, {show.state}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-[#8B5CF6]" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
