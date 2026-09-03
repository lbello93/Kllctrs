import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const [
      { data: topShops, error: shopsError },
      { data: topEvents, error: eventsError },
      { data: sponsors, error: sponsorsError },
      { data: stateEngagement, error: stateError },
      { count: collectorCount, error: countError },
    ] = await Promise.all([
      supabaseAdmin
        .from("shop_favorite_counts")
        .select("*")
        .limit(10),
      supabaseAdmin
        .from("event_save_counts")
        .select("*")
        .limit(10),
      supabaseAdmin
        .from("sponsors")
        .select("id, name, website_clicks")
        .order("website_clicks", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("state_engagement_summary")
        .select("*")
        .limit(15),
      supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true }),
    ]);

    const firstError = shopsError || eventsError || sponsorsError || stateError || countError;
    if (firstError) {
      return NextResponse.json(
        { error: firstError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      collectorCount: collectorCount ?? 0,
      topShops: topShops ?? [],
      topEvents: topEvents ?? [],
      sponsorClicks: sponsors ?? [],
      stateEngagement: stateEngagement ?? [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}