import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { parseEventsCsv } from "@/lib/events/csv-import";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  // Accept either a multipart file upload or a raw JSON { csv } body.
  let csv = "";
  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (file && typeof file !== "string") csv = await file.text();
    } else {
      const body = (await request.json()) as { csv?: unknown };
      if (typeof body.csv === "string") csv = body.csv;
    }
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded CSV." }, { status: 400 });
  }

  if (!csv.trim()) {
    return NextResponse.json({ error: "No CSV content provided." }, { status: 400 });
  }

  const { rows, errors, parsed } = parseEventsCsv(csv);

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No valid rows to import.", errors, parsed },
      { status: 400 },
    );
  }

  // Upsert on slug so re-importing refreshes rather than duplicates.
  const { data, error } = await supabaseAdmin
    .from("events")
    .upsert(rows, { onConflict: "slug" })
    .select("id,name,city,state");

  if (error) {
    console.error("[import-csv] upsert failed:", error.message);
    return NextResponse.json(
      { error: `Database error: ${error.message}`, errors, parsed },
      { status: 500 },
    );
  }

  return NextResponse.json({
    imported: data?.length ?? 0,
    parsed,
    skipped: parsed - rows.length,
    errors,
    results: data ?? [],
  });
}
