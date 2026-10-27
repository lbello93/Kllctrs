// app/api/sponsors/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = await req.json();

    if (
      !body.name?.trim() ||
      !body.contact_name?.trim() ||
      !body.contact_email?.trim()
    ) {
      return NextResponse.json(
        { error: "Company name, contact name, and email are required" },
        { status: 400 }
      );
    }

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error } = await supabase.from("sponsor_applications").insert({
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || null,
      category: body.category || "other",
      tier: body.tier || "bronze",
      website: body.website?.trim() || null,
      contact_name: body.contact_name.trim(),
      contact_email: body.contact_email.trim(),
      contact_phone: body.contact_phone?.trim() || null,
      notes: body.notes?.trim() || null,
      status: "pending",
      submitted_by: user.id,
    });

    if (error) {
      console.error("Sponsor application insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sponsor submit error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}