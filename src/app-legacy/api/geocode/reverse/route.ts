import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Geocoding not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({ lat, lon, apiKey });

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Geoapify reverse request failed (${response.status})`);
    }

    const json = await response.json();
    const feature = json.features?.[0];

    if (!feature) {
      return NextResponse.json({ error: "No location found" }, { status: 404 });
    }

    return NextResponse.json({
      country: feature.properties.country ?? null,
      countryCode: feature.properties.country_code
        ? feature.properties.country_code.toUpperCase()
        : null,
      state: feature.properties.state ?? null,
      city:
        feature.properties.city ??
        feature.properties.county ??
        feature.properties.district ??
        null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Reverse geocoding failed" },
      { status: 500 }
    );
  }
}