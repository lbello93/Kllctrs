import { createClient } from "@/lib/supabase/server";
import MapsClient from "@/components/maps/MapsClient";

export const metadata = {
  title: "Card Shows and Shops Near You | KLLCTRS",
  description: "Explore upcoming trading card shows and local card shops across the United States on the KLLCTRS collector map.",
};

export default async function MapsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved");

  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .eq("status", "approved");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let savedEventIds: string[] = [];
  let savedShopIds: string[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("saved_events,saved_shops")
      .eq("id", user.id)
      .single();

    savedEventIds = profile?.saved_events ?? [];
    savedShopIds = profile?.saved_shops ?? [];
  }
  return (
    <MapsClient
      events={events ?? []}
      shops={shops ?? []}
      savedEventIds={savedEventIds}
      savedShopIds={savedShopIds}
    />
  );
}
