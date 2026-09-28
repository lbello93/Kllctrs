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
import {
  CATEGORY_LABELS,
  TIER_STYLES,
  primaryLinkClass,
  tierKey,
  type SponsorRow,
  type SponsorShow,
} from "@/components/sponsors/shared";

interface Params {
  params: Promise<{ slug: string }>;
}

// One database read per request, shared by the page and its metadata.
const getSponsor = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("*")
    .eq("slug", slug)
    .single();

  return data as SponsorRow | null;
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
  const now = new Date();
  const year = String(now.getFullYear());
  const today = now.toISOString().split("T")[0];

  const { data: rows } = await supabase
    .from("events")
    .select("id, name, slug, date_start, city, state")
    .eq("status", "approved")
    .contains("sponsors", [sponsor.name])
    .gte("date_start", `${year}-01-01`)
    .order("date_start", { ascending: true });

  const shows = (rows ?? []) as SponsorShow[];
  const upcoming = shows.filter((show) => show.date_start >= today);
  const thisYear = shows.filter((show) => show.date_start.startsWith(year));
  const left = thisYear.filter((show) => show.date_start >= today).length;
  const states = new Set(upcoming.map((show) => show.state).filter(Boolean))
    .size;

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
  const tier = tierKey(sponsor.tier);
  const categoryLabel = CATEGORY_LABELS[sponsor.category] ?? sponsor.category;

  const tiles = [
    { label: "Upcoming shows", value: upcoming.length },
    { label: "Left this year", value: left },
    { label: "States", value: states },
  ];

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

        <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8">
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[#8B5CF6]/10 px-3 py-1 font-inter text-[12px] font-medium leading-[15px] text-[#5B18BE]">
                  {categoryLabel}
                </span>

                {tier && (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 font-inter text-[12px] font-medium capitalize leading-[15px] ${TIER_STYLES[tier]}`}
                  >
                    {tier} sponsor
                  </span>
                )}
              </div>

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

          <div className="mt-6 grid grid-cols-3 gap-3">
            {tiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-xl border border-[#F2EFFE] bg-[#FEF9FF] px-4 py-3"
              >
                <p className="font-space-grotesk text-[24px] leading-[28px] text-[#151E3C]">
                  {tile.value}
                </p>
                <p className="font-inter text-[12px] leading-[15px] text-[#151E3C]/55">
                  {tile.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8">
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
              {upcoming.map((show, index) => (
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
                    <div className="flex items-center gap-2">
                      <p className="truncate font-inter text-[15px] font-medium leading-5 text-[#151E3C]">
                        {show.name}
                      </p>
                      {index === 0 && (
                        <span className="shrink-0 rounded-full bg-[#F0C040]/20 px-2 py-0.5 font-inter text-[11px] font-medium leading-[14px] text-[#9A7A26]">
                          Next up
                        </span>
                      )}
                    </div>
                    {(show.city || show.state) && (
                      <p className="mt-0.5 flex items-center gap-1 font-inter text-[13px] leading-4 text-[#151E3C]/55">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {[show.city, show.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-[#8B5CF6]" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#151E3C] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="font-space-grotesk text-[20px] leading-[26px] tracking-[-0.01em] text-[#FEF9FF]">
              Want your brand here?
            </h2>
            <p className="mt-1 font-inter text-[14px] leading-5 text-[#FEF9FF]/60">
              Become a sponsor and get your own profile on the Hobby Index.
            </p>
          </div>

          <Link href="/sponsors/submit" className={primaryLinkClass}>
            Become a sponsor
          </Link>
        </section>
      </div>
    </div>
  );
}
