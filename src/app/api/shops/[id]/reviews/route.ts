import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET: public list of a shop's reviews (with reviewer display name).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid shop id" }, { status: 400 });

  const { data: rows, error } = await supabaseAdmin
    .from("shop_reviews")
    .select("id,rating,content,created_at,user_id")
    .eq("shop_id", id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });

  const userIds = [...new Set((rows ?? []).map((r) => r.user_id))];
  const nameById = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id,display_name")
      .in("id", userIds);
    for (const p of profiles ?? []) nameById.set(p.id, p.display_name || "Collector");
  }

  const reviews = (rows ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    content: r.content,
    created_at: r.created_at,
    reviewer_name: nameById.get(r.user_id) ?? "Collector",
  }));
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return NextResponse.json({ reviews, average, count: reviews.length });
}

// POST: submit a shop review (auth required).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid shop id" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { rating?: unknown; content?: unknown } | null;
  const rating = Number(body?.rating);
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be a whole number from 1 to 5." }, { status: 400 });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: "Please keep reviews under 2,000 characters." }, { status: 400 });
  }

  const { data: shop } = await supabaseAdmin.from("shops").select("id").eq("id", id).maybeSingle();
  if (!shop) return NextResponse.json({ error: "Shop not found." }, { status: 404 });

  const { data: review, error } = await supabaseAdmin
    .from("shop_reviews")
    .insert({ shop_id: id, user_id: user.id, rating, content: content || null })
    .select("id,rating,content,created_at")
    .single();

  if (error) {
    const dup = error.code === "23505";
    return NextResponse.json(
      { error: dup ? "You've already reviewed this shop." : "Could not save your review." },
      { status: dup ? 409 : 500 },
    );
  }

  // Keep the denormalized review_count in sync.
  const { count } = await supabaseAdmin
    .from("shop_reviews")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", id);
  await supabaseAdmin.from("shops").update({ review_count: count ?? 0 }).eq("id", id);

  return NextResponse.json({ review }, { status: 201 });
}
