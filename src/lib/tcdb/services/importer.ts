import type { DatabaseEvent } from "../models/database-event";

import { EventRepository } from "../repositories/event-repository";

import { DuplicateCheckerService } from "./duplicate-checker";
import { GeocoderService } from "./geocoder";

import { validateEvent } from "../pipeline/validator";
import { databaseEventToCandidate } from "@/lib/events/tcdb-adapter";
import type { EventCandidate } from "@/lib/events/ingestion-contract";
import { mapCandidateToEventInsert } from "@/lib/events/supabase-mapper";

export interface ImportResult {

  success: boolean;

  imported: boolean;

  duplicate: boolean;

  needsReview?: boolean;

  matchedEvent?: unknown;

  message: string;

  eventId?: string;

  validation?: ReturnType<typeof validateEvent>;

  event?: DatabaseEvent;

  candidate?: EventCandidate;

  error?: unknown;

}

export class ImporterService {

  constructor(

    private readonly repository: EventRepository,

    private readonly duplicateChecker: DuplicateCheckerService,

    private readonly geocoder: GeocoderService

  ) {}

  async import(

    event: DatabaseEvent

  ): Promise<ImportResult> {

    let candidate: EventCandidate | undefined;

    try {

        //---------------------------------------
        // Geocode
        //---------------------------------------
  
      let geocoded = event;
      try {
        geocoded = await this.geocoder.geocode(event);
      } catch (geocodingError) {
        console.warn("Event geocoding failed; continuing with source data.", {
          sourceId: event.source_event_id,
          error: geocodingError instanceof Error ? geocodingError.message : String(geocodingError),
        });
      }
      candidate = databaseEventToCandidate(geocoded);
      //---------------------------------------
      // Validation
      //---------------------------------------

      const validation =
        validateEvent(geocoded);

      if (!validation.valid) {

        return {

          success: false,

          imported: false,

          duplicate: false,

          message: "Validation failed.",

          validation,

          candidate,

          event,

        };

      }


      //---------------------------------------
      // Duplicate Check
      //---------------------------------------

      const duplicate =
        await this.duplicateChecker.check(
          candidate
        );

      if (duplicate.duplicate && !duplicate.needsReview) {

        return {

          success: true,

          imported: false,

          duplicate: true,

          needsReview: duplicate.needsReview ?? false,

          matchedEvent: duplicate.existingEvent,

          message:
            duplicate.reason ??
            "Duplicate event.",

          validation,

          candidate,

          event: geocoded,

        };

      }

      const possibleDuplicateOf = duplicate.needsReview && duplicate.existingEvent
        ? {
            id: duplicate.existingEvent.id,
            name: duplicate.existingEvent.name,
            slug: duplicate.existingEvent.slug,
          }
        : undefined;

      //---------------------------------------
      // Map
      //---------------------------------------

      const row =
        mapCandidateToEventInsert(candidate, { possibleDuplicateOf });

      //---------------------------------------
      // Insert
      //---------------------------------------

      const inserted =
        await this.repository.create(
          row
        );

      //---------------------------------------

      return {

        success: true,

        imported: true,

        duplicate: false,

        needsReview: Boolean(possibleDuplicateOf),

        matchedEvent: possibleDuplicateOf ? duplicate.existingEvent : undefined,

        message:
          possibleDuplicateOf
            ? "Possible duplicate added to the admin review queue."
            : "Event imported successfully.",

        validation,

        candidate,

        event: geocoded,

        eventId: inserted.id,

      };

    }

    catch (error) {
 
  return {
    success: false,
    imported: false,
    duplicate: false,
    message:
      error instanceof Error
        ? error.message
        : String(error),
    event,
    candidate,
    error,
  };
}

  }

  //---------------------------------------------------
  // Batch Import
  //---------------------------------------------------

  async importMany(

    events: DatabaseEvent[]

  ) {

    const results: ImportResult[] = [];

    for (const event of events) {

      const result =
        await this.import(event);

      results.push(result);

    }

    return {

      total: events.length,

      imported:
        results.filter(
          r => r.imported
        ).length,

      duplicates:
        results.filter(
          r => r.duplicate
        ).length,

      failed:
        results.filter(
          r => !r.success
        ).length,

      results,

    };

  }

}
