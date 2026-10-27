"use client";

import type { Shop } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Globe } from "lucide-react";
import SaveButton from "@/components/auth/SaveButton";

interface Props {
  shops: Shop[];
  selectedShop: Shop | null;
  onShopSelect: (shop: Shop) => void;
  savedIds: string[];
}

const specialtyLabel: Record<string, string> = {
  sports: "Sports",
  pokemon: "Pokémon",
  both: "Sports & Pokémon",
};

export default function ShopList({
  shops,
  selectedShop,
  onShopSelect,
  savedIds,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shops.map((shop, i) => (
        <motion.div
          key={shop.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <div
            className={`relative rounded-2xl border p-5 transition-all duration-200 ${
              selectedShop?.id === shop.id
                ? "border-[#5f2eea]/40 bg-[#5f2eea]/5 shadow-xl shadow-violet-300/30"
                : "border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 hover:border-[#5f2eea]/30 hover:shadow-xl hover:shadow-violet-300/30"
            }`}
          >
            <Link
              href={`/maps/shops/${shop.slug}`}
              onClick={() => onShopSelect(shop)}
              className="block"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2.5 pr-10">
                <span className="inline-flex items-center text-xs font-medium bg-violet-50 text-[#5f2eea] border border-violet-200 px-2 py-0.5 rounded-full">
                  {shop.state}
                </span>
                {shop.specialty && (
                  <span className="inline-flex items-center text-xs font-medium bg-[#f4f3fb] text-[#4a3f6b]/60 border border-violet-100 px-2 py-0.5 rounded-full">
                    {specialtyLabel[shop.specialty] ?? shop.specialty}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-[#1a0a3d] mb-1 line-clamp-2">
                {shop.name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-[#4a3f6b]/50">
                <MapPin className="w-3 h-3" />
                {shop.city}, {shop.state}
              </div>

              {shop.address && (
                <p className="text-xs text-[#4a3f6b]/35 mt-1 line-clamp-1">
                  {shop.address}
                </p>
              )}

              {shop.website && (
                <div className="mt-2.5 inline-flex items-center gap-1 text-xs text-[#5f2eea] font-medium">
                  <Globe className="w-3 h-3" /> Website
                </div>
              )}
            </Link>

            <div className="absolute top-4 right-4">
              <SaveButton
                eventId={shop.id}
                initialSaved={savedIds.includes(shop.id)}
                type="shop"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
