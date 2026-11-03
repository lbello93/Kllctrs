/**
 * ------------------------------------------------------------
 * FILE: route.ts
 * PURPOSE:
 * Returns aggregated analytics data for the admin dashboard.
 * Admin only. Accepts ?range=today|7d|30d|90d|year|all
 * ------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import {
  ANALYTICS_RANGES,
  getAnalytics,
  type AnalyticsRange,
} from "@/lib/analytics/queries";

export async function GET(request: NextRequest) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const requested = request.nextUrl.searchParams.get("range");
  const range: AnalyticsRange = ANALYTICS_RANGES.includes(
    requested as AnalyticsRange,
  )
    ? (requested as AnalyticsRange)
    : "all";

  try {
    const data = await getAnalytics(range);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics." },
      { status: 500 },
    );
  }
}