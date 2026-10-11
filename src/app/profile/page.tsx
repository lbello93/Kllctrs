import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "../../components/profile/ProfileClient";
import type { Event, Shop } from "@/types";

export const metadata = {
  title: "Profile | KLLCTRS",
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

  const isAdmin = profile?.role === "admin";
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

  return (
    <ProfileClient
      user={user}
      profile={profile ? { ...profile, favorite_categories: profile.favorite_categories ?? [] } : null}
      savedShops={savedShops ?? []}
      savedEvents={(savedEvents ?? []) as Event[]}
    />
  );
}
