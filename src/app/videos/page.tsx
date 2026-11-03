import type { Metadata } from "next";
import Link from "next/link";
import { Film } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Videos",
  description: "Motion-graphic recaps, event previews, and sponsor spotlights from KLLCTRS.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Videos | KLLCTRS",
    description: "Motion-graphic recaps, event previews, and sponsor spotlights from KLLCTRS.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  news: "Breaking News",
  sponsor: "Sponsor Spotlight",
  event: "Event Preview",
  recap: "Weekly Recap",
};

export default async function VideosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content")
    .select("id,title,slug,video_url,video_type,video_duration,published_at")
    .eq("type", "video")
    .eq("status", "published")
    .not("video_url", "is", null)
    .order("published_at", { ascending: false })
    .limit(60);

  const videos = data ?? [];

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-[#1a0a3d]">
            <Film className="h-7 w-7 text-[#5f2eea]" /> Videos
          </h1>
          <p className="mt-1 text-sm text-[#4a3f6b]/70">
            Motion-graphic recaps, event previews, and sponsor spotlights.
          </p>
        </header>

        {videos.length === 0 ? (
          <p className="rounded-2xl border border-violet-100 bg-white p-8 text-center text-sm text-[#4a3f6b]/50">
            No published videos yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <article key={v.id} className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
                <video
                  src={v.video_url ?? undefined}
                  controls
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                />
                <div className="p-4">
                  <span className="text-xs font-bold text-[#5f2eea]">
                    {TYPE_LABEL[v.video_type ?? ""] ?? "Video"}
                  </span>
                  <h2 className="mt-1 font-black text-[#1a0a3d]">{v.title ?? "Untitled"}</h2>
                  {v.slug && (
                    <Link href={`/blog/${v.slug}`} className="mt-2 inline-block text-sm font-semibold text-[#5B18BE] hover:underline">
                      Read more
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
