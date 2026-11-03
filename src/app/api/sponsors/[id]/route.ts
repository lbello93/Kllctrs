import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSponsorDetail } from "@/lib/sponsors/intel";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public: full sponsor detail with events + analytics.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid sponsor id" }, { status: 400 });
  }

  const supabase = await createClient();
  const detail = await getSponsorDetail(supabase, id);
  if (!detail) return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });

  return NextResponse.json(detail);
}
