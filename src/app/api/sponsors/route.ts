import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { listSponsors, type SponsorSort } from "@/lib/sponsors/intel";

// Public sponsor intelligence list: filter/sort/paginate over sponsor_analytics.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const sp = request.nextUrl.searchParams;

  const sortByParam = sp.get("sortBy");
  const sortBy: SponsorSort =
    sortByParam === "events" || sortByParam === "category" ? sortByParam : "name";

  const result = await listSponsors(supabase, {
    category: sp.get("category") ?? undefined,
    search: sp.get("search") ?? undefined,
    sortBy,
    hasEventsThisYear: sp.get("hasEventsThisYear") === "true",
    page: Number(sp.get("page")) || 1,
    limit: Number(sp.get("limit")) || 20,
  });

  return NextResponse.json(result);
}
