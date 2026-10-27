"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar, Search, ShoppingBag } from "lucide-react";

import EventMap from "@/page-components/MapsPage/map/EventMap";
import ShopMap from "@/page-components/MapsPage/map/ShopMap";
import EventCard from "../cards/EventCard";
import ShopCard from "../cards/ShopCard";
import { EventSidebar, ShopSidebar } from "../sidebars/Sidebar";
import MapFilters from "../filters/MapFilters";
import NearMeBanner from "../filters/NearMeBanner";
import { useUserLocation } from "@/hooks/useUserLocation";
import { getDistanceMiles } from "@/lib/geo/distance";
import type { Event, Shop } from "@/types";

type EventWithDistance = Event & { distanceMiles?: number };
type ShopWithDistance = Shop & { distanceMiles?: number };

interface MapSectionProps {
  mode: "shows" | "shops";
  setMode: (mode: "shows" | "shops") => void;
  events: Event[];
  shops: Shop[];
  savedEventIds: string[];
  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
  savedShopIds: string[];
  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;
}

interface MapViewProps {
  mode: "shows" | "shops";
  setMode: (mode: "shows" | "shops") => void;
  search: string;
  setSearch: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  cities: string[];
  month: string;
  setMonth: (value: string) => void;
  months: Array<{ value: string; label: string }>;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  filteredEvents: EventWithDistance[];
  filteredShops: ShopWithDistance[];
  selectedEvent: EventWithDistance | null;
  setSelectedEvent: (event: EventWithDistance | null) => void;
  selectedShop: ShopWithDistance | null;
  setSelectedShop: (shop: ShopWithDistance | null) => void;
  savedEventIds: string[];
  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
  savedShopIds: string[];
  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;
  userLocation: { lat: number; lng: number } | null;
  locationStatus: ReturnType<typeof useUserLocation>["status"];
  requestLocation: () => void;
}

function DesktopMapView(props: MapViewProps) {
  const {
    mode,
    setMode,
    search,
    setSearch,
    city,
    setCity,
    cities,
    month,
    setMonth,
    months,
    category,
    setCategory,
    categories,
    filteredEvents,
    filteredShops,
    selectedEvent,
    setSelectedEvent,
    selectedShop,
    setSelectedShop,
    savedEventIds,
    savedShopIds,
    setSavedShopIds,
    setSavedEventIds,
    userLocation,
    locationStatus,
    requestLocation,
  } = props;

  return (
    <section className="max-w-[1200px] mx-auto py-8">
      <NearMeBanner status={locationStatus} onRequest={requestLocation} />

      <MapFilters
        mode={mode}
        setMode={setMode}
        search={search}
        setSearch={setSearch}
        city={city}
        setCity={setCity}
        cities={cities}
        month={month}
        setMonth={setMonth}
        months={months}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      {mode === "shows" && <p className="mt-3 text-center text-sm text-[#4a3f6b]/60" aria-live="polite">Showing <strong className="text-[#151E3C]">{filteredEvents.length}</strong> approved shows{month ? ` in ${months.find((item) => item.value === month)?.label ?? month}` : " across all dates"}. Use the map and list to explore current directory listings.</p>}

      <div className="flex gap-6 mt-6">
        <div className="flex-1 h-[560px] rounded-[10px] overflow-hidden">
          {mode === "shows" ? (
            <EventMap
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              userLocation={userLocation}
            />
          ) : (
            <ShopMap
              shops={filteredShops}
              selectedShop={selectedShop}
              onShopSelect={setSelectedShop}
              userLocation={userLocation}
            />
          )}
        </div>

        {mode === "shows" ? (
          <EventSidebar
            events={filteredEvents}
            savedIds={savedEventIds}
            setSavedEventIds={setSavedEventIds}
          />
        ) : (
          <ShopSidebar
            shops={filteredShops}
            savedIds={savedShopIds}
            setSavedShopIds={setSavedShopIds}
          />
        )}
      </div>
    </section>
  );
}

