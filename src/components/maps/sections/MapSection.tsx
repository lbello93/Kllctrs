"use client";

import { useMemo, useState } from "react";
import { Calendar, Search, ShoppingBag } from "lucide-react";

import EventMap from "@/components/maps/map/EventMap";
import ShopMap from "@/components/maps/map/ShopMap";
import EventCard from "../cards/EventCard";
import ShopCard from "../cards/ShopCard";
import { EventSidebar, ShopSidebar } from "../sidebars/Sidebar";
import MapFilters from "../filters/MapFilters";
import NearMeBanner from "../filters/NearMeBanner";
import { useUserLocation } from "@/hooks/useUserLocation";
import { getDistanceMiles } from "@/lib/geo/distance";

interface MapViewProps {
  mode: "shows" | "shops";
  setMode: (mode: "shows" | "shops") => void;
  search: string;
  setSearch: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  cities: string[];
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  filteredEvents: any[];
  filteredShops: any[];
  selectedEvent: any;
  setSelectedEvent: (event: any) => void;
  selectedShop: any;
  setSelectedShop: (shop: any) => void;
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
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

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
}: any) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const {
    location: userLocation,
    status: locationStatus,
    requestLocation,
  } = useUserLocation();

  const eventsWithDistance = useMemo(() => {
    if (!userLocation) return events;

    return events.map((event: any) => {
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

  const shopsWithDistance = useMemo(() => {
    if (!userLocation) return shops;

    return shops.map((shop: any) => {
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

  const filteredEvents = eventsWithDistance
    .filter((event: any) => {
      const matchesSearch =
        search === "" ||
        event.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        city === "" || event.city?.toLowerCase() === city.toLowerCase();
      return matchesSearch && matchesCity;
    })
    .sort((a: any, b: any) =>
      a.distanceMiles == null || b.distanceMiles == null
        ? 0
        : a.distanceMiles - b.distanceMiles,
    );

  const filteredShops = shopsWithDistance
    .filter((shop: any) => {
      const matchesSearch =
        search === "" ||
        shop.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        city === "" || shop.city?.toLowerCase() === city.toLowerCase();
      const matchesCategory = category === "" || shop.specialty === category;
      return matchesSearch && matchesCity && matchesCategory;
    })
    .sort((a: any, b: any) =>
      a.distanceMiles == null || b.distanceMiles == null
        ? 0
        : a.distanceMiles - b.distanceMiles,
    );

  const cities = (
    mode === "shows"
      ? [...new Set(events.map((e: any) => e.city))]
      : [...new Set(shops.map((s: any) => s.city))]
  ).sort();

  const categories = [
    ...new Set(shops.map((shop: any) => shop.specialty).filter(Boolean)),
  ].sort();

  const sharedProps: MapViewProps = {
    mode,
    setMode,
    search,
    setSearch,
    city,
    setCity,
    cities,
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
