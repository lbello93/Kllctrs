import { NextResponse } from "next/server";

import { isAuthorizedCronRequest } from "@/lib/events/cron-auth";
import { generateWeeklyCronBatch } from "@/lib/content/weekly";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Weekly content cron: generates preview drafts for the top 3 upcoming events
 * plus a trend report, all saved as drafts for an admin to review. Secured with
 * the shared timing-safe cron token (CRON_SECRET).
 */
export async function POST(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await generateWeeklyCronBatch();
  console.info(
    `[cron/generate-content] generated=${result.generated.length} skipped=${result.skipped.length} errors=${result.errors.length}`,
    { errors: result.errors, skipped: result.skipped },
  );

  return NextResponse.json({
    ok: true,
    generated: result.generated.map((d) => ({ id: d.id, title: d.title, type: d.type })),
    skipped: result.skipped,
    errors: result.errors,
  });
}

// Some cron providers issue GET. Accept both.
export const GET = POST;
