import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET: public list of reviews for an event.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("event_reviews")
    .select("id,reviewer_name,reviewer_avatar_url,rating,comment,created_at")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });

  const reviews = data ?? [];
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : null;

  return NextResponse.json({ reviews, average, count: reviews.length });
}

// POST: submit a review. Auth required; only for events that have already happened.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as
    | { rating?: unknown; comment?: unknown }
    | null;
  const rating = Number(body?.rating);
  const comment = typeof body?.comment === "string" ? body.comment.trim() : "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be a whole number from 1 to 5." }, { status: 400 });
  }
  if (!comment) {
    return NextResponse.json({ error: "Please add a short comment." }, { status: 400 });
  }
  if (comment.length > 2000) {
    return NextResponse.json({ error: "Please keep reviews under 2,000 characters." }, { status: 400 });
  }

  // The event must exist and have already happened (reviews are for past shows).
  const { data: event } = await supabaseAdmin
    .from("events")
    .select("id,date_start,date_end")
    .eq("id", id)
    .maybeSingle();
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const today = new Date().toISOString().split("T")[0];
  const endDate = event.date_end ?? event.date_start;
  if (endDate >= today) {
    return NextResponse.json({ error: "You can review a show after it has taken place." }, { status: 400 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("display_name,avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const { data: review, error } = await supabaseAdmin
    .from("event_reviews")
    .insert({
      event_id: id,
      user_id: user.id,
      reviewer_name: profile?.display_name || "Collector",
      reviewer_avatar_url: profile?.avatar_url ?? null,
      rating,
      comment,
    })
    .select("id,reviewer_name,reviewer_avatar_url,rating,comment,created_at")
    .single();

  if (error) {
    const alreadyReviewed = error.code === "23505";
    return NextResponse.json(
      { error: alreadyReviewed ? "You've already reviewed this show." : "Could not save your review." },
      { status: alreadyReviewed ? 409 : 500 },
    );
  }

  return NextResponse.json({ review }, { status: 201 });
}
