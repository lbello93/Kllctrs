import { supabaseAdmin } from "@/lib/supabase/admin";
import ContentStudioClient from "@/page-components/AdminPage/ContentStudioClient";

export const metadata = { title: "Admin · Content Studio | KLLCTRS" };

export default async function ContentStudioPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: events }, { data: brands }] = await Promise.all([
    supabaseAdmin
      .from("events")
      .select("id, name, date_start, city, state")
      .eq("status", "approved")
      .gte("date_start", today)
      .order("date_start", { ascending: true })
      .limit(100),
    supabaseAdmin
      .from("sponsors")
      .select("id, name, category")
      .order("name", { ascending: true })
      .limit(200),
  ]);

  return <ContentStudioClient events={events ?? []} brands={brands ?? []} />;
}
