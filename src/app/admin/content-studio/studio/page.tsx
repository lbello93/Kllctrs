"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, MessageSquare, Search, Sparkles, Video } from "lucide-react";

import {
  DEFAULT_ACCENT,
  DEFAULT_BG,
  KLLCTRS_BRAND,
  type StudioInput,
} from "@/lib/content-studio";

import { SearchPanel } from "./components/search-panel";
import { PostsPanel } from "./components/posts-panel";
import { ImagesPanel } from "./components/images-panel";
import { VideoPanel } from "./components/video-panel";

type TabId = "research" | "posts" | "images" | "video";

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "research", label: "Research", Icon: Search },
  { id: "posts", label: "Social Posts", Icon: MessageSquare },
  { id: "images", label: "Images", Icon: ImageIcon },
  { id: "video", label: "Video Prompts", Icon: Video },
];

const CREAM = KLLCTRS_BRAND.colors.cream;

const INITIAL: StudioInput = {
  topic: "",
  contentType: "event-promo",
  audience: "general",
  tone: "educational",
  keyPoints: [],
  stats: [],
  hashtags: [],
  brand: KLLCTRS_BRAND.name,
  tagline: KLLCTRS_BRAND.tagline,
  website: KLLCTRS_BRAND.url,
  accent: DEFAULT_ACCENT,
  bg: DEFAULT_BG,
};

export default function ContentStudioPage() {
  const [tab, setTab] = useState<TabId>("research");
  const [input, setInput] = useState<StudioInput>(INITIAL);

  const patch = (p: Partial<StudioInput>) => setInput((prev) => ({ ...prev, ...p }));
  const reset = () => {
    setInput(INITIAL);
    setTab("research");
  };

  const hasContent = input.topic.trim().length > 0;

  return (
    <div className="rounded-2xl border border-white/10 p-4 shadow-xl sm:p-6" style={{ background: DEFAULT_BG }}>
      <div className="mx-auto max-w-6xl">
        {/* Tool switcher — back to the classic content generator */}
        <Link
          href="/admin/content-studio"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="size-4" /> Content generator
        </Link>

        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{ background: `${DEFAULT_ACCENT}26`, border: `1px solid ${DEFAULT_ACCENT}55` }}
            >
              <Sparkles className="size-5" style={{ color: DEFAULT_ACCENT }} />
            </div>
            <div>
              <h1 className="font-space-grotesk text-xl font-bold" style={{ color: CREAM }}>
                Prompt Studio
              </h1>
              <p className="text-xs text-white/40">KLLCTRS · Research → Posts → Images → Video</p>
            </div>
            {hasContent && (
              <span className="ml-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                {input.topic}
              </span>
            )}
          </div>
          <button
            onClick={reset}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5"
          >
            New
          </button>
        </header>

        {/* Tabs */}
        <nav className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "" : "text-white/60 hover:text-white"
                }`}
                style={active ? { background: DEFAULT_ACCENT, color: CREAM } : undefined}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Panels */}
        {tab === "research" && <SearchPanel input={input} patch={patch} />}

        {tab !== "research" && !hasContent ? (
          <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-white/40">
            Enter a topic in the Research tab first.
          </div>
        ) : (
          <>
            {tab === "posts" && <PostsPanel input={input} />}
            {tab === "images" && <ImagesPanel input={input} />}
            {tab === "video" && <VideoPanel input={input} />}
          </>
        )}
      </div>
    </div>
  );
}
