"use client";

import type { Event, Shop } from "@/types";
import EventCard from "../cards/EventCard";
import ShopCard from "../cards/ShopCard";

interface EventSidebarProps {
  events: Event[];
  savedIds: string[];
  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export function EventSidebar({
  events,
  savedIds,
  setSavedEventIds,
}: EventSidebarProps) {
  return (
    <div className="w-[352px] h-[560px] overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {events.map((event: any) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={savedIds.includes(event.id)}
            savedEventIds={savedIds}
            setSavedEventIds={setSavedEventIds}
            distanceMiles={event.distanceMiles}
          />
        ))}
      </div>
    </div>
  );
}

interface ShopSidebarProps {
  shops: Shop[];
  savedIds: string[];
  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ShopSidebar({
  shops,
  savedIds,
  setSavedShopIds,
}: ShopSidebarProps) {
  return (
    <div className="w-[352px] h-[560px] overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {shops.map((shop: any) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            isSaved={savedIds.includes(shop.id)}
            savedShopIds={savedIds}
            setSavedShopIds={setSavedShopIds}
            distanceMiles={shop.distanceMiles}
          />
        ))}
      </div>
    </div>
  );
}
