import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED: Record<string, string[]> = {
  collecting_categories: ["Sports cards", "Pokémon", "Trading card games", "Comics", "Toys & figures", "Other collectibles"],
  product_interests: ["New releases", "Exclusive products", "Grading services", "Breaks & live openings", "Accessories", "Deals & offers", "Events & meetups"],
  preferred_channels: ["Instagram", "YouTube", "TikTok", "Email", "In-person events", "Discord / community"],
  purchase_frequency: ["Weekly", "Monthly", "A few times a year", "Rarely"],
};

function cleanChoices(value: unknown, allowed: string[], limit = 8): string[] | null {
  if (!Array.isArray(value) || value.length > limit) return null;
  if (!value.every((choice) => typeof choice === "string" && allowed.includes(choice))) return null;
  return [...new Set(value)];
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sponsorId } = await params;
  if (!UUID.test(sponsorId)) return NextResponse.json({ error: "Invalid brand." }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  if (input.consent !== true) return NextResponse.json({ error: "Please opt in before sharing." }, { status: 400 });
  const collectingCategories = cleanChoices(input.collecting_categories, ALLOWED.collecting_categories);
  const productInterests = cleanChoices(input.product_interests, ALLOWED.product_interests);
  const preferredChannels = cleanChoices(input.preferred_channels, ALLOWED.preferred_channels);
  const purchaseFrequency = input.purchase_frequency === "" || input.purchase_frequency == null
    ? null
    : ALLOWED.purchase_frequency.includes(String(input.purchase_frequency)) ? String(input.purchase_frequency) : undefined;
  const eventIds = input.event_ids;
  const region = input.region === "" || input.region == null ? null : input.region;

  if (!collectingCategories || !productInterests || !preferredChannels || purchaseFrequency === undefined ||
      !Array.isArray(eventIds) || eventIds.length > 30 || !eventIds.every((value) => typeof value === "string" && UUID.test(value)) ||
      (region !== null && (typeof region !== "string" || region.length > 80))) {
    return NextResponse.json({ error: "Some answers are invalid. Please review and try again." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: sponsor } = await supabase.from("sponsors").select("id").eq("id", sponsorId).maybeSingle();
  if (!sponsor) return NextResponse.json({ error: "Brand not found." }, { status: 404 });

  const { error } = await supabase.from("brand_engagements").insert({
    sponsor_id: sponsorId,
    event_ids: [...new Set(eventIds as string[])],
    collecting_categories: collectingCategories,
    product_interests: productInterests,
    preferred_channels: preferredChannels,
    purchase_frequency: purchaseFrequency,
    region: typeof region === "string" ? region.trim() || null : null,
    consented_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Could not save brand engagement", error.message);
    return NextResponse.json({ error: "We couldn't save that just now. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
