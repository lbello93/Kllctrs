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
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "KLLCTRS collector story" }],
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

  if (!post?.title) notFound();

  const categoryKey = (post.category || "card")
    .toLowerCase()
    .replace(/\s+/g, "_") as keyof typeof CATEGORY_CONFIG;
  const categoryConfig = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG.card;
  const readingMinutes = estimateReadingTime(post.body ?? "");
  const headings = extractHeadings(post.body ?? "");
  const sourceLinks = Array.isArray(post.source_links)
    ? post.source_links.filter((item): item is { title: string; url: string; checked_at?: string } =>
        !!item && typeof item === "object" && !Array.isArray(item) &&
        typeof item.title === "string" && typeof item.url === "string" && /^https?:\/\//i.test(item.url))
    : [];

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

      <div className="min-h-screen bg-[#F7F5FC] pb-16 pt-24">
        {/* Header nav */}
        <div className="relative z-10">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E5DFFD] bg-white px-4 text-sm font-medium text-[#5B18BE] shadow-sm transition hover:border-[#B39EF9] hover:bg-[#F8F5FF]"
            >
              <ArrowLeft className="h-4 w-4" /> All stories
            </Link>
          </div>
        </div>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-7">
          <article className="order-2 min-w-0 lg:order-1">
          {/* Hero card */}
          <div className="overflow-hidden rounded-2xl border border-[#E5DFFD] bg-white shadow-[0_14px_45px_rgba(21,30,60,0.07)] sm:rounded-3xl">
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

            <div className="p-5 sm:p-8 lg:p-10">
              {/* Title */}
              <h1 className="max-w-3xl break-words font-space-grotesk text-[30px] font-bold leading-[1.12] tracking-[-0.035em] text-[#151E3C] sm:text-4xl lg:text-[44px]">
                {post.title}
              </h1>
              {post.meta_description && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#596078] sm:text-lg sm:leading-8">
                  {post.meta_description}
                </p>
              )}

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#EEE9F7] pb-5 text-xs text-[#596078] sm:text-sm">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  <span className="break-words">{post.author ?? "KLLCTRS Editorial"}</span>
                </span>
                {post.published_at && (
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {readingMinutes} Min{readingMinutes === 1 ? "" : "s"} Read
                </span>
              </div>

              {/* Share row */}
              <div className="flex flex-col gap-3 border-b border-[#EEE9F7] py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#26304B]">Enjoying this story? Share it.</p>
                <ArticleShareBar title={post.title} />
              </div>

              {/* Body */}
              <div
                className="prose prose-violet prose-sm mt-7 max-w-none sm:prose-base
                prose-headings:font-black prose-headings:text-[#1a0a3d] prose-headings:tracking-tight prose-headings:scroll-mt-28
                prose-p:text-[#46506B] prose-p:leading-7 sm:prose-p:leading-8
                prose-a:text-[#5f2eea] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#1a0a3d] prose-strong:font-bold
                prose-li:text-[#46506B] prose-li:leading-7
                prose-hr:border-[#E9E3F4]
                prose-blockquote:border-[#5f2eea] prose-blockquote:text-[#4a3f6b]/60
                prose-code:text-[#5f2eea] prose-code:bg-violet-50 prose-code:rounded prose-code:px-1 prose-table:block prose-table:max-w-full prose-table:overflow-x-auto"
              >
                <ArticleMarkdown body={post.body} />
              </div>
            </div>
          </div>
          </article>

          {headings.length >= 2 && (
            <aside className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24">
              <ArticleTableOfContents headings={headings} />
            </aside>
          )}
          </div>

          <div className="mx-auto mt-5 max-w-4xl space-y-5 lg:mx-0">
          {sourceLinks.length > 0 && (
            <aside className="rounded-2xl border border-[#E5DFFD] bg-white p-5 shadow-[0_8px_28px_rgba(21,30,60,0.04)] sm:p-7" aria-label="Article sources">
              <h2 className="font-space-grotesk text-lg font-semibold text-[#151E3C]">Sources & further reading</h2>
              <p className="mt-1 text-sm leading-6 text-[#596078]">Links checked when this article was researched. Sale details can change as new information emerges.</p>
              <ul className="mt-4 space-y-2">
                {sourceLinks.map((source) => (
                  <li key={source.url} className="min-w-0"><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-start gap-2 break-words text-sm font-medium leading-6 text-[#5B18BE] hover:underline"><span>{source.title}</span><ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" /></a></li>
                ))}
              </ul>
            </aside>
          )}

          {/* Source event CTA */}
          {sourceEvent && (
            <div className="rounded-2xl border border-[#E5DFFD] bg-white p-5 shadow-[0_8px_28px_rgba(21,30,60,0.04)] sm:p-7">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#5f2eea]">
                Featured Event
              </p>
              <h3 className="mb-1 break-words font-space-grotesk text-lg font-semibold text-[#151E3C]">
                {sourceEvent.name}
              </h3>
              <p className="mb-4 text-sm leading-6 text-[#596078]">
                {format(new Date(sourceEvent.date_start), "MMMM d, yyyy")} ·{" "}
                {sourceEvent.city}, {sourceEvent.state}
              </p>
              <Link
                href={`/events/${sourceEvent.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                }}
              >
                View Event Details <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Footer CTA */}
          <div className="rounded-2xl border border-[#E5DFFD] bg-white p-5 text-center shadow-[0_8px_28px_rgba(21,30,60,0.04)] sm:p-7">
            <p className="mb-4 text-sm leading-6 text-[#596078]">
              Find more card shows and shops on KLLCTRS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link
                href="/maps"
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
          </div>
        </main>
      </div>
    </>
  );
}
