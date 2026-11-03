import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid sponsor id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.rpc("increment_sponsor_click", {
    sponsor_id: id,
  });

  if (error) {
    console.error("Sponsor click failed:", error.message);
    return NextResponse.json({ error: "Could not record click" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}