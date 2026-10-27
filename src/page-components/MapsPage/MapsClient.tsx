"use client";

import { useState } from "react";

import MapHero from "./sections/MapHero";
import MapSection from "./sections/MapSection";
import type { Event, Shop } from "@/types";

interface MapsClientProps {
  events: Event[];
  shops: Shop[];
  savedEventIds: string[];
  savedShopIds: string[];
}

export default function MapsClient({
  events,
  shops,
  savedEventIds,
  savedShopIds,
}: MapsClientProps) {
  const [mode, setMode] = useState<"shows" | "shops">("shows");

  // Local state for instant save/unsave updates
  const [savedShopState, setSavedShopState] = useState<string[]>(savedShopIds);

  // (Optional - for future Saved Events)
  const [savedEventState, setSavedEventState] =
    useState<string[]>(savedEventIds);

  return (
    <>
      <MapHero />

      <MapSection
        mode={mode}
        setMode={setMode}
        events={events}
        shops={shops}
        savedEventIds={savedEventState}
        setSavedEventIds={setSavedEventState}
        savedShopIds={savedShopState}
        setSavedShopIds={setSavedShopState}
      />
    </>
  );
}
