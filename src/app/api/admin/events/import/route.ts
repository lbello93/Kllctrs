import { NextRequest, NextResponse } from "next/server";

import { createImportPipeline } from "@/lib/tcdb/factory/create-import-pipeline";
import { parseEventDetail } from "@/lib/tcdb/parser/detail-parser";
import { createClient } from "@/lib/supabase/server";

import { SportsCollectorDigestScraper } from "@/lib/tcdb/services/sports-collector-digest-scrapper";
import { hasWrittenSourcePermission } from "@/lib/events/source-access";
export async function POST(
  request: NextRequest
) {

  try {

    //------------------------------------------------
// Authentication
//------------------------------------------------

const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (
  profile?.role !== "admin" &&
  profile?.role !== "super_admin"
) {
  return NextResponse.json(
    {
      success: false,
      error: "Forbidden",
    },
    {
      status: 403,
    }
  );
}
    //------------------------------------------------
    // Parse multipart form data
    //------------------------------------------------

    const formData =
      await request.formData();

    const providerValue = formData.get("provider");
    const provider = typeof providerValue === "string" && providerValue
      ? providerValue
      : "tcdb";

    if (provider !== "tcdb" && provider !== "sportscollectorsdigest") {
      return NextResponse.json({ success: false, error: "Unsupported event source." }, { status: 400 });
    }

    if (!hasWrittenSourcePermission(provider)) {
      return NextResponse.json({
        success: false,
        error: `Event ingestion from ${provider} is disabled until written permission for Kllctrs' intended use is documented.`,
      }, { status: 503 });
    }

  console.log("Provider:", provider);

  //------------------------------------------------
// Sports Collector Digest Import
//------------------------------------------------

if (provider === "sportscollectorsdigest") {

    const scraper =
        new SportsCollectorDigestScraper();

    const scrapeResult =
        await scraper.scrape();

    console.log(
        "Scraped:",
        scrapeResult.events.length
    );

    const databaseEvents =
        scrapeResult.events;

    console.log(
        "Database Events:",
        databaseEvents.length
    );

    const pipeline =
        createImportPipeline();

    const report =
        await pipeline.importDatabaseEvents(
            databaseEvents
        );

    return NextResponse.json({

        success: true,

        provider,

        total: databaseEvents.length,

        report,

    });

}



    //------------------------------------------------
    // Calendar HTML
    //------------------------------------------------

    const calendarFile =
      formData.get(
        "calendar"
      ) as File | null;

    if (!calendarFile) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Calendar HTML file is required.",
        },

        {
          status: 400,
        }

      );

    }

    //------------------------------------------------
    // Read calendar HTML
    //------------------------------------------------

    const calendarHtml =
      await calendarFile.text();

    //------------------------------------------------
    // Detail Files
    //------------------------------------------------

    const detailPages: Record<
      string,
      string
    > = {};

    const detailFiles =
      formData.getAll(
        "details"
      ) as File[];

    for (const file of detailFiles) {

  const html = await file.text();

  const detail = parseEventDetail(html);

  detailPages[detail.eventId] = html;

}

    //------------------------------------------------
    // Execute Pipeline
    //------------------------------------------------

    const pipeline =
      createImportPipeline();

    const result =
      await pipeline.execute({

        calendarHtml,

        detailPages,

      });

    //------------------------------------------------

    return NextResponse.json({

      success: true,

      report:
        result.report,

      calendarEvents:
        result.calendarEvents.length,

      detailEvents:
        result.detailEvents.length,

      databaseEvents:
        result.databaseEvents.length,

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error.",

      },

      {

        status: 500,

      }

    );

  }

}
