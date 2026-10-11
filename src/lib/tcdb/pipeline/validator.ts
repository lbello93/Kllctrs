import type { DatabaseEvent } from "../models/database-event";

export interface ValidationResult {
  valid: boolean;

  errors: string[];

  warnings: string[];

  info: string[];
}

function isValidUrl(url?: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidZip(zip?: string): boolean {
  if (!zip) return false;

  return /^\d{5}(-\d{4})?$/.test(zip);
}

function isValidCoordinate(value?: number): boolean {
  return typeof value === "number" && !Number.isNaN(value);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateEvent(
  event: DatabaseEvent
): ValidationResult {

  const errors: string[] = [];

  const warnings: string[] = [];

  const info: string[] = [];

  //----------------------------------
  // Required Fields
  //----------------------------------

  if (!event.name.trim()) {
    errors.push("Missing event title.");
  }

  if (!event.slug.trim()) {
    errors.push("Missing slug.");
  }

  if (!event.date_start) {
    errors.push("Missing start date.");
  }

  if (!event.date_end) {
    errors.push("Missing end date.");
  }

  if (!event.city.trim()) {
    errors.push("Missing city.");
  }

  if (!event.state.trim()) {
    errors.push("Missing state.");
  }

  if (!isValidDate(event.date_start)) {
    errors.push("Invalid start date.");
  }
  if (!isValidDate(event.date_end)) errors.push("Invalid end date.");
  if (isValidDate(event.date_start) && isValidDate(event.date_end) && event.date_end < event.date_start) {
    errors.push("End date is before start date.");
  }

  if (!event.venue_name.trim()) warnings.push("Venue name needs review.");
  if (!event.venue_address.trim()) warnings.push("Venue address needs review.");
  if (!event.source_event_id.trim()) warnings.push("Source record ID is unavailable.");
  if (!event.source_url.trim()) warnings.push("Source URL is unavailable.");
  if (!/^[A-Z]{2}$/.test(event.state)) warnings.push("State code needs review.");

  //----------------------------------
  // ZIP Code
  //----------------------------------

  if (event.zip_code && !isValidZip(event.zip_code)) {
    warnings.push("ZIP code format looks invalid.");
  }

  //----------------------------------
  // Coordinates
  //----------------------------------

  const hasLat = isValidCoordinate(event.lat);
const hasLng = isValidCoordinate(event.lng);

if (!hasLat || !hasLng) {
    warnings.push(
        "Coordinates unavailable. Event may not appear on the map until geocoding succeeds."
    );
}

  //----------------------------------
  // Website
  //----------------------------------

  if (event.website && !isValidUrl(event.website)) {
    warnings.push("Website URL appears invalid.");
  }

  if (event.facebook && !isValidUrl(event.facebook)) {
    warnings.push("Facebook URL appears invalid.");
  }

  if (event.instagram && !isValidUrl(event.instagram)) {
    warnings.push("Instagram URL appears invalid.");
  }

  //----------------------------------
  // Description
  //----------------------------------

  if (!event.description) {
    info.push("Description not available.");
  }

  //----------------------------------
  // Organizer
  //----------------------------------

  if (!event.organizer_name) {
    info.push("Organizer not available.");
  }

  if (!event.organizer_email) {
    info.push("Organizer email not available.");
  }

  if (!event.organizer_phone) {
    info.push("Organizer phone not available.");
  }

  //----------------------------------
  // Notes
  //----------------------------------

  if (!event.notes) {
    info.push("Event notes not available.");
  }

  //----------------------------------
  // Links
  //----------------------------------

  if (!event.website && !event.facebook) {
    info.push("No external website available.");
  }

  //----------------------------------

  return {

    valid: errors.length === 0,

    errors,

    warnings,

    info,

  };

}
