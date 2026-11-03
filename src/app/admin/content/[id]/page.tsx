import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/admin";
import ContentEditorClient from "@/page-components/content-engine/ContentEditorClient";
import {
  normalizeStatus,
  type EditableContent,
} from "@/page-components/content-engine/types";

export const metadata = { title: "Admin · Edit Content | KLLCTRS" };
export const dynamic = "force-dynamic";

export default async function AdminContentEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("content")
    .select(
      "id,title,slug,type,status,body,excerpt,tags,seo_title,seo_description,meta_description,is_ai_generated",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const post: EditableContent = {
    id: data.id,
    title: data.title ?? "",
    slug: data.slug,
    type: data.type,
    status: normalizeStatus(data.status),
    body: data.body ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    seo_title: data.seo_title ?? "",
    seo_description: data.seo_description ?? "",
    meta_description: data.meta_description ?? "",
    is_ai_generated: Boolean(data.is_ai_generated),
  };

  return <ContentEditorClient post={post} />;
}
