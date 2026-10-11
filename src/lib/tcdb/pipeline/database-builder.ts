import type { ParsedCalendarEvent } from "../types";
import type { ParsedEventDetail } from "../parser/detail-parser";
import type { DatabaseEvent } from "../models/database-event";
import { createEventSlug } from "@/lib/events/ingestion-contract";

function detectSocialLinks(website?: string) {
  return {
    website:
      website &&
      !website.includes("facebook.com") &&
      !website.includes("instagram.com")
        ? website
        : undefined,

    facebook:
      website?.includes("facebook.com")
        ? website
        : undefined,

    instagram:
      website?.includes("instagram.com")
        ? website
        : undefined,
  };
}

export function buildDatabaseEvent(
  calendar: ParsedCalendarEvent,
  detail: ParsedEventDetail
): DatabaseEvent {

  const social = detectSocialLinks(detail.website);

  return {

    //--------------------------------------------------
    // Source
    //--------------------------------------------------

    source_provider: "tcdb",

    source_event_id: calendar.eventId,

    source_url: calendar.eventUrl,

    //--------------------------------------------------
    // Event
    //--------------------------------------------------

    name: detail.title || calendar.title,

    slug: createEventSlug({
      name: detail.title || calendar.title,
      dateStart: calendar.startDate,
      city: detail.city || calendar.city,
      state: detail.state || calendar.state,
      venueName: detail.venueName,
      venueAddress: detail.streetAddress,
    }),

    description: detail.description,

    //--------------------------------------------------
    // Dates
    //--------------------------------------------------

    date_start: calendar.startDate,

    date_end: calendar.endDate,

    //--------------------------------------------------
    // Time
    //--------------------------------------------------

    time_start: calendar.startTime,

    time_end: calendar.endTime,

    timezone: undefined,

    //--------------------------------------------------
    // Venue
    //--------------------------------------------------

    venue_name: detail.venueName,

    venue_address: detail.streetAddress,

    city: detail.city || calendar.city,

    state: detail.state || calendar.state,

    zip_code: detail.zipCode,

    country: detail.country,

    //--------------------------------------------------
    // Coordinates
    //--------------------------------------------------

    lat: undefined,

    lng: undefined,

    //--------------------------------------------------
    // Links
    //--------------------------------------------------

    website: social.website,

    facebook: social.facebook,

    instagram: social.instagram,

    //--------------------------------------------------
    // Organizer
    //--------------------------------------------------

    organizer_name: undefined,

    organizer_email: undefined,

    organizer_phone: undefined,

    //--------------------------------------------------
    // Event Info
    //--------------------------------------------------

    admission: undefined,

    tables: undefined,

    notes: detail.description,

    //--------------------------------------------------
    // Metadata
    //--------------------------------------------------

    imported_at: new Date().toISOString(),

    updated_at: new Date().toISOString(),

    last_verified_at: undefined,

    //--------------------------------------------------
    // Status
    //--------------------------------------------------

    active: true,

    published: false,

  };

}

export function buildDatabaseEvents(
  calendarEvents: ParsedCalendarEvent[],
  detailEvents: ParsedEventDetail[]
): DatabaseEvent[] {

  const detailMap = new Map(
    detailEvents.map(detail => [detail.eventId, detail])
  );

  const events: DatabaseEvent[] = [];

  for (const calendar of calendarEvents) {

    const detail = detailMap.get(calendar.eventId);

    if (!detail) {
      continue;
    }

    events.push(
      buildDatabaseEvent(calendar, detail)
    );

  }

  return events;

}
