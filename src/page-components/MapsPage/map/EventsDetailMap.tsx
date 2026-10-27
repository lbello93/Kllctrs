"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

interface Props {
  lat: number;
  lng: number;
  name: string;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

export default function EventDetailMap({ lat, lng, name }: Props) {
  return (
    <APIProvider apiKey={MAPS_KEY}>
      <Map
        defaultCenter={{ lat, lng }}
        defaultZoom={14}
        mapId="kllctbls-event-detail"
        style={{ width: "100%", height: "100%" }}
        gestureHandling="cooperative"
        disableDefaultUI={false}
      >
        <AdvancedMarker position={{ lat, lng }} title={name}>
          <Pin background="#6366f1" borderColor="#4f46e5" glyphColor="#fff" />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
}
