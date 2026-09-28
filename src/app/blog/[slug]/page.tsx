import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import slugify from "slugify";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";
import { CATEGORY_CONFIG } from "@/components/content/config/categoryConfig";
import ArticleProgressBar from "@/components/content/ArticleProgressBar";
import BackToTopButton from "@/components/content/BackToTopButton";
import ArticleShareBar from "@/components/content/ArticleShareBar";
import ArticleTableOfContents from "@/components/content/ArticleTableOfContents";
import ArticleMarkdown from "@/components/content/ArticleMarkdown";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("content")
    .select("title, meta_description")
    .eq("type", "blog")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Post Not Found | KLLCTRS" };

  return {
    title: `${data.title} | KLLCTRS`,
    description: data.meta_description ?? "",
    openGraph: {
      title: data.title,
      description: data.meta_description ?? "",
      type: "article",
    },
  };
}

function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractHeadings(markdown: string) {
  const lines = markdown.split("\n");
  const headings: { id: string; text: string; level: number }[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text, { lower: true, strict: true });
      headings.push({ id, text, level });
    }
  }

  return headings;
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("content")
    .select("*")
    .eq("type", "blog")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const categoryKey = (post.category || "card")
    .toLowerCase()
    .replace(/\s+/g, "_") as keyof typeof CATEGORY_CONFIG;
  const categoryConfig = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG.card;
  const readingMinutes = estimateReadingTime(post.body ?? "");
  const headings = extractHeadings(post.body ?? "");

  let sourceEvent = null;
  if (post.source_event_id) {
    const { data } = await supabase
      .from("events")
      .select("name, slug, city, state, date_start")
      .eq("id", post.source_event_id)
      .eq("status", "approved")
      .single();
    sourceEvent = data;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description ?? "",
    author: {
      "@type": "Organization",
      name: post.author ?? "KLLCTRS Editorial",
    },
    publisher: { "@type": "Organization", name: "KLLCTRS" },
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleProgressBar />
      <BackToTopButton />

      <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
        {/* Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
        </div>

        {/* Header nav */}
        <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Posts
            </Link>
          </div>
        </div>

        <article className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Hero card */}
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30">
            {/* Category banner */}
            <div className="relative h-[80px] w-full">
              <Image
                src={categoryConfig.image}
                alt={categoryConfig.label}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute left-6 top-6">
                <span
                  className={`flex h-[26px] items-center justify-center rounded-[10px] border px-3 text-xs font-medium ${categoryConfig.bg} ${categoryConfig.border} ${categoryConfig.text}`}
                >
                  {categoryConfig.label}
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-[#1a0a3d] tracking-tight leading-tight mb-5">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#4a3f6b]/50 pb-4">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {post.author ?? "KLLCTRS Editorial"}
                </span>
                {post.published_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {readingMinutes} Min{readingMinutes === 1 ? "" : "s"} Read
                </span>
              </div>

              {/* Share row */}
              <div className="pb-6 border-b border-violet-100">
                <ArticleShareBar title={post.title} />
              </div>

              {/* Table of contents */}
              {headings.length >= 2 && (
                <div className="mt-6">
                  <ArticleTableOfContents headings={headings} />
                </div>
              )}

              {/* Body */}
              <div
                className="prose prose-violet max-w-none mt-6
                prose-headings:font-black prose-headings:text-[#1a0a3d] prose-headings:tracking-tight prose-headings:scroll-mt-28
                prose-p:text-[#4a3f6b]/70 prose-p:leading-relaxed
                prose-a:text-[#5f2eea] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#1a0a3d] prose-strong:font-bold
                prose-li:text-[#4a3f6b]/70
                prose-hr:border-violet-100
                prose-blockquote:border-[#5f2eea] prose-blockquote:text-[#4a3f6b]/60
                prose-code:text-[#5f2eea] prose-code:bg-violet-50 prose-code:rounded prose-code:px-1"
              >
                <ArticleMarkdown body={post.body} />
              </div>
            </div>
          </div>

          {/* Source event CTA */}
          {sourceEvent && (
            <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6">
              <p className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-3">
                Featured Event
              </p>
              <h3 className="text-lg font-black text-[#1a0a3d] mb-1">
                {sourceEvent.name}
              </h3>
              <p className="text-sm text-[#4a3f6b]/50 mb-4">
                {format(new Date(sourceEvent.date_start), "MMMM d, yyyy")} ·{" "}
                {sourceEvent.city}, {sourceEvent.state}
              </p>
              <Link
                href={`/events/${sourceEvent.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-black text-white px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/20"
                style={{
                  background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                }}
              >
                View Event Details <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Footer CTA */}
          <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6 text-center">
            <p className="text-sm text-[#4a3f6b]/50 mb-3">
              Find more card shows and shops on KLLCTRS
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/events"
                className="text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors inline-flex items-center gap-1"
              >
                Browse Events <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[#4a3f6b]/20">·</span>
              <Link
                href="/blog"
                className="text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors inline-flex items-center gap-1"
              >
                All Posts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
