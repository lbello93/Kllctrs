import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { TablesUpdate } from "@/types/database";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const };
}

function parseList(value: unknown): string[] | undefined {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return [...new Set(value.map((item) => item.trim()).filter(Boolean))].slice(0, 20);
  }
  if (typeof value === "string") return [...new Set(value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean))].slice(0, 20);
  return undefined;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const input = body as Record<string, unknown>;
  const update: TablesUpdate<"sponsors"> = {};
  if (typeof input.name === "string" && input.name.trim()) update.name = input.name.trim().slice(0, 120);
  if (typeof input.website === "string") update.website = input.website.trim().slice(0, 300) || null;
  if (typeof input.category === "string") update.category = input.category.trim().slice(0, 60);
  if (typeof input.description === "string") update.description = input.description.trim().slice(0, 2000) || null;
  if (typeof input.tagline === "string") update.tagline = input.tagline.trim().slice(0, 180) || null;
  if (typeof input.service_area === "string") update.service_area = input.service_area.trim().slice(0, 240) || null;
  if (typeof input.info_source_url === "string") {
    update.info_source_url = input.info_source_url.trim().slice(0, 500) || null;
    update.info_verified_at = input.info_source_url.trim() ? new Date().toISOString() : null;
  }
  for (const key of ["offerings", "product_categories", "target_audience"] as const) {
    const parsed = parseList(input[key]);
    if (parsed) update[key] = parsed;
  }
  if (!Object.keys(update).length) return NextResponse.json({ error: "No supported fields provided" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("sponsors").update(update).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "Could not update brand details" }, { status: 500 });
  return NextResponse.json({ sponsor: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const { id } = await params;
  const { error } = await supabaseAdmin.from("sponsors").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete brand" }, { status: 500 });
  return NextResponse.json({ success: true });
}
