import { createHash } from "node:crypto";
import {
  createEventDedupeFingerprint,
  type EventCandidate,
} from "./ingestion-contract";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readTextList(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
  ).map((entry) => entry.trim());
}

function normalizeDate(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? value
    : null;
}

function sourceIdFromUrl(sourceUrl: string): string {
  try {
    return new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1) ?? sourceUrl;
  } catch {
    return sourceUrl;
  }
}

function sourceSnippet(text: string, claim: string): string | null {
  const index = text.toLocaleLowerCase("en-US").indexOf(claim.toLocaleLowerCase("en-US"));
  if (index < 0) return null;
  return text.slice(Math.max(0, index - 120), Math.min(text.length, index + claim.length + 120)).trim();
}

export function parseCardShowHubCandidate(
  payload: unknown,
  sourceUrl: string,
  sourceText: string,
  coordinates: Coordinates,
  observedAt = new Date().toISOString(),
): EventCandidate | null {
  if (!isRecord(payload)) return null;

  const dateStartValue = readText(payload, "date_start");
  const dateEndValue = readText(payload, "date_end");
  const stateValue = readText(payload, "state");
  const state = stateValue?.toUpperCase() ?? null;
  const event = {
    name: readText(payload, "name"),
    dateStart: normalizeDate(dateStartValue),
    dateEnd: normalizeDate(dateEndValue),
    city: readText(payload, "city"),
    state,
    venueName: readText(payload, "venue_name"),
    venueAddress: readText(payload, "venue_address"),
    venueWebsite: readText(payload, "venue_website"),
    zipCode: readText(payload, "zip_code"),
    website: readText(payload, "website"),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    description: readText(payload, "description"),
    autographGuests: readText(payload, "autograph_guests"),
    socialLinks: null,
    contactName: readText(payload, "contact_name"),
    contactEmail: readText(payload, "contact_email"),
    contactPhone: readText(payload, "contact_phone"),
    vendorTables: typeof payload.vendor_tables === "number" ? payload.vendor_tables : null,
  };

  const requiredFields: Array<[string, string | null]> = [
    ["name", event.name],
    ["date_start", event.dateStart],
    ["city", event.city],
    ["state", event.state],
  ];
  const missingRequiredFields = requiredFields
    .filter(([, value]) => !value)
    .map(([field]) => field);
  const warnings: string[] = [];

  if (dateStartValue && !event.dateStart) warnings.push("Start date is not a valid YYYY-MM-DD date.");
  if (dateEndValue && !event.dateEnd) warnings.push("End date is not a valid YYYY-MM-DD date.");
  if (event.state && !/^[A-Z]{2}$/.test(event.state)) warnings.push("State is not a two-letter code.");
  if (!event.venueName || !event.venueAddress) warnings.push("Venue details are incomplete.");
  if (event.dateStart && event.dateEnd && event.dateEnd < event.dateStart) {
    warnings.push("End date is before start date.");
  }

  const categories = readTextList(payload, "categories");
  const sponsorClaims = readTextList(payload, "sponsor_brands").map((name) => ({
    name,
    sourceUrl,
    observedAt,
    sourceSnippet: sourceSnippet(sourceText, name),
    verificationStatus: "unverified" as const,
  }));
  const source = {
    provider: "cardshowhub" as const,
    sourceId: sourceIdFromUrl(sourceUrl),
    sourceUrl,
    observedAt,
    contentHash: createHash("sha256").update(sourceText).digest("hex"),
  };

  return {
    source,
    dedupeFingerprint: createEventDedupeFingerprint(event),
    event,
    categories,
    sponsorClaims,
    quality: {
      missingRequiredFields,
      warnings,
      readyForReview: missingRequiredFields.length === 0,
    },
    reviewStatus: "pending_review",
  };
}

