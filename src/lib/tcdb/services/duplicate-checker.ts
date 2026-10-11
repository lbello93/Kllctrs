import type { EventCandidate } from "@/lib/events/ingestion-contract";
import { EventRepository } from "../repositories/event-repository";

export interface DuplicateCheckResult {
  duplicate: boolean;
  needsReview?: boolean;
  reason?: string;
  existingEvent?: { id: string; name: string; slug: string };
}

export class DuplicateCheckerService {
  constructor(private readonly repository: EventRepository) {}

  async check(candidate: EventCandidate): Promise<DuplicateCheckResult> {
    const existingEvent = await this.repository.findPossibleDuplicates(candidate);

    return existingEvent
      ? {
          duplicate: true,
          needsReview: existingEvent.match === "needs_review",
          reason: existingEvent.match === "exact"
            ? "Matching event identity already exists."
            : "Possible duplicate: name, date, and location match; venue details need review.",
          existingEvent: existingEvent.event,
        }
      : { duplicate: false };
  }
}
