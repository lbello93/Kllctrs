import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import ArticleMarkdown from "@/page-components/BlogPage/ArticleMarkdown";
import ArticleProgressBar from "@/page-components/BlogPage/ArticleProgressBar";
import ArticleShareBar from "@/page-components/BlogPage/ArticleShareBar";
import { typeLabel } from "@/page-components/content-engine/types";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ slug: string }>;
}

const POST_COLUMNS =
  "id,title,slug,body,excerpt,meta_description,seo_title,seo_description,type,category,tags,author,published_at,updated_at,related_event_id,related_sponsor_id";

async function loadPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

function readingTime(body: string | null): number {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Post not found" };

  const title = post.seo_title || post.title || "KLLCTRS";
  const description = post.seo_description || post.meta_description || post.excerpt || undefined;
  return {
    title,
    description,
    keywords: post.tags ?? undefined,
    openGraph: { title, description: description ?? undefined, type: "article" },
    twitter: { card: "summary_large_image", title, description: description ?? undefined },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const supabase = await createClient();

  // Related posts: shared tags or same type, published, excluding this one.
  const { data: relatedRaw } = await supabase
    .from("content")
    .select("id,title,slug,excerpt,type,published_at")
    .eq("status", "published")
    .neq("id", post.id)
    .or(
      post.tags && post.tags.length
        ? `type.eq.${post.type},tags.ov.{${post.tags.map((t) => `"${t}"`).join(",")}}`
        : `type.eq.${post.type}`,
    )
    .order("published_at", { ascending: false })
    .limit(3);
  const related = relatedRaw ?? [];

  // Optional related event / sponsor links.
  const [eventRes, sponsorRes] = await Promise.all([
    post.related_event_id
      ? supabase.from("events").select("name,slug").eq("id", post.related_event_id).maybeSingle()
      : Promise.resolve({ data: null }),
    post.related_sponsor_id
      ? supabase.from("sponsors").select("id,name").eq("id", post.related_sponsor_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const relatedEvent = eventRes.data;
  const relatedSponsor = sponsorRes.data;

  const published = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <ArticleProgressBar />
      <article className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B18BE] hover:underline">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <header className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700">
              {typeLabel(post.type)}
            </span>
            {(post.tags ?? []).slice(0, 4).map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-[#4a3f6b]/70 ring-1 ring-violet-100 hover:bg-violet-50"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#1a0a3d]">{post.title}</h1>
          {post.excerpt && <p className="mt-2 text-lg text-[#4a3f6b]/70">{post.excerpt}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#4a3f6b]/50">
            {post.author && <span>{post.author}</span>}
            {published && <span>· {published}</span>}
            <span>· {readingTime(post.body)} min read</span>
          </div>
        </header>

        <div className="mb-6">
          <ArticleShareBar title={post.title ?? "KLLCTRS"} />
        </div>

        <div className="prose prose-base max-w-none prose-headings:text-[#1a0a3d] prose-headings:font-black prose-a:text-[#5B18BE] prose-strong:text-[#1a0a3d]">
          <ArticleMarkdown body={post.body ?? ""} />
        </div>

        {(relatedEvent || relatedSponsor) && (
          <div className="mt-8 space-y-2">
            {relatedEvent?.slug && (
              <Link
                href={`/maps/events/${relatedEvent.slug}`}
                className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white p-3 text-sm font-semibold text-[#1a0a3d] hover:bg-violet-50"
              >
                <CalendarDays className="h-4 w-4 text-[#5f2eea]" />
                Featured event: {relatedEvent.name}
              </Link>
            )}
            {relatedSponsor?.id && (
              <Link
                href={`/sponsors/${relatedSponsor.id}`}
                className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white p-3 text-sm font-semibold text-[#1a0a3d] hover:bg-violet-50"
              >
                <Trophy className="h-4 w-4 text-[#5f2eea]" />
                Featured sponsor: {relatedSponsor.name}
              </Link>
            )}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-10 border-t border-violet-100 pt-6">
            <h2 className="mb-3 text-lg font-black text-[#1a0a3d]">Related posts</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="rounded-2xl border border-violet-100 bg-white p-4 transition-colors hover:border-violet-300"
                >
                  <span className="text-xs font-bold text-[#5f2eea]">{typeLabel(r.type)}</span>
                  <h3 className="mt-1 line-clamp-2 text-sm font-black text-[#1a0a3d]">{r.title}</h3>
                  {r.excerpt && <p className="mt-1 line-clamp-2 text-xs text-[#4a3f6b]/60">{r.excerpt}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
