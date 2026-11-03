import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "@/page-components/ProfilePage/ProfileClient";
import type { Event, Shop } from "@/types";
import type {
  ProfileActivityData,
  SubmittedShopSummary,
  UserReviewSummary,
} from "@/lib/profile/types";

export const metadata = {
  title: "Profile | KLLCTRS",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
  }

  // Fetch saved shops
  let savedShops: Shop[] = [];

  if (profile?.saved_shops?.length) {
    const { data, error: shopsError } = await supabase
      .from("shops")
      .select("*")
      .in("id", profile.saved_shops);

    if (shopsError) {
      console.error(shopsError);
    }

    savedShops = (data ?? []) as Shop[];
  }

  /////// events
  const savedEventIds = profile?.saved_events ?? [];

  const { data: savedEvents } =
    savedEventIds.length > 0
      ? await supabase.from("events").select("*").in("id", savedEventIds)
      : { data: [] as Event[] };

  // Activity: submitted shops, reviews (events + shops), chat thread count.
  const [submittedShopsRes, eventReviewsRes, shopReviewsRes, chatThreadsRes] =
    await Promise.all([
      supabase
        .from("shops")
        .select("id,name,slug,city,state,status,is_verified")
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("event_reviews")
        .select("id,rating,comment,events(name,slug)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("shop_reviews")
        .select("id,rating,content,shops(name,slug)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("chat_threads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const submittedShops: SubmittedShopSummary[] = (submittedShopsRes.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    city: s.city,
    state: s.state,
    status: s.status,
    is_verified: s.is_verified,
  }));

  const eventReviews: UserReviewSummary[] = (eventReviewsRes.data ?? []).map((r) => {
    const ev = r.events as { name?: string; slug?: string } | null;
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      kind: "event" as const,
      target: ev?.name ?? "Event",
      href: ev?.slug ? `/maps/events/${ev.slug}` : null,
    };
  });

  const shopReviews: UserReviewSummary[] = (shopReviewsRes.data ?? []).map((r) => {
    const sh = r.shops as { name?: string; slug?: string } | null;
    return {
      id: r.id,
      rating: r.rating,
      comment: r.content,
      kind: "shop" as const,
      target: sh?.name ?? "Shop",
      href: sh?.slug ? `/maps/shops/${sh.slug}` : null,
    };
  });

  const activity: ProfileActivityData = {
    submittedShops,
    reviews: [...eventReviews, ...shopReviews],
    chatThreadCount: chatThreadsRes.count ?? 0,
  };

  return (
    <ProfileClient
      user={user}
      profile={profile ? { ...profile, favorite_categories: profile.favorite_categories ?? [] } : null}
      savedShops={savedShops ?? []}
      savedEvents={(savedEvents ?? []) as Event[]}
      activity={activity}
    />
  );
}
