"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { Shop } from "@/types";

interface Props {
  shops: Shop[];
  selectedShop: Shop | null;
  onShopSelect: (shop: Shop) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

const specialtyColor: Record<string, { bg: string; border: string }> = {
  sports: { bg: "#6366f1", border: "#4f46e5" },
  pokemon: { bg: "#ef4444", border: "#dc2626" },
  both: { bg: "#f59e0b", border: "#d97706" },
};

export default function ShopMap({
  shops,
  selectedShop,
  onShopSelect,
  userLocation,
}: Props) {
  const [infoShop, setInfoShop] = useState<Shop | null>(null);
  const shopsWithCoords = shops.filter((s) => s.lat && s.lng);

  const center = userLocation ?? { lat: 39.5, lng: -98.35 };
  const zoom = userLocation ? 9 : 4;

  return (
    <APIProvider apiKey={MAPS_KEY}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="kllctbls-shops"
        style={{ width: "100%", height: "100%" }}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#2563eb] shadow-md">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </AdvancedMarker>
        )}

        {shopsWithCoords.map((shop) => {
          const color =
            specialtyColor[shop.specialty ?? "both"] ?? specialtyColor.both;
          return (
            <AdvancedMarker
              key={shop.id}
              position={{ lat: shop.lat!, lng: shop.lng! }}
              onClick={() => {
                onShopSelect(shop);
                setInfoShop(shop);
              }}
            >
              <Pin
                background={selectedShop?.id === shop.id ? "#fbbf24" : color.bg}
                borderColor={
                  selectedShop?.id === shop.id ? "#d97706" : color.border
                }
                glyphColor="#fff"
              />
            </AdvancedMarker>
          );
        })}

        {infoShop && infoShop.lat && infoShop.lng && (
          <InfoWindow
            position={{ lat: infoShop.lat, lng: infoShop.lng }}
            onCloseClick={() => setInfoShop(null)}
          >
            <div className="p-1 max-w-[220px]">
              <p className="font-medium text-sm mb-1">{infoShop.name}</p>
              <p className="text-xs text-gray-600 mb-1">
                {infoShop.city}, {infoShop.state}
              </p>
              {infoShop.address && (
                <p className="text-xs text-gray-500 mb-1">{infoShop.address}</p>
              )}
              {infoShop.phone && (
                <a
                  href={`tel:${infoShop.phone}`}
                  className="text-xs text-indigo-600 hover:underline block"
                >
                  {infoShop.phone}
                </a>
              )}
              <a
                href={`/shops/${infoShop.slug}`}
                className="text-xs text-indigo-600 mt-2 inline-block hover:underline font-medium"
              >
                View details →
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
