import { createHash } from "node:crypto";
import {
  createEventDedupeFingerprint,
  type EventCandidate,
} from "./ingestion-contract";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(input: Record<string, unknown>, key: string): string | null {
  const value = input[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function validDate(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : value;
}

export function createOrganizerSubmissionCandidate(
  input: unknown,
  submitterId: string,
): EventCandidate | null {
  if (!isRecord(input)) return null;
  const observedAt = new Date().toISOString();
  const sourceUrlValue = readString(input, "source_url") ?? readString(input, "website");
  const submittedEndDate = readString(input, "date_end");
  const event = {
    name: readString(input, "name"),
    dateStart: validDate(readString(input, "date_start")),
    dateEnd: validDate(submittedEndDate),
    city: readString(input, "city"),
    state: readString(input, "state")?.toUpperCase() ?? null,
    venueName: readString(input, "venue_name"),
    venueAddress: readString(input, "venue_address"),
    venueWebsite: readString(input, "venue_website"),
    zipCode: readString(input, "zip_code"),
    website: readString(input, "website"),
    latitude: null,
    longitude: null,
    description: readString(input, "description"),
    autographGuests: readString(input, "autograph_guests"),
    socialLinks: isRecord(input.social_links)
      ? Object.fromEntries(Object.entries(input.social_links).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
      : null,
    contactName: readString(input, "contact_name"),
    contactEmail: readString(input, "contact_email"),
    contactPhone: readString(input, "contact_phone"),
    vendorTables: typeof input.vendor_tables === "number" ? input.vendor_tables : null,
  };
  const contentHash = createHash("sha256").update(JSON.stringify({
    ...event,
    sourceUrl: sourceUrlValue,
  })).digest("hex");
  const requiredFields: Array<[string, string | null]> = [
    ["name", event.name],
    ["date_start", event.dateStart],
    ["city", event.city],
    ["state", event.state],
  ];
  const missingRequiredFields = requiredFields.filter(([, value]) => !value).map(([field]) => field);
  const warnings: string[] = [];
  if (submittedEndDate && !event.dateEnd) warnings.push("End date is invalid and was omitted.");
  if (!sourceUrlValue) warnings.push("No source URL was supplied.");
  if (!event.venueName || !event.venueAddress) warnings.push("Venue details need review.");
  if (event.state && !/^[A-Z]{2}$/.test(event.state)) warnings.push("State code needs review.");

  return {
    source: {
      provider: "organizer_submission",
      sourceId: `${submitterId}:${contentHash}`,
      sourceUrl: sourceUrlValue,
      observedAt,
      contentHash,
    },
    dedupeFingerprint: createEventDedupeFingerprint(event),
    event,
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
