import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, MapPin, BadgeCheck, Globe, Image as ImageIcon, PackageOpen, UsersRound, MapPinned, Clock3 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSponsorLogo } from "@/lib/sponsors/sponsorLogos";
import SponsorWebsiteLink from "@/components/sponsors/SponsorWebsiteLink";
import BrandInterestForm from "@/components/sponsors/BrandInterestForm";
import MonthlyCollectorEvents from "@/components/sponsors/MonthlyCollectorEvents";
import {
  CATEGORY_LABELS,
  TIER_STYLES,
  tierKey,
  type SponsorRow,
  type SponsorShow,
  type SponsorSocial,
  type SponsorImage,
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
      `Card shows sponsored by ${sponsor.name}.`,
  };
}

export default async function SponsorPage({ params }: Params) {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);

  if (!sponsor) notFound();

  const supabase = await createClient();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const [{ data: links }, { data: legacyRows }, { data: socials }, { data: images }] = await Promise.all([
    supabase.from("sponsor_shows").select("event_id").eq("sponsor_id", sponsor.id),
    supabase
    .from("events")
    .select("id, name, slug, date_start, date_end, city, state, venue_name")
    .eq("status", "approved")
    .contains("sponsors", [sponsor.name])
    .order("date_start", { ascending: true }),
    supabase.from("sponsor_socials").select("id, platform, url").eq("sponsor_id", sponsor.id),
    supabase.from("sponsor_images").select("id, image_url, alt_text").eq("sponsor_id", sponsor.id),
  ]);

  const eventIds = [...new Set((links ?? []).map((row) => row.event_id))];
  const linkedRows = eventIds.length
    ? await supabase.from("events").select("id, name, slug, date_start, date_end, city, state, venue_name").eq("status", "approved").in("id", eventIds)
    : { data: [] };
  const shows = [...new Map([...(legacyRows ?? []), ...(linkedRows.data ?? [])].map((show) => [show.id, show])).values()]
    .sort((a, b) => a.date_start.localeCompare(b.date_start)) as SponsorShow[];

  const upcoming = shows.filter((show) => show.date_start >= today);
  const past = shows.filter((show) => show.date_start < today).reverse();
  const currentMonth = today.slice(0, 7);
  const thisMonth = shows.filter((show) => show.date_start.slice(0, 7) === currentMonth);
  const states = new Set(upcoming.map((show) => show.state).filter(Boolean))
    .size;

  // Count this visit after the page has been sent.
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

  const logo = sponsor.logo_url || getSponsorLogo(sponsor.name);
  const tier = tierKey(sponsor.tier);
  const eventList = (items: SponsorShow[], empty: string) => items.length === 0 ? (
    <p className="rounded-xl border border-dashed border-[#CBBEFB] bg-[#FEF9FF] py-8 text-center font-inter text-[14px] leading-[17px] text-[#151E3C]/60">{empty}</p>
  ) : (
    <div className="space-y-3">{items.map((show, index) => (
      <Link key={show.id} href={`/events/${show.slug}`} className="flex items-center gap-4 rounded-xl border border-[#F2EFFE] bg-[#FEF9FF] p-3 transition hover:border-[#CBBEFB] hover:bg-[#F2EFFE]">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
          <span className="font-space-grotesk text-[20px] leading-[22px] text-[#151E3C]">{format(parseISO(show.date_start), "d")}</span>
          <span className="font-inter text-[11px] uppercase leading-[13px] text-[#8B5CF6]">{format(parseISO(show.date_start), "MMM yyyy")}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><p className="truncate font-inter text-[15px] font-medium leading-5 text-[#151E3C]">{show.name}</p>{index === 0 && items === upcoming && <span className="shrink-0 rounded-full bg-[#F0C040]/20 px-2 py-0.5 font-inter text-[11px] text-[#9A7A26]">Next</span>}</div>
          <p className="mt-0.5 flex items-center gap-1 truncate font-inter text-[13px] leading-4 text-[#151E3C]/55"><MapPin className="h-3.5 w-3.5 shrink-0" />{[show.venue_name, show.city, show.state].filter(Boolean).join(" · ") || "Location to be announced"}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[#8B5CF6]" />
      </Link>
    ))}</div>
  );

  return (
    <div className="min-h-screen bg-[#FEF9FF] px-4 pb-16 pt-28">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/sponsors"
          className="inline-flex items-center gap-1.5 font-inter text-[14px] leading-[17px] text-[#8B5CF6] transition hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          All brands
        </Link>

        <section className="overflow-hidden rounded-2xl border border-[#E5DFFD] bg-white shadow-sm">
          <div className="relative h-36 bg-[#151E3C] sm:h-52">
            {sponsor.banner_url && <Image src={sponsor.banner_url} alt="" fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#151E3C]/75 to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
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
                <span className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 font-inter text-[12px] font-medium leading-[15px] text-[#5B18BE]">
                  {CATEGORY_LABELS[sponsor.category] ?? sponsor.category}
                </span>

                {sponsor.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-inter text-[12px] text-emerald-700"><BadgeCheck className="h-4 w-4" />Verified</span>}
                {tier && (
                  <span
                    className={`rounded-full border px-3 py-1 font-inter text-[12px] font-medium capitalize leading-[15px] ${TIER_STYLES[tier]}`}
                  >
                    {tier}
                  </span>
                )}
              </div>

              <h1 className="font-space-grotesk text-[28px] font-medium leading-[34px] tracking-[-0.01em] text-[#151E3C] sm:text-[32px]">
                {sponsor.name}
              </h1>
              {sponsor.tagline && <p className="font-inter text-[14px] leading-5 text-[#151E3C]/65">{sponsor.tagline}</p>}
            </div>

            {sponsor.website && (
              <SponsorWebsiteLink
                sponsorId={sponsor.id}
                website={sponsor.website}
              />
            )}
          </div>

          {(sponsor.description || sponsor.headquarters || sponsor.founded_year) && (
            <>
            {sponsor.description && (
            <p className="mt-6 font-inter text-[15px] leading-7 text-[#151E3C]/70">
              {sponsor.description}
            </p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">{sponsor.headquarters && <span className="rounded-full bg-[#F2EFFE] px-3 py-1.5 font-inter text-[12px] text-[#151E3C]"><MapPin className="mr-1 inline h-3.5 w-3.5" />{sponsor.headquarters}</span>}{sponsor.founded_year && <span className="rounded-full bg-[#F2EFFE] px-3 py-1.5 font-inter text-[12px] text-[#151E3C]">Founded {sponsor.founded_year}</span>}</div>
            </>
          )}
          <p className="mt-5 font-inter text-[13px] leading-4 text-[#151E3C]/55">{upcoming.length} upcoming events · {past.length} past events · {states} states</p>
          {(sponsor.info_verified_at || sponsor.info_source_url) && <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-[11px] text-[#151E3C]/45"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />Details checked {sponsor.info_verified_at ? format(parseISO(sponsor.info_verified_at), "MMM d, yyyy") : "date unavailable"}</span>{sponsor.info_source_url && <a href={/^https?:\/\//i.test(sponsor.info_source_url) ? sponsor.info_source_url : `https://${sponsor.info_source_url}`} target="_blank" rel="noopener noreferrer" className="text-[#6C36CE] underline">View information source</a>}</p>}
          {(socials?.length || sponsor.website) ? <div className="mt-5 flex flex-wrap gap-3">{sponsor.website && <a href={/^https?:\/\//i.test(sponsor.website) ? sponsor.website : `https://${sponsor.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#151E3C] px-4 py-2 font-inter text-[13px] text-white"><Globe className="h-4 w-4" />Official website</a>}{(socials as SponsorSocial[] | null)?.map((social) => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#E5DFFD] px-3 py-2 font-inter text-[13px] text-[#151E3C] hover:bg-[#F2EFFE]">{social.platform}</a>)}</div> : null}
          </div>
        </section>

        {(sponsor.offerings?.length || sponsor.product_categories?.length || sponsor.target_audience?.length || sponsor.service_area) ? <section className="grid gap-4 sm:grid-cols-2">
          {!!sponsor.offerings?.length && <div className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm"><h2 className="mb-3 flex items-center gap-2 font-space-grotesk text-[19px] text-[#151E3C]"><PackageOpen className="h-5 w-5 text-[#8B5CF6]" />What they offer</h2><ul className="space-y-2">{sponsor.offerings.map((item) => <li key={item} className="font-inter text-[13px] leading-5 text-[#151E3C]/70">• {item}</li>)}</ul></div>}
          {!!sponsor.product_categories?.length && <div className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm"><h2 className="mb-3 font-space-grotesk text-[19px] text-[#151E3C]">Collecting categories</h2><div className="flex flex-wrap gap-2">{sponsor.product_categories.map((item) => <span key={item} className="rounded-full bg-[#F2EFFE] px-3 py-1.5 font-inter text-[12px] text-[#5B18BE]">{item}</span>)}</div></div>}
          {!!sponsor.target_audience?.length && <div className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm"><h2 className="mb-3 flex items-center gap-2 font-space-grotesk text-[19px] text-[#151E3C]"><UsersRound className="h-5 w-5 text-[#8B5CF6]" />Who it serves</h2><div className="flex flex-wrap gap-2">{sponsor.target_audience.map((item) => <span key={item} className="rounded-full border border-[#E5DFFD] px-3 py-1.5 font-inter text-[12px] text-[#151E3C]/70">{item}</span>)}</div></div>}
          {sponsor.service_area && <div className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm"><h2 className="mb-3 flex items-center gap-2 font-space-grotesk text-[19px] text-[#151E3C]"><MapPinned className="h-5 w-5 text-[#8B5CF6]" />Service area</h2><p className="font-inter text-[13px] leading-5 text-[#151E3C]/70">{sponsor.service_area}</p></div>}
        </section> : null}

        {thisMonth.length > 0 && <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8"><div className="mb-4 flex items-end justify-between"><div><p className="font-inter text-[11px] uppercase tracking-widest text-[#8B5CF6]">{new Date(`${currentMonth}-01T12:00:00`).toLocaleString("en-US", { month: "long", year: "numeric" })}</p><h2 className="font-space-grotesk text-[22px] text-[#151E3C]">{sponsor.name} events this month</h2></div><span className="font-inter text-[12px] text-[#151E3C]/50">{thisMonth.length} listed</span></div>{eventList(thisMonth, "No brand events listed this month.")}</section>}

        <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8"><div className="mb-4 flex items-end justify-between"><div><p className="font-inter text-[11px] uppercase tracking-widest text-[#8B5CF6]">Calendar</p><h2 className="font-space-grotesk text-[22px] text-[#151E3C]">All upcoming brand events</h2></div><span className="font-inter text-[12px] text-[#151E3C]/50">{upcoming.length} listed</span></div>{eventList(upcoming, "No upcoming events listed yet.")}</section>

        <MonthlyCollectorEvents />

        {past.length > 0 && <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8"><h2 className="mb-4 font-space-grotesk text-[20px] text-[#151E3C]">Past events</h2>{eventList(past, "No past events listed.")}</section>}

        {!!images?.length && <section className="rounded-2xl border border-[#E5DFFD] bg-white p-6 shadow-sm sm:p-8"><h2 className="mb-4 inline-flex items-center gap-2 font-space-grotesk text-[20px] text-[#151E3C]"><ImageIcon className="h-5 w-5 text-[#8B5CF6]" />Brand gallery</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{(images as SponsorImage[]).map((image) => <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F2EFFE]"><Image src={image.image_url} alt={image.alt_text || `${sponsor.name} brand image`} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" /></div>)}</div></section>}

        <BrandInterestForm sponsorId={sponsor.id} sponsorName={sponsor.name} events={upcoming} />

        <p className="text-center font-inter text-[13px] leading-4 text-[#151E3C]/55">
          Want your brand here?{" "}
          <Link
            href="/sponsors/submit"
            className="text-[#8B5CF6] underline-offset-4 hover:underline"
          >
            Become a sponsor
          </Link>
        </p>
      </div>
    </div>
  );
}
