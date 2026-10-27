import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminEventsClient from "@/page-components/AdminPage/AdminEventsClient";
import type { Event } from "@/types";

export const metadata = { title: "Admin · Events | KLLCTRS" };

interface SearchParams {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminEventsPage({ searchParams }: SearchParams) {
  const { status } = await searchParams;
  const filterStatus = status ?? "pending";

  const { data: events } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("status", filterStatus)
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <AdminEventsClient
      initialEvents={(events ?? []) as Event[]}
      currentStatus={filterStatus}
    />
  );
}
