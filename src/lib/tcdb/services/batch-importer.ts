import type { DatabaseEvent } from "../models/database-event";
import {
  ImporterService,
  ImportResult,
} from "./importer";

export interface BatchImportSummary {
  total: number;

  imported: number;

  duplicates: number;

  needsReview: number;

  validationFailed: number;

  failed: number;

  successRate: number;

  durationMs: number;

  results: ImportResult[];
}

export interface BatchImporterOptions {
  concurrency?: number;
}

export class BatchImporterService {

  private readonly concurrency: number;

  constructor(
    private readonly importer: ImporterService,
    options: BatchImporterOptions = {}
  ) {
    this.concurrency = options.concurrency ?? 5;
  }

  async import(
    events: DatabaseEvent[]
  ): Promise<BatchImportSummary> {

    const started = Date.now();

    const results: ImportResult[] = [];

    let index = 0;

    const worker = async () => {

      while (true) {

        const current = index++;

        if (current >= events.length) {
          break;
        }

        const event = events[current];

        try {

          const result =
            await this.importer.import(event);

          results[current] = result;

        } catch (error) {

          results[current] = {

            success: false,

            imported: false,

            duplicate: false,

            message: "Unexpected import error.",

            error,

            event,

          };

        }

      }

    };

    await Promise.all(

      Array.from(
        {
          length: Math.min(
            this.concurrency,
            events.length
          ),
        },
        () => worker()
      )

    );

    const imported =
      results.filter(
        r => r.imported
      ).length;

    const duplicates =
      results.filter(
        r => r.duplicate
      ).length;

    const needsReview =
      results.filter((result) => result.needsReview).length;

    const validationFailed =
      results.filter(
        r =>
          !r.success &&
          r.validation &&
          !r.validation.valid
      ).length;

    const failed =
      results.filter(
        r =>
          !r.success &&
          !r.validation
      ).length;

    const durationMs =
      Date.now() - started;

    return {

      total: events.length,

      imported,

      duplicates,

      needsReview,

      validationFailed,

      failed,

      successRate:
        events.length === 0
          ? 100
          : Number(
              (
                (imported / events.length) *
                100
              ).toFixed(2)
            ),

      durationMs,

      results,

    };

  }

}
