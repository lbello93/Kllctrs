import "server-only";
import type { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import { getDistanceMiles } from "@/lib/geo/distance";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export interface ShopItem {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  category: string | null;
  specialty: string | null;
  description: string | null;
  lat: number | null;
  lng: number | null;
  hours: Json | null;
  is_verified: boolean | null;
  rating: number | null;
  reviewCount: number;
  distanceMiles: number | null;
}

export interface ShopReviewItem {
  id: string;
  rating: number;
  content: string | null;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar_url: string | null;
}

const SHOP_COLUMNS =
  "id,slug,name,address,city,state,zip_code,phone,email,website,category,specialty,description,lat,lng,hours,is_verified";

export interface ShopListFilters {
  lat?: number | null;
  lng?: number | null;
  radius?: number | null;
  category?: string;
  minRating?: number | null;
  search?: string;
  state?: string;
  city?: string;
}

/** Aggregate rating + review count per shop from shop_reviews. */
async function reviewStats(supabase: ServerClient, shopIds: string[]) {
  const stats = new Map<string, { sum: number; count: number }>();
  if (shopIds.length === 0) return stats;
  const { data } = await supabase.from("shop_reviews").select("shop_id,rating").in("shop_id", shopIds);
  for (const row of data ?? []) {
    const s = stats.get(row.shop_id) ?? { sum: 0, count: 0 };
    s.sum += row.rating;
    s.count += 1;
    stats.set(row.shop_id, s);
  }
  return stats;
}

export async function listShops(supabase: ServerClient, filters: ShopListFilters): Promise<ShopItem[]> {
  let query = supabase.from("shops").select(SHOP_COLUMNS).eq("status", "approved").order("name");

  if (filters.state) query = query.eq("state", filters.state);
  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  const cats = (filters.category ?? "").split(",").filter(Boolean);
  if (cats.length === 1) query = query.eq("category", cats[0]);
  else if (cats.length > 1) query = query.in("category", cats);
  if (filters.search) query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);

  // Geospatial pre-filter with a bounding box (simple lat/lng math), refined by
  // precise haversine distance below.
  const hasCenter =
    typeof filters.lat === "number" && typeof filters.lng === "number" && !Number.isNaN(filters.lat);
  const radius = filters.radius ?? 25;
  if (hasCenter) {
    const latDelta = radius / 69;
    const lngDelta = radius / (69 * Math.max(0.1, Math.cos((filters.lat! * Math.PI) / 180)));
    query = query
      .gte("lat", filters.lat! - latDelta)
      .lte("lat", filters.lat! + latDelta)
      .gte("lng", filters.lng! - lngDelta)
      .lte("lng", filters.lng! + lngDelta);
  }

  const { data } = await query.limit(500);
  const rows = data ?? [];
  const stats = await reviewStats(supabase, rows.map((s) => s.id));

  let shops: ShopItem[] = rows.map((s) => {
    const stat = stats.get(s.id);
    const rating = stat && stat.count > 0 ? stat.sum / stat.count : null;
    const distanceMiles =
      hasCenter && s.lat != null && s.lng != null
        ? getDistanceMiles(filters.lat!, filters.lng!, s.lat, s.lng)
        : null;
    return { ...s, rating, reviewCount: stat?.count ?? 0, distanceMiles };
  });

  if (hasCenter) {
    shops = shops
      .filter((s) => s.distanceMiles == null || s.distanceMiles <= radius)
      .sort((a, b) => (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity));
  }
  if (filters.minRating) {
    shops = shops.filter((s) => (s.rating ?? 0) >= filters.minRating!);
  }

  return shops;
}

export interface ShopDetail {
  shop: ShopItem;
  reviews: ShopReviewItem[];
  rating: number | null;
  reviewCount: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  nearby: ShopItem[];
}

export async function getShopDetail(supabase: ServerClient, id: string): Promise<ShopDetail | null> {
  const { data: shop } = await supabase.from("shops").select(SHOP_COLUMNS).eq("id", id).maybeSingle();
  if (!shop) return null;

  const { data: reviewRows } = await supabase
    .from("shop_reviews")
    .select("id,rating,content,created_at,user_id")
    .eq("shop_id", id)
    .order("created_at", { ascending: false });

  const userIds = [...new Set((reviewRows ?? []).map((r) => r.user_id))];
  const profileById = new Map<string, { display_name: string | null; avatar_url: string | null }>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,display_name,avatar_url")
      .in("id", userIds);
    for (const p of profiles ?? []) profileById.set(p.id, p);
  }

  const reviews: ShopReviewItem[] = (reviewRows ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    content: r.content,
    created_at: r.created_at,
    reviewer_name: profileById.get(r.user_id)?.display_name || "Collector",
    reviewer_avatar_url: profileById.get(r.user_id)?.avatar_url ?? null,
  }));

  const ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    ratingBreakdown[key] += 1;
  }
  const rating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  // Nearby shops within ~25 miles (bounding box), excluding this one.
  let nearby: ShopItem[] = [];
  if (shop.lat != null && shop.lng != null) {
    const all = await listShops(supabase, { lat: shop.lat, lng: shop.lng, radius: 25 });
    nearby = all.filter((s) => s.id !== id).slice(0, 4);
  }

  return {
    shop: { ...shop, rating, reviewCount: reviews.length, distanceMiles: null },
    reviews,
    rating,
    reviewCount: reviews.length,
    ratingBreakdown,
    nearby,
  };
}
