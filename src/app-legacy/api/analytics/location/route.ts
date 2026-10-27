import { NextRequest, NextResponse } from "next/server";
import { getVisitorLocation } from "@/lib/analytics/geo";
import { saveVisit } from "@/lib/analytics/saveVisit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const location = getVisitorLocation(request);

    await saveVisit({
      page: body.page,
      referrer: body.referrer,
      ...location,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Analytics Error:", err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
