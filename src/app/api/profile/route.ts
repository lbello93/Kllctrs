import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const update: Record<string, any> = { updated_at: new Date().toISOString() };
  if ("display_name" in body) update.display_name = body.display_name ?? null;
  if ("username" in body) update.username = body.username ?? null;
  if ("bio" in body) update.bio = body.bio ?? null;
  if ("city" in body) update.city = body.city ?? null;
  if ("state" in body) update.state = body.state ?? null;
  if ("country" in body) update.country = body.country ?? null;
  if ("favorite_categories" in body) update.favorite_categories = body.favorite_categories ?? [];
  if ("grading_preference" in body) update.grading_preference = body.grading_preference ?? null;
  if ("years_collecting" in body) update.years_collecting = body.years_collecting ?? null;
  if ("avatar_url" in body) update.avatar_url = body.avatar_url ?? null;
  if ("collector_type" in body) update.collector_type = body.collector_type ?? null;
  if ("favorite_games" in body) update.favorite_games = body.favorite_games ?? [];
  if ("event_notifications" in body) update.event_notifications = body.event_notifications ?? true;
  if ("shop_notifications" in body) update.shop_notifications = body.shop_notifications ?? true;
  if ("community_notifications" in body) update.community_notifications = body.community_notifications ?? true;
  if ("marketing_notifications" in body) update.marketing_notifications = body.marketing_notifications ?? false;
  if ("profile_completed" in body) update.profile_completed = body.profile_completed ?? false;
  if ("terms_accepted" in body) {
    update.terms_accepted = body.terms_accepted ?? false;
    if (body.terms_accepted) {
      update.terms_accepted_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}