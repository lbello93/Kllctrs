import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/events/cron-auth";
import { createImportPipeline } from "@/lib/tcdb/factory/create-import-pipeline";
import { SportsCollectorDigestScraper } from "@/lib/tcdb/services/sports-collector-digest-scrapper";
import { hasWrittenSourcePermission } from "@/lib/events/source-access";

export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasWrittenSourcePermission("sportscollectorsdigest")) {
    return NextResponse.json({
      error: "Sports Collector Digest ingestion is disabled until written permission for Kllctrs' intended use is documented.",
    }, { status: 503 });
  }
  if (process.env.SCD_AUTOMATION_ENABLED !== "true") {
    return NextResponse.json({
      error: "Sports Collector Digest automation is disabled until source access rules are confirmed.",
    }, { status: 503 });
  }

  try {
    const scraped = await new SportsCollectorDigestScraper().scrape();
    const report = await createImportPipeline().importDatabaseEvents(scraped.events);
    console.info("Scheduled Sports Collector Digest ingestion", {
      discovered: scraped.events.length,
      imported: report.imported,
      duplicates: report.duplicates,
      needsReview: report.needsReview,
      failed: report.failed,
      validationFailed: report.validationFailed,
    });
    return NextResponse.json({ provider: "sportscollectorsdigest", ...report });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Scheduled Sports Collector Digest ingestion failed", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
