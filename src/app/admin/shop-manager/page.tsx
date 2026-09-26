import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminShopsClient from "@/components/admin/AdminShopsClient";
import type { Shop } from "@/types";

interface SearchParams {
  searchParams: Promise<{ status?: string }>;
}

export default async function ShopManagerPage({ searchParams }: SearchParams) {
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
