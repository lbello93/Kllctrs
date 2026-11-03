import { supabaseAdmin } from "@/lib/supabase/admin";
import VideoStudioClient, {
  type EventOption,
  type SponsorOption,
  type VideoItem,
} from "@/page-components/content-engine/VideoStudioClient";

export const metadata = { title: "Admin · Video Studio | KLLCTRS" };
export const dynamic = "force-dynamic";

export default async function AdminVideoStudioPage() {
  const [{ data: events }, { data: analytics }, { data: junction }, { data: videos }] =
    await Promise.all([
      supabaseAdmin
        .from("events")
        .select("id,name,date_start,city,state,sponsors")
        .order("date_start", { ascending: false })
        .limit(150),
      supabaseAdmin
        .from("sponsor_analytics")
        .select("sponsor_id,name,category,total_events_sponsored,states_present_in")
        .order("total_events_sponsored", { ascending: false })
        .limit(80),
      supabaseAdmin
        .from("event_sponsors")
        .select("sponsor_id, events(name)")
        .limit(2000),
      supabaseAdmin
        .from("content")
        .select("id,title,video_url,video_type,video_duration,status")
        .eq("type", "video")
        .order("created_at", { ascending: false })
        .limit(60),
    ]);

  const eventOptions: EventOption[] = (events ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    date: e.date_start?.slice(0, 10) ?? "",
    city: e.city,
    state: e.state,
    sponsors: (e.sponsors ?? []).filter((s): s is string => Boolean(s)),
  }));

  // Group top event names per sponsor from the junction.
  const topEventsBySponsor = new Map<string, string[]>();
  for (const row of junction ?? []) {
    const name = (row.events as { name?: string } | null)?.name;
    if (!name) continue;
    const list = topEventsBySponsor.get(row.sponsor_id) ?? [];
    if (list.length < 3) list.push(name);
    topEventsBySponsor.set(row.sponsor_id, list);
  }

  const sponsorOptions: SponsorOption[] = (analytics ?? []).map((s) => ({
    id: s.sponsor_id,
    name: s.name ?? "Sponsor",
    category: s.category ?? "",
    eventCount: s.total_events_sponsored ?? 0,
    states: (s.states_present_in ?? []).filter((x): x is string => Boolean(x)),
    topEvents: topEventsBySponsor.get(s.sponsor_id) ?? [],
  }));

  const videoItems: VideoItem[] = (videos ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    video_url: v.video_url,
    video_type: v.video_type,
    video_duration: v.video_duration,
    status: v.status,
  }));

  return (
    <VideoStudioClient events={eventOptions} sponsors={sponsorOptions} videos={videoItems} />
  );
}
