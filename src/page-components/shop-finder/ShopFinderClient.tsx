"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LocateFixed, PlusCircle, Search } from "lucide-react";

import ShopMap from "@/page-components/MapsPage/map/ShopMap";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { Shop } from "@/types";
import ShopCard from "./ShopCard";
import {
  RADIUS_OPTIONS,
  SHOP_CATEGORIES,
  type ShopFilters,
  type ShopItem,
} from "./types";

interface Props {
  shops: ShopItem[];
  filters: ShopFilters;
}

export default function ShopFinderClient({ shops, filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { location, status, requestLocation } = useUserLocation();
  const [selected, setSelected] = useState<ShopItem | null>(null);

  const navigate = (overrides: Record<string, string | null>) => {
    const base: Record<string, string> = {};
    if (filters.lat != null && filters.lng != null) {
      base.lat = String(filters.lat);
      base.lng = String(filters.lng);
    }
    if (filters.radius !== 25) base.radius = String(filters.radius);
    if (filters.category) base.category = filters.category;
    if (filters.minRating > 0) base.minRating = String(filters.minRating);
    if (filters.search) base.search = filters.search;
    if (filters.state) base.state = filters.state;
    if (filters.city) base.city = filters.city;
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "") delete base[k];
      else base[k] = v;
    }
    const qs = new URLSearchParams(base).toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // When the browser returns a location, center the search on it. router.push is
  // not local setState, so this effect is safe.
  useEffect(() => {
    if (!location) return;
    const sameLat = filters.lat != null && Math.abs(filters.lat - location.lat) < 1e-4;
    const sameLng = filters.lng != null && Math.abs(filters.lng - location.lng) < 1e-4;
    if (sameLat && sameLng) return;
    navigate({ lat: location.lat.toFixed(5), lng: location.lng.toFixed(5) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const selectedCats = new Set(filters.category.split(",").filter(Boolean));
  const toggleCategory = (value: string) => {
    const next = new Set(selectedCats);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    navigate({ category: [...next].join(",") || null });
  };

  const center = filters.lat != null && filters.lng != null ? { lat: filters.lat, lng: filters.lng } : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">Card Shop Finder</h1>
          <p className="mt-1 text-sm text-[#4a3f6b]/60">Find hobby shops near you.</p>
        </div>
        <Link
          href="/shops/submit"
          className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-[#4a3f6b] hover:bg-violet-50"
        >
          <PlusCircle className="h-4 w-4" /> Add a shop
        </Link>
      </header>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = (e.currentTarget.elements.namedItem("loc") as HTMLInputElement).value;
              navigate({ city: v || null });
            }}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3"
          >
            <Search className="h-4 w-4 shrink-0 text-[#4a3f6b]/40" />
            <input
              name="loc"
              key={filters.city}
              defaultValue={filters.city}
              placeholder="Enter a city…"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#1a0a3d] placeholder-[#4a3f6b]/30 focus:outline-none"
            />
          </form>
          <button
            onClick={requestLocation}
            className="flex h-10 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-sm font-semibold text-[#4a3f6b] hover:bg-violet-50"
          >
            <LocateFixed className="h-4 w-4" />
            {status === "loading" ? "Locating…" : "Near me"}
          </button>
          <select
            value={filters.radius}
            onChange={(e) => navigate({ radius: e.target.value === "25" ? null : e.target.value })}
            className="h-10 rounded-xl border border-violet-200 bg-white px-3 text-sm text-[#1a0a3d]"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>{r} mi</option>
            ))}
          </select>
          <label className="flex h-10 items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 text-sm text-[#1a0a3d]">
            Min rating
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={filters.minRating}
              onChange={(e) => navigate({ minRating: e.target.value === "0" ? null : e.target.value })}
            />
            <span className="w-3 font-bold">{filters.minRating || "—"}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => toggleCategory(c.value)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                selectedCats.has(c.value)
                  ? "border-[#5f2eea] bg-[#5f2eea] text-white"
                  : "border-violet-200 bg-white text-[#4a3f6b] hover:bg-violet-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split layout: list left, map right (map first on mobile) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="mb-2 text-xs font-semibold text-[#4a3f6b]/50">
            {shops.length} shop{shops.length !== 1 ? "s" : ""}
            {center ? ` within ${filters.radius} mi` : ""}
          </p>
          {shops.length === 0 ? (
            <div className="rounded-xl border border-violet-100 bg-white p-8 text-center text-sm text-[#4a3f6b]/60">
              No shops match. Try a wider radius or fewer filters.
            </div>
          ) : (
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>

        <div className="order-1 h-[320px] overflow-hidden rounded-2xl border border-violet-100 lg:order-2 lg:sticky lg:top-[100px] lg:h-[70vh]">
          <ShopMap
            shops={shops as unknown as Shop[]}
            selectedShop={selected as unknown as Shop | null}
            onShopSelect={(s) => setSelected(s as unknown as ShopItem)}
            userLocation={center}
          />
        </div>
      </div>
    </div>
  );
}
