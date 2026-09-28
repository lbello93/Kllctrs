"use client";

import { useState } from "react";
import { Store } from "lucide-react";
import ShopCard from "@/components/maps/cards/ShopCard";
import { EmptyPanel, SectionHeader } from "../shared/SectionShell";
import type { Shop } from "@/types";

interface Props {
  shops?: Shop[];
}

export default function SavedShops({ shops = [] }: Props) {
  const safeShops = Array.isArray(shops) ? shops : [];

  const [savedShopIds, setSavedShopIds] = useState<string[]>(
    safeShops.map((shop) => shop.id),
  );

  const visibleShops = safeShops.filter((shop) =>
    savedShopIds.includes(shop.id),
  );

  return (
    <section>
      <SectionHeader
        title="Saved shops"
        subtitle="Your favorite local card stores and collectibles destinations."
        count={visibleShops.length}
      />

      {visibleShops.length === 0 ? (
        <EmptyPanel
          icon={<Store className="h-6 w-6" />}
          title="No saved shops yet"
          text="Save a shop and it will show up here so you can find it fast."
          ctaLabel="Browse shops"
          ctaHref="/maps"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              isSaved={savedShopIds.includes(shop.id)}
              savedShopIds={savedShopIds}
              setSavedShopIds={setSavedShopIds}
            />
          ))}
        </div>
      )}
    </section>
  );
}
