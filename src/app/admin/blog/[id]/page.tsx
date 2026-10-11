import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import AdminBlogEditClient from "@/components/admin/AdminBlogEditClient";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: Params) {
  const { id } = await params;
  const { data: post } = await supabaseAdmin
    .from("content")
    .select("*")
    .eq("id", id)
    .eq("type", "blog")
    .single();

  if (!post) notFound();

  return (
    <AdminBlogEditClient
      post={{
        ...post,
        title: post.title ?? "",
        slug: post.slug ?? "",
        status: post.status ?? "draft",
      }}
    />
  );
}
