import { createHash } from "node:crypto";

export const EVENT_PROVIDERS = [
  "cardshowhub",
  "tcdb",
  "sportscollectorsdigest",
  "organizer_submission",
] as const;

export type EventProvider = (typeof EVENT_PROVIDERS)[number];

export interface EventSourceEvidence {
  provider: EventProvider;
  sourceId: string;
  sourceUrl: string | null;
  observedAt: string;
  contentHash: string;
}

export interface SponsorClaim {
  name: string;
  sourceUrl: string;
  observedAt: string;
  sourceSnippet: string | null;
  verificationStatus: "unverified";
}

export interface EventCandidate {
  source: EventSourceEvidence;
  dedupeFingerprint: string;
  event: {
    name: string | null;
    dateStart: string | null;
    dateEnd: string | null;
    city: string | null;
    state: string | null;
    venueName: string | null;
    venueAddress: string | null;
    venueWebsite: string | null;
    zipCode: string | null;
    website: string | null;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    autographGuests: string | null;
    socialLinks: Record<string, string> | null;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    vendorTables: number | null;
  };
  categories: string[];
  sponsorClaims: SponsorClaim[];
  quality: {
    missingRequiredFields: string[];
    warnings: string[];
    readyForReview: boolean;
  };
  reviewStatus: "pending_review";
}

export interface PersistedEventIdentity {
  name: string | null;
  dateStart: string | null;
  city: string | null;
  state: string | null;
  venueName: string | null;
  venueAddress?: string | null;
}

export type EventIdentityMatch = "same_source" | "exact" | "needs_review" | "none";

export function normalizeIdentityPart(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function createEventSlug(event: PersistedEventIdentity): string {
  return [event.name, event.city, event.state, event.dateStart]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Stable across providers so one event can be deduplicated across sources. */
export function createEventDedupeFingerprint(
  event: PersistedEventIdentity,
): string {
  const identity = [
    normalizeIdentityPart(event.name),
    event.dateStart ?? "",
    normalizeIdentityPart(event.city),
    normalizeIdentityPart(event.state),
    normalizeIdentityPart(event.venueName),
    normalizeIdentityPart(event.venueAddress),
  ];

  return createHash("sha256").update(JSON.stringify(identity)).digest("hex");
}

/** Broadly matching name/date/location records are held for review even when venue details differ. */
export function classifyEventIdentityMatch(
  left: PersistedEventIdentity,
  right: PersistedEventIdentity,
): EventIdentityMatch {
  const sameCoreIdentity =
    normalizeIdentityPart(left.name) === normalizeIdentityPart(right.name) &&
    Boolean(left.dateStart) && left.dateStart === right.dateStart &&
    normalizeIdentityPart(left.city) === normalizeIdentityPart(right.city) &&
    normalizeIdentityPart(left.state) === normalizeIdentityPart(right.state);

  if (!sameCoreIdentity) return "none";

  const leftVenue = normalizeIdentityPart(left.venueName);
  const rightVenue = normalizeIdentityPart(right.venueName);
  const leftAddress = normalizeIdentityPart(left.venueAddress);
  const rightAddress = normalizeIdentityPart(right.venueAddress);
  if (leftVenue && rightVenue && leftVenue !== rightVenue) return "needs_review";
  if (leftAddress && rightAddress && leftAddress !== rightAddress) return "needs_review";
  if (Boolean(leftVenue) !== Boolean(rightVenue)) return "needs_review";
  if (Boolean(leftAddress) !== Boolean(rightAddress)) return "needs_review";
  if (!leftVenue && !leftAddress && !rightVenue && !rightAddress) return "needs_review";
  return "exact";
}
