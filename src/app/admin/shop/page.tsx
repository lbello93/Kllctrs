import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminShopsClient from "@/page-components/AdminPage/AdminShopsClient";
import type { Shop } from "@/types";

export const metadata = { title: "Admin · Shops | KLLCTRS" };

interface SearchParams {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminShopsPage({ searchParams }: SearchParams) {
  const { status } = await searchParams;
  const filterStatus = status ?? "pending";

  const { data: shops } = await supabaseAdmin
    .from("shops")
    .select("*")
    .eq("status", filterStatus)
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <AdminShopsClient
      initialShops={(shops ?? []) as Shop[]}
      currentStatus={filterStatus}
    />
  );
}
