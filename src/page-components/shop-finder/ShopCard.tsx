import Link from "next/link";
import { MapPin, Phone, Star } from "lucide-react";
import type { ShopItem } from "./types";
import { SHOP_CATEGORY_LABEL } from "./types";

export function Stars({ rating }: { rating: number | null }) {
  const value = rating ?? 0;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={rating ? `${rating.toFixed(1)} stars` : "No rating"}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          fill={i <= Math.round(value) ? "#F0C040" : "none"}
          stroke="#F0C040"
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

export default function ShopCard({ shop }: { shop: ShopItem }) {
  const category = shop.category ?? shop.specialty;
  return (
    <Link
      href={`/shops/${shop.id}`}
      className="flex gap-3 rounded-xl border border-violet-100 bg-white p-3 transition-all hover:border-[#5f2eea]/40 hover:shadow-sm"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 text-xl font-black text-[#5f2eea]">
        {shop.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-bold text-[#1a0a3d]">{shop.name}</h3>
          {shop.distanceMiles != null && (
            <span className="shrink-0 text-xs font-semibold text-[#5f2eea]">
              {shop.distanceMiles < 10 ? shop.distanceMiles.toFixed(1) : Math.round(shop.distanceMiles)} mi
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <Stars rating={shop.rating} />
          <span className="text-xs text-[#4a3f6b]/50">
            {shop.reviewCount > 0 ? `${shop.reviewCount} review${shop.reviewCount !== 1 ? "s" : ""}` : "No reviews"}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#4a3f6b]/60">
          <MapPin className="h-3 w-3 shrink-0" />
          {shop.address ? `${shop.address}, ` : ""}{shop.city}, {shop.state}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {category && (
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
              {SHOP_CATEGORY_LABEL[category] ?? category}
            </span>
          )}
          {shop.is_verified && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Verified
            </span>
          )}
          {shop.phone && (
            <span className="flex items-center gap-1 text-[10px] text-[#4a3f6b]/40">
              <Phone className="h-3 w-3" /> {shop.phone}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
