import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Json, TablesInsert } from "@/types/database";

const VALID_CATEGORIES = [
  "sports_cards", "pokemon", "magic_tcg", "yugioh", "comics", "memorabilia", "multi",
];

const str = (v: unknown, max: number) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

// POST: submit a shop for review. Auth required; saved unverified / pending.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to submit a shop." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const name = str(body.name, 160);
  const city = str(body.city, 120);
  const state = str(body.state, 40);
  if (!name || !city || !state) {
    return NextResponse.json({ error: "Name, city, and state are required." }, { status: 400 });
  }

  // Multi-select categories map onto the single category column: one selection
  // uses that value; multiple becomes "multi".
  const categories = Array.isArray(body.categories)
    ? body.categories.filter((c): c is string => typeof c === "string" && VALID_CATEGORIES.includes(c))
    : [];
  const category = categories.length > 1 ? "multi" : (categories[0] ?? null);

  const slugBase = slugify(name, { lower: true, strict: true }).slice(0, 80) || "shop";
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;

  const insert: TablesInsert<"shops"> = {
    name,
    slug,
    city,
    state,
    address: str(body.address, 240),
    zip_code: str(body.zip_code, 20),
    phone: str(body.phone, 40),
    email: str(body.email, 160),
    website: str(body.website, 300),
    description: str(body.description, 2000),
    category,
    hours: (body.hours && typeof body.hours === "object" ? (body.hours as Json) : null),
    status: "pending",
    is_verified: false,
    source: "user_submitted",
    submitted_by: user.id,
  };

  const { data, error } = await supabaseAdmin.from("shops").insert(insert).select("id,slug,name").single();
  if (error) return NextResponse.json({ error: "Could not submit the shop." }, { status: 500 });

  return NextResponse.json({ shop: data, pending: true }, { status: 201 });
}
