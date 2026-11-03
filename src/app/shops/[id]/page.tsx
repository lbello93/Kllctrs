import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getShopDetail } from "@/lib/shops/finder";
import EventDetailMap from "@/page-components/MapsPage/map/EventsDetailMap";
import ShopCard, { Stars } from "@/page-components/shop-finder/ShopCard";
import ShopReviewForm from "@/page-components/shop-finder/ShopReviewForm";
import { SHOP_CATEGORY_LABEL } from "@/page-components/shop-finder/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("shops").select("name,city,state").eq("id", id).maybeSingle();
  return data ? { title: `${data.name} — ${data.city}, ${data.state}` } : {};
}

export default async function ShopDetailPage({ params }: Params) {
  const { id } = await params;
  // Legacy slug URLs still resolve to the maps profile.
  if (!UUID_RE.test(id)) redirect(`/maps/shops/${id}`);

  const supabase = await createClient();
  const detail = await getShopDetail(supabase, id);
  if (!detail) notFound();

  const { shop, reviews, rating, reviewCount, ratingBreakdown, nearby } = detail;
  const category = shop.category ?? shop.specialty;
  const hours =
    shop.hours && typeof shop.hours === "object" && !Array.isArray(shop.hours)
      ? (shop.hours as Record<string, unknown>)
      : null;

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/shops" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B18BE] hover:text-violet-900">
          <span aria-hidden>←</span> All shops
        </Link>

        {/* Header */}
        <div className="mb-5 rounded-2xl border border-violet-100 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-3xl font-black text-[#5f2eea]">
                {shop.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">{shop.name}</h1>
                <div className="mt-1 flex items-center gap-2">
                  <Stars rating={rating} />
                  <span className="text-sm text-[#4a3f6b]/60">
                    {rating ? rating.toFixed(1) : "—"} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {category && (
                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                      {SHOP_CATEGORY_LABEL[category] ?? category}
                    </span>
                  )}
                  {shop.is_verified && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {shop.description && <p className="mt-4 text-sm text-[#4a3f6b]/80">{shop.description}</p>}

          {/* Contact */}
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-[#4a3f6b]/80 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#5f2eea]/50" />
              {shop.address ? `${shop.address}, ` : ""}{shop.city}, {shop.state} {shop.zip_code ?? ""}
            </span>
            {shop.phone && (
              <a href={`tel:${shop.phone}`} className="flex items-center gap-2 hover:text-[#5f2eea]">
                <Phone className="h-4 w-4 text-[#5f2eea]/50" /> {shop.phone}
              </a>
            )}
            {shop.website && (
              <a href={shop.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#5f2eea]">
                <Globe className="h-4 w-4 text-[#5f2eea]/50" /> Website
              </a>
            )}
            {shop.email && (
              <a href={`mailto:${shop.email}`} className="flex items-center gap-2 hover:text-[#5f2eea]">
                <Mail className="h-4 w-4 text-[#5f2eea]/50" /> {shop.email}
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            {/* Map */}
            {shop.lat != null && shop.lng != null && (
              <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
                <div className="h-[300px] w-full">
                  <EventDetailMap lat={shop.lat} lng={shop.lng} name={shop.name} />
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="rounded-2xl border border-violet-100 bg-white p-5">
              <h2 className="mb-3 text-lg font-black text-[#1a0a3d]">Reviews ({reviewCount})</h2>

              {reviewCount > 0 && (
                <div className="mb-4 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = ratingBreakdown[star as 1 | 2 | 3 | 4 | 5];
                    const pct = reviewCount ? (n / reviewCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-8 text-[#4a3f6b]/60">{star}★</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-violet-50">
                          <span className="block h-full rounded-full bg-[#F0C040]" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="w-6 text-right text-[#4a3f6b]/50">{n}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-sm text-[#4a3f6b]/50">No reviews yet — be the first.</p>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-xl border border-violet-50 bg-[#faf9ff] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1a0a3d]">{r.reviewer_name}</span>
                        <Stars rating={r.rating} />
                      </div>
                      {r.content && <p className="mt-1 text-sm text-[#4a3f6b]/80">{r.content}</p>}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <ShopReviewForm shopId={shop.id} />
              </div>
            </section>
          </div>

          <div className="space-y-5">
            {/* Hours */}
            {hours && (
              <section className="rounded-2xl border border-violet-100 bg-white p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-[#1a0a3d]">
                  <Clock className="h-4 w-4 text-[#5f2eea]/50" /> Hours
                </h2>
                <ul className="space-y-1 text-sm">
                  {Object.entries(hours).map(([day, value]) => (
                    <li key={day} className="flex justify-between">
                      <span className="capitalize text-[#4a3f6b]/60">{day}</span>
                      <span className="text-[#1a0a3d]">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Nearby */}
            {nearby.length > 0 && (
              <section>
                <h2 className="mb-2 text-lg font-black text-[#1a0a3d]">Nearby shops</h2>
                <div className="space-y-2">
                  {nearby.map((s) => (
                    <ShopCard key={s.id} shop={s} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
