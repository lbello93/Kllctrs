import type { Database, Json } from "@/types/database";
import { createEventSlug, type EventCandidate } from "./ingestion-contract";

export type EventInsertRow = Database["public"]["Tables"]["events"]["Insert"];

export interface CandidateInsertOptions {
  submittedBy?: string | null;
  possibleDuplicateOf?: {
    id: string;
    name: string;
    slug: string;
  };
}

/** The shared persistence boundary: only checked-in Supabase event columns are written. */
export function mapCandidateToEventInsert(
  candidate: EventCandidate,
  options: CandidateInsertOptions = {},
): EventInsertRow {
  const event = candidate.event;
  if (!event.name || !event.dateStart || !event.city || !event.state) {
    throw new Error("Candidate is missing required event identity fields.");
  }

  const socialLinks: Record<string, Json | undefined> = {
    ...(event.socialLinks ?? {}),
    kllctrs_ingestion: {
      version: 1,
      source: {
        provider: candidate.source.provider,
        sourceId: candidate.source.sourceId,
        sourceUrl: candidate.source.sourceUrl,
        observedAt: candidate.source.observedAt,
        contentHash: candidate.source.contentHash,
      },
      sources: [{
        provider: candidate.source.provider,
        sourceId: candidate.source.sourceId,
        sourceUrl: candidate.source.sourceUrl,
        observedAt: candidate.source.observedAt,
        contentHash: candidate.source.contentHash,
      }],
      dedupeFingerprint: candidate.dedupeFingerprint,
      reviewStatus: candidate.reviewStatus,
      categories: [...candidate.categories],
      quality: {
        missingRequiredFields: [...candidate.quality.missingRequiredFields],
        warnings: [...candidate.quality.warnings],
        readyForReview: candidate.quality.readyForReview,
      },
      sponsorClaims: candidate.sponsorClaims.map((claim) => ({
        name: claim.name,
        sourceUrl: claim.sourceUrl,
        observedAt: claim.observedAt,
        sourceSnippet: claim.sourceSnippet,
        verificationStatus: claim.verificationStatus,
      })),
      possibleDuplicateOf: options.possibleDuplicateOf ?? null,
    },
  };

  return {
    name: event.name,
    slug: createEventSlug(event),
    date_start: event.dateStart,
    date_end: event.dateEnd,
    city: event.city,
    state: event.state,
    venue_name: event.venueName,
    venue_address: event.venueAddress,
    venue_website: event.venueWebsite,
    zip_code: event.zipCode,
    lat: event.latitude,
    lng: event.longitude,
    website: event.website,
    vendor_tables: event.vendorTables,
    contact_name: event.contactName,
    contact_email: event.contactEmail,
    contact_phone: event.contactPhone,
    autograph_guests: event.autographGuests,
    social_links: socialLinks,
    // Sponsor claims remain evidence only until a reviewer verifies the relationship.
    sponsors: null,
    source: candidate.source.provider,
    status: "pending",
    submitted_by: options.submittedBy ?? null,
  };
}
