import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventDetailMap from "@/components/maps/map/EventsDetailMap";
import SaveButton from "@/components/auth/SaveButton";
import type { Shop } from "@/types";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Phone,
  ExternalLink,
  Navigation,
  Store,
} from "lucide-react";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("shops")
    .select("name, city, state, specialty")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Shop Not Found | KLLCTRS" };

  const title = `${data.name} — ${data.city}, ${data.state} | KLLCTRS`;
  const description = `${data.name} is a card shop in ${data.city}, ${data.state}. Find sports cards, Pokémon, and more on KLLCTRS.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "KLLCTRS card shop directory" }],
    },
  };
}

const specialtyLabel: Record<string, string> = {
  sports: "Sports Cards",
  pokemon: "Pokémon",
  both: "Sports & Pokémon",
};

export default async function ShopDetailPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!shop) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSaved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("saved_shops")
      .eq("id", user.id)
      .single();
    isSaved = ((profile?.saved_shops ?? []) as string[]).includes(shop.id);
  }

  const sh = shop as Shop;
  const websiteUrl = sh.website
    ? /^https?:\/\//i.test(sh.website)
      ? sh.website
      : `https://${sh.website}`
    : null;
  const shopSpecialty = sh.specialty
    ? specialtyLabel[sh.specialty] ?? sh.specialty
    : "Collectibles shop";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: sh.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: sh.address ?? "",
      addressLocality: sh.city,
      addressRegion: sh.state,
      postalCode: sh.zip_code ?? "",
      addressCountry: "US",
    },
    ...(sh.lat &&
      sh.lng && {
        geo: { "@type": "GeoCoordinates", latitude: sh.lat, longitude: sh.lng },
      }),
    telephone: sh.phone ?? undefined,
    url: sh.website ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F7F5FC] pb-16 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/maps"
            className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E5DFFD] bg-white px-4 text-sm font-medium text-[#5B18BE] transition hover:border-[#B39EF9] hover:bg-[#F8F5FF]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to map
          </Link>

          <section className="overflow-hidden rounded-3xl border border-[#E5DFFD] bg-white shadow-[0_12px_40px_rgba(21,30,60,0.06)]">
            <div className="bg-gradient-to-r from-[#F2EFFE] via-[#FEF9FF] to-[#FFF8E8] p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white bg-white text-[#6C36CE] shadow-sm sm:h-20 sm:w-20">
                  <Store className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#D8C9FF] bg-white/80 px-3 py-1 text-xs font-semibold text-[#5B18BE]">
                      {shopSpecialty}
                    </span>
                    <span className="rounded-full border border-[#F0D99A] bg-white/80 px-3 py-1 text-xs font-semibold text-[#80621B]">
                      {sh.city}, {sh.state}
                    </span>
                  </div>
                  <h1 className="break-words font-space-grotesk text-3xl font-bold leading-tight tracking-[-0.03em] text-[#151E3C] sm:text-4xl">
                    {sh.name}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#46506B] sm:text-base">
                    Explore {sh.name}, a {shopSpecialty.toLowerCase()} in {sh.city}, {sh.state}. Find its location and contact details, then save it to your KLLCTRS profile for your next hobby trip.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-col sm:items-stretch">
                  <div className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#D8C9FF] bg-white px-2">
                    <SaveButton eventId={sh.id} initialSaved={isSaved} type="shop" />
                  </div>
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6C36CE] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5423AD]"
                    >
                      <Globe className="h-4 w-4" aria-hidden="true" />
                      Visit website
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)] lg:p-8">
              <section className="min-w-0" aria-labelledby="shop-location-heading">
                <div className="mb-3">
                  <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B5CF6]">Find the shop</p>
                  <h2 id="shop-location-heading" className="mt-1 font-space-grotesk text-xl font-semibold text-[#151E3C]">Location</h2>
                </div>
                {sh.lat != null && sh.lng != null ? (
                  <div className="h-[280px] overflow-hidden rounded-2xl border border-[#E5DFFD] bg-[#F2EFFE] sm:h-[360px]">
                    <EventDetailMap lat={sh.lat} lng={sh.lng} name={sh.name} />
                  </div>
                ) : (
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9FF] bg-[#FAF8FF] p-6 text-center">
                    <MapPin className="mb-3 h-8 w-8 text-[#8B5CF6]" aria-hidden="true" />
                    <p className="font-space-grotesk text-base font-semibold text-[#151E3C]">Map location unavailable</p>
                    <p className="mt-1 text-sm leading-5 text-[#596078]">Use the address details to find this shop.</p>
                  </div>
                )}
              </section>

              <aside className="min-w-0 rounded-2xl border border-[#E5DFFD] bg-[#FCFBFE] p-5 sm:p-6" aria-labelledby="visit-shop-heading">
                <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B5CF6]">Plan a visit</p>
                <h2 id="visit-shop-heading" className="mt-1 font-space-grotesk text-xl font-semibold text-[#151E3C]">Shop details</h2>

                <div className="mt-5 space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6C36CE]" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#777B8D]">Address</p>
                      <p className="mt-1 break-words text-sm leading-6 text-[#26304B]">
                        {sh.address || `${sh.city}, ${sh.state}`}
                        {sh.zip_code ? `, ${sh.zip_code}` : ""}
                      </p>
                      {sh.lat != null && sh.lng != null && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${sh.lat},${sh.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6C36CE] hover:underline"
                        >
                          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                          Get directions
                        </a>
                      )}
                    </div>
                  </div>

                  {sh.phone && (
                    <div className="flex items-start gap-3 border-t border-[#E9E3F4] pt-4">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#6C36CE]" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#777B8D]">Call ahead</p>
                        <a href={`tel:${sh.phone}`} className="mt-1 inline-block break-all text-sm font-semibold text-[#6C36CE] hover:underline">{sh.phone}</a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 border-t border-[#E9E3F4] pt-4">
                    <Store className="mt-0.5 h-4 w-4 shrink-0 text-[#6C36CE]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#777B8D]">Shop focus</p>
                      <p className="mt-1 text-sm font-medium text-[#26304B]">{shopSpecialty}</p>
                    </div>
                  </div>

                  {websiteUrl && (
                    <div className="flex items-start gap-3 border-t border-[#E9E3F4] pt-4">
                      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#6C36CE]" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#777B8D]">Website</p>
                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm font-medium text-[#6C36CE] hover:underline">
                          {sh.website?.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E5DFFD] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-space-grotesk text-lg font-semibold text-[#151E3C]">Discover more around you</h2>
              <p className="mt-1 text-sm text-[#596078]">Explore nearby shops and upcoming collector shows on the KLLCTRS map.</p>
            </div>
            <Link href="/maps" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#151E3C] px-5 text-sm font-semibold text-white transition hover:bg-[#26345D]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Explore the map
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
