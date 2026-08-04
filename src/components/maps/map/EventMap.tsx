"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { Event } from "@/types";
import { format } from "date-fns";

interface Props {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

export default function EventMap({
  events,
  selectedEvent,
  onEventSelect,
}: Props) {
  const [infoEvent, setInfoEvent] = useState<Event | null>(null);

  const eventsWithCoords = events
    .filter((e) => e.lat != null && e.lng != null)
    .map((e) => ({ ...e, lat: Number(e.lat), lng: Number(e.lng) }))
    .filter((e) => !isNaN(e.lat) && !isNaN(e.lng));
  return (
    <APIProvider apiKey={MAPS_KEY}>
      <Map
        defaultCenter={{ lat: 37.5, lng: -96 }}
        defaultZoom={5}
        mapId="kllctbls-events"
        style={{ width: "100%", height: "100%" }}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {eventsWithCoords.map((event) => (
          <AdvancedMarker
            key={event.id}
            position={{ lat: event.lat!, lng: event.lng! }}
            onClick={() => {
              onEventSelect(event);
              setInfoEvent(event);
            }}
          >
            <Pin
              background={
                selectedEvent?.id === event.id ? "#f59e0b" : "#6366f1"
              }
              borderColor={
                selectedEvent?.id === event.id ? "#d97706" : "#4f46e5"
              }
              glyphColor="#fff"
            />
          </AdvancedMarker>
        ))}

        {infoEvent && infoEvent.lat && infoEvent.lng && (
          <InfoWindow
            position={{
              lat: Number(infoEvent.lat),
              lng: Number(infoEvent.lng),
            }}
            onCloseClick={() => setInfoEvent(null)}
          >
            <div className="p-1 max-w-[220px]">
              <p className="font-medium text-sm mb-1">{infoEvent.name}</p>
              <p className="text-xs text-gray-600 mb-1">
                {format(new Date(infoEvent.date_start), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-gray-600">
                {infoEvent.venue_name && `${infoEvent.venue_name}, `}
                {infoEvent.city}, {infoEvent.state}
              </p>
              {infoEvent.vendor_tables && (
                <p className="text-xs text-gray-500 mt-1">
                  {infoEvent.vendor_tables} vendor tables
                </p>
              )}
              {infoEvent.website && (
                <a
                  href={infoEvent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 mt-2 inline-block hover:underline"
                >
                  Official site →
                </a>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
