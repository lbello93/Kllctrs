import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { compareSponsors } from "@/lib/sponsors/intel";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public: side-by-side comparison data for 2-4 sponsors.
// Accepts ?ids=a,b,c or repeated ?ids=a&ids=b.
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const raw = [...sp.getAll("ids"), ...(sp.get("ids")?.split(",") ?? [])];
  const ids = [...new Set(raw.map((s) => s.trim()).filter((s) => UUID_RE.test(s)))];

  if (ids.length < 1) {
    return NextResponse.json({ error: "Provide 1-4 sponsor ids via ?ids=" }, { status: 400 });
  }

  const supabase = await createClient();
  const result = await compareSponsors(supabase, ids);
  return NextResponse.json(result);
}
