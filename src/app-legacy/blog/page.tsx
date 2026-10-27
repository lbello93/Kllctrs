import { createClient } from "@/lib/supabase/server";
import ContentHubClient from "@/page-components/BlogPage/ContentHubClient";

export const metadata = {
  title: "Collector Stories and Guides | KLLCTRS",
  description: "Read collector stories, hobby news, card guides, and market updates from the KLLCTRS community.",
};

export default async function ContentHubPage() {
  const supabase = await createClient();

  const { data: content, error } = await supabase
    .from("content")
    .select(
      `
  id,
  title,
  slug,
  meta_description,
  published_at,
  updated_at,
  author,
  type,
  category
`,
    )

    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    });

  if (error) {
    console.error("Error fetching content:", error);
  }

  const publishableContent = (content ?? []).flatMap((item) =>
    item.title && item.slug
      ? [{ ...item, title: item.title, slug: item.slug }]
      : [],
  );

  return <ContentHubClient initialContent={publishableContent} />;
}
