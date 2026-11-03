import { NextRequest, NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/apiGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import slugify from "slugify";
import { parsePdfArticle } from "@/lib/content/parsePdfArticle";

export async function POST(req: NextRequest) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await parsePdfArticle(buffer);

  if (!result.ok) {
  console.error("[content upload] parse failed:", result.error);
  return NextResponse.json({ error: result.error }, { status: 422 });
}

  const { title, category, meta_description, author, body } = result.article;
  const slug = slugify(title, { lower: true, strict: true }).slice(0, 100);

  const { data: draft, error: insertErr } = await supabaseAdmin
    .from("content")
    .insert({
      type: "blog",
      title,
      slug,
      body,
      meta_description,
      category,
      status: "draft",
      author,
    })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ draft }, { status: 201 });
}