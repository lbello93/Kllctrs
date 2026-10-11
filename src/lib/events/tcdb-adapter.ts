import { createHash } from "node:crypto";
import type { DatabaseEvent } from "@/lib/tcdb/models/database-event";
import {
  createEventDedupeFingerprint,
  type EventCandidate,
} from "./ingestion-contract";

/** Converts the existing TCDB domain record into the shared, reviewable contract. */
export function databaseEventToCandidate(event: DatabaseEvent): EventCandidate {
  const observedAt = event.imported_at || new Date().toISOString();
  const normalizedEvent = {
    name: event.name || null,
    dateStart: event.date_start || null,
    dateEnd: event.date_end || null,
    city: event.city || null,
    state: event.state?.toUpperCase() || null,
    venueName: event.venue_name || null,
    venueAddress: event.venue_address || null,
    venueWebsite: null,
    zipCode: event.zip_code || null,
    website: event.website || null,
    latitude: event.lat ?? null,
    longitude: event.lng ?? null,
    description: event.description || null,
    autographGuests: null,
    socialLinks: {
      ...(event.facebook ? { facebook: event.facebook } : {}),
      ...(event.instagram ? { instagram: event.instagram } : {}),
    },
    contactName: event.organizer_name || null,
    contactEmail: event.organizer_email || null,
    contactPhone: event.organizer_phone || null,
    vendorTables: event.tables ?? null,
  };
  const requiredFields: Array<[string, string | null]> = [
    ["name", normalizedEvent.name],
    ["date_start", normalizedEvent.dateStart],
    ["city", normalizedEvent.city],
    ["state", normalizedEvent.state],
  ];
  const missingRequiredFields = requiredFields
    .filter(([, value]) => !value)
    .map(([field]) => field);
  const sourceUrl = event.source_url;
  const sourceSnapshot = {
    name: event.name,
    date_start: event.date_start,
    date_end: event.date_end,
    city: event.city,
    state: event.state,
    venue_name: event.venue_name,
    venue_address: event.venue_address,
    venue_website: null,
    zip_code: event.zip_code,
    website: event.website,
    description: event.description,
    autograph_guests: null,
    social_links: {
      ...(event.facebook ? { facebook: event.facebook } : {}),
      ...(event.instagram ? { instagram: event.instagram } : {}),
    },
    contact_name: event.organizer_name,
    contact_email: event.organizer_email,
    contact_phone: event.organizer_phone,
    vendor_tables: event.tables,
  };
  const warnings = [];
  if (!normalizedEvent.venueName) warnings.push("Venue name is missing from the source and needs review.");
  if (!normalizedEvent.venueAddress) warnings.push("Venue address is missing from the source and needs review.");
  if (normalizedEvent.latitude === null || normalizedEvent.longitude === null) {
    warnings.push("Coordinates are unavailable and need review or geocoding.");
  }
  if (event.source_provider === "sportscollectorsdigest") {
    warnings.push("The calendar listing omits the year; the current parser infers it from ingestion date.");
  }

  return {
    source: {
      provider: event.source_provider,
      sourceId: event.source_event_id,
      sourceUrl,
      observedAt,
      contentHash: createHash("sha256").update(JSON.stringify(sourceSnapshot)).digest("hex"),
    },
    dedupeFingerprint: createEventDedupeFingerprint(normalizedEvent),
    event: normalizedEvent,
    categories: [],
    sponsorClaims: [],
    quality: {
      missingRequiredFields,
      warnings,
      readyForReview: missingRequiredFields.length === 0,
    },
    reviewStatus: "pending_review",
  };
}
