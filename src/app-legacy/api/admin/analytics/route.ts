/**
 * ------------------------------------------------------------
 * FILE: route.ts
 * PURPOSE:
 * Returns aggregated analytics data for the admin dashboard.
 * Admin only. Accepts ?range=today|7d|30d|90d|year|all
 * ------------------------------------------------------------
 */

import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  ANALYTICS_RANGES,
  getAnalytics,
  type AnalyticsRange,
} from "@/lib/analytics/queries";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, status: 401, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

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