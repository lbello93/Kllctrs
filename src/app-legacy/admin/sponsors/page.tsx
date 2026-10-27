import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminSponsorsClient from "@/page-components/AdminPage/AdminSponsorsClient";

export const metadata = { title: "Admin · Sponsors | KLLCTRS" };

export default async function AdminSponsorsPage() {
  const { data: sponsors } = await supabaseAdmin
    .from("sponsors")
    .select("*")
    .order("profile_views", { ascending: false })
    .limit(200);

  return <AdminSponsorsClient initialSponsors={sponsors ?? []} />;
}
