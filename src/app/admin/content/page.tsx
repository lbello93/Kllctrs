import { supabaseAdmin } from "@/lib/supabase/admin";
import ContentEngineClient from "@/page-components/content-engine/ContentEngineClient";
import type {
  ContentRow,
  ContentStats,
  OptionRecord,
} from "@/page-components/content-engine/types";

export const metadata = { title: "Admin · Content Engine | KLLCTRS" };
export const dynamic = "force-dynamic";

export default async function AdminContentEnginePage() {
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: rows }, { data: events }, { data: sponsors }] = await Promise.all([
    supabaseAdmin
      .from("content")
      .select("id,title,slug,type,status,created_at,published_at,is_ai_generated")
      .order("created_at", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("events")
      .select("id,name,date_start,city,state")
      .order("date_start", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("sponsors")
      .select("id,name,category")
      .order("name", { ascending: true })
      .limit(300),
  ]);

  const content: ContentRow[] = (rows ?? []).map((r) => ({
    ...r,
    is_ai_generated: Boolean(r.is_ai_generated),
  }));

  const stats: ContentStats = content.reduce(
    (acc, r) => {
      acc.total += 1;
      const s = r.status ?? "draft";
      if (s === "draft") acc.draft += 1;
      else if (s === "review") acc.review += 1;
      else if (s === "published") acc.published += 1;
      else if (s === "archived") acc.archived += 1;
      return acc;
    },
    { draft: 0, review: 0, published: 0, archived: 0, total: 0 } as ContentStats,
  );

  const eventOptions: OptionRecord[] = (events ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    detail: `${e.city}, ${e.state} · ${e.date_start?.slice(0, 10) ?? ""}${
      e.date_start && e.date_start.slice(0, 10) >= today ? " (upcoming)" : ""
    }`,
  }));

  const sponsorOptions: OptionRecord[] = (sponsors ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    detail: s.category,
  }));

  return (
    <ContentEngineClient
      stats={stats}
      content={content}
      events={eventOptions}
      sponsors={sponsorOptions}
    />
  );
}