function MobileMapView(props: MapViewProps) {
  const {
    mode,
    setMode,
    search,
    setSearch,
    city,
    setCity,
    cities,
    month,
    setMonth,
    months,
    category,
    setCategory,
    categories,
    filteredEvents,
    filteredShops,
    selectedEvent,
    setSelectedEvent,
    selectedShop,
    setSelectedShop,
    savedEventIds,
    savedShopIds,
    setSavedShopIds,
    setSavedEventIds,
    userLocation,
    locationStatus,
    requestLocation,
  } = props;

  return (
    <section className="pb-8">
      <div className="mx-4 mt-6">
        <NearMeBanner status={locationStatus} onRequest={requestLocation} />
      </div>

      {/* FILTER CARD */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-lg">
        <div className="flex h-10 overflow-hidden rounded-full border border-[#8B5CF6]">
          <button
            onClick={() => setMode("shows")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-medium transition-all ${mode === "shows" ? "bg-[#8B5CF6] text-white" : "bg-white text-gray-700"}`}
          >
            <Calendar size={16} />
            Shows
          </button>

          <button
            onClick={() => setMode("shops")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-medium transition-all ${mode === "shops" ? "bg-[#8B5CF6] text-white" : "bg-white text-gray-700"}`}
          >
            <ShoppingBag size={16} />
            Shops
          </button>
        </div>

        <div className="relative mt-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              mode === "shows" ? "Search shows..." : "Search shops..."
            }
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition-all focus:border-[#8B5CF6] focus:ring-2 focus:ring-violet-200"
          />
        </div>

        <div
          className={`mt-3 grid gap-3 ${mode === "shops" ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {mode === "shops" && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          )}

          {mode === "shows" && <select aria-label="Event month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm">
            <option value="">All dates</option>
            {months.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>}

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"
          >
            <option value="">All Cities</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mode === "shows" && <p className="mx-5 mt-3 text-xs text-[#4a3f6b]/60" aria-live="polite">Showing <strong className="text-[#151E3C]">{filteredEvents.length}</strong> approved shows{month ? ` in ${months.find((item) => item.value === month)?.label ?? month}` : " across all dates"}.</p>}

      {/* MAP */}
      <div className="mt-5 px-4">
        <div className="h-[350px] overflow-hidden rounded-2xl shadow-md">
          {mode === "shows" ? (
            <EventMap
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              userLocation={userLocation}
            />
          ) : (
            <ShopMap
              shops={filteredShops}
              selectedShop={selectedShop}
              onShopSelect={setSelectedShop}
              userLocation={userLocation}
            />
          )}
        </div>
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="mt-5 overflow-x-auto">
        <div className="flex gap-3 px-4 pb-2">
          {mode === "shows" && filteredEvents.length === 0 && (
            <p className="w-full rounded-xl border border-dashed border-violet-200 bg-white p-5 text-sm leading-relaxed text-[#4a3f6b]/70">
              No approved shows match these filters. Try another month or clear your search and city filters.
            </p>
          )}
          {mode === "shows"
            ? filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="min-w-[85vw] max-w-[85vw] flex-shrink-0 cursor-pointer"
                >
                  <EventCard
                    event={event}
                    isSaved={savedEventIds.includes(event.id)}
                    savedEventIds={savedEventIds}
                    setSavedEventIds={setSavedEventIds}
                    distanceMiles={event.distanceMiles}
                  />
                </div>
              ))
            : filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="min-w-[85vw] max-w-[85vw] flex-shrink-0 cursor-pointer"
                >
                  <ShopCard
                    shop={shop}
                    isSaved={savedShopIds.includes(shop.id)}
                    savedShopIds={savedShopIds}
                    setSavedShopIds={setSavedShopIds}
                    distanceMiles={shop.distanceMiles}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default function MapSection({
  mode,
  setMode,
  events,
  shops,
  savedEventIds,
  setSavedEventIds,
  savedShopIds,
  setSavedShopIds,
}: MapSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventWithDistance | null>(null);
  const [selectedShop, setSelectedShop] = useState<ShopWithDistance | null>(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [eventMonth, setEventMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, offset) => {
      const year = now.getFullYear();
      const monthIndex = now.getMonth() + offset;
      const yearForMonth = year + Math.floor(monthIndex / 12);
      const monthForYear = monthIndex % 12;
      const value = `${yearForMonth}-${String(monthForYear + 1).padStart(2, "0")}`;
      const label = format(new Date(Date.UTC(yearForMonth, monthForYear, 15)), "MMMM yyyy");
      return { value, label };
    });
  }, []);

  const {
    location: userLocation,
    status: locationStatus,
    requestLocation,
  } = useUserLocation();

  const eventsWithDistance = useMemo<EventWithDistance[]>(() => {
    if (!userLocation) return events;

    return events.map((event) => {
      const lat = Number(event.lat);
      const lng = Number(event.lng);
      if (isNaN(lat) || isNaN(lng)) return event;

      return {
        ...event,
        distanceMiles: getDistanceMiles(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng,
        ),
      };
    });
  }, [events, userLocation]);

  const shopsWithDistance = useMemo<ShopWithDistance[]>(() => {
    if (!userLocation) return shops;

    return shops.map((shop) => {
      const lat = Number(shop.lat);
      const lng = Number(shop.lng);
      if (isNaN(lat) || isNaN(lng)) return shop;

      return {
        ...shop,
        distanceMiles: getDistanceMiles(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng,
        ),
      };
    });
  }, [shops, userLocation]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const filteredEvents = eventsWithDistance
    .filter((event) => {
      const eventEnd = event.date_end || event.date_start;
      const [year, month] = eventMonth ? eventMonth.split("-").map(Number) : [];
      const monthStart = eventMonth ? `${eventMonth}-01` : "";
      const monthEnd = eventMonth
        ? `${eventMonth}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`
        : "";
      const matchesMonth = !eventMonth || (eventEnd >= monthStart && event.date_start <= monthEnd);
      const matchesSearch =
        search === "" ||
        event.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        city === "" || event.city?.toLowerCase() === city.toLowerCase();
      return matchesMonth && matchesSearch && matchesCity;
    })
    .sort((a, b) => {
      const aStart = a.date_start.slice(0, 10);
      const bStart = b.date_start.slice(0, 10);
      const aEnd = (a.date_end || a.date_start).slice(0, 10);
      const bEnd = (b.date_end || b.date_start).slice(0, 10);
      const aIsUpcoming = aEnd >= todayKey;
      const bIsUpcoming = bEnd >= todayKey;

      if (aIsUpcoming !== bIsUpcoming) return aIsUpcoming ? -1 : 1;
      return aIsUpcoming
        ? aStart.localeCompare(bStart)
        : bStart.localeCompare(aStart);
    });

  const filteredShops = shopsWithDistance
    .filter((shop) => {
      const matchesSearch =
        search === "" ||
        shop.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        city === "" || shop.city?.toLowerCase() === city.toLowerCase();
      const matchesCategory = category === "" || shop.specialty === category;
      return matchesSearch && matchesCity && matchesCategory;
    })
    .sort((a, b) =>
      a.distanceMiles == null || b.distanceMiles == null
        ? 0
        : a.distanceMiles - b.distanceMiles,
    );

  const cities: string[] = (
    mode === "shows"
      ? [...new Set<string>(events.map((event) => event.city))]
      : [...new Set<string>(shops.map((shop) => shop.city))]
  ).sort();

  const categories: string[] = [
    ...new Set<string>(
      shops
        .map((shop) => shop.specialty)
        .filter((specialty: unknown): specialty is string => typeof specialty === "string" && specialty.length > 0),
    ),
  ].sort();

  const sharedProps: MapViewProps = {
    mode,
    setMode,
    search,
    setSearch,
    city,
    setCity,
    cities,
    month: eventMonth,
    setMonth: setEventMonth,
    months,
    category,
    setCategory,
    categories,
    filteredEvents,
    filteredShops,
    selectedEvent,
    setSelectedEvent,
    selectedShop,
    setSelectedShop,
    savedEventIds,
    setSavedEventIds,
    savedShopIds,
    setSavedShopIds,
    userLocation,
    locationStatus,
    requestLocation,
  };

  return (
    <>
      <div className="lg:hidden">
        <MobileMapView {...sharedProps} />
      </div>

      <div className="hidden lg:block">
        <DesktopMapView {...sharedProps} />
      </div>
    </>
  );
}
