"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Newspaper,
  Sparkles,
  Loader2,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import ArticleUploadCard from "@/components/admin/content/ArticleUploadCard";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  published_at: string | null;
  source_event_id: string | null;
  meta_description: string | null;
}

interface EventOption {
  id: string;
  name: string;
  date_start: string;
  city: string;
  state: string;
}

interface Props {
  initialPosts: Post[];
  availableEvents: EventOption[];
  currentStatus: string;
}

const TABS = [
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function AdminBlogClient({
  initialPosts,
  availableEvents,
  currentStatus,
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [busy, setBusy] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleGenerate = async () => {
    if (!selectedEvent) return;
    setGenerating(true);
    const res = await fetch("/api/admin/blog/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: selectedEvent }),
    });
    setGenerating(false);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Generation failed");
      return;
    }
    setPosts((prev) => [data.draft, ...prev]);
    setSelectedEvent("");
    toast.success("Draft generated! Switch to Drafts tab to review.");
  };

  const handleAction = async (
    id: string,
    action: "publish" | "unpublish" | "delete",
  ) => {
    setBusy(id);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: action === "delete" ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body:
        action === "delete"
          ? undefined
          : JSON.stringify({
              status: action === "publish" ? "published" : "draft",
            }),
    });
    setBusy(null);
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error ?? "Action failed");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const inputClass =
    "w-full h-10 px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Blog
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          Generate, review, and publish AI-written event coverage
        </p>
      </div>

      {/* Generate new draft + Upload PDF, side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-4">
            Generate New Draft
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-[#4a3f6b]/60 block mb-1.5">
                Pick an event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className={inputClass}
              >
                <option value="">Select event...</option>
                {availableEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} — {format(new Date(ev.date_start), "MMM d, yyyy")}{" "}
                    ({ev.city}, {ev.state})
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              onClick={handleGenerate}
              disabled={!selectedEvent || generating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-10 px-5 rounded-xl text-sm font-black text-white flex items-center gap-2 border-0 shadow-lg shadow-violet-500/20 disabled:opacity-40 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
              }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Draft
                </>
              )}
            </motion.button>
          </div>
        </div>

        <ArticleUploadCard />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-violet-100">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/admin/blog?status=${t.value}`}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
              currentStatus === t.value
                ? "border-[#5f2eea] text-[#5f2eea]"
                : "border-transparent text-[#4a3f6b]/40 hover:text-[#1a0a3d]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-5 h-5 text-[#5f2eea]/40" />
          </div>
          <p className="text-sm font-bold text-[#1a0a3d]">
            No {currentStatus} posts
          </p>
          <p className="text-xs text-[#4a3f6b]/40 mt-1">
            {currentStatus === "draft"
              ? "Generate a draft above, or upload one, to get started."
              : "Nothing here yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-sm shadow-violet-200/20 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Newspaper className="w-4 h-4 text-[#5f2eea]/40 shrink-0" />
                    <h3 className="font-bold text-[#1a0a3d] line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                  {post.meta_description && (
                    <p className="text-sm text-[#4a3f6b]/55 mb-2 line-clamp-2">
                      {post.meta_description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-[#4a3f6b]/35">
                    <span>
                      Created {format(new Date(post.created_at), "MMM d, yyyy")}
                    </span>
                    {post.published_at && (
                      <span>
                        Published{" "}
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                    <span className="font-mono">/{post.slug}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="h-9 px-3 rounded-xl border border-violet-200 text-xs font-bold text-[#5f2eea] inline-flex items-center gap-1.5 hover:bg-violet-50 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Link>

                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="h-9 px-3 rounded-xl border border-violet-200 text-xs font-bold text-[#4a3f6b]/60 inline-flex items-center gap-1.5 hover:bg-violet-50 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </Link>
                  )}

                  {post.status === "draft" && (
                    <button
                      onClick={() => handleAction(post.id, "publish")}
                      disabled={busy === post.id}
                      className="h-9 px-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-black flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === post.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Publish
                    </button>
                  )}

                  {post.status === "published" && (
                    <button
                      onClick={() => handleAction(post.id, "unpublish")}
                      disabled={busy === post.id}
                      className="h-9 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === post.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      Unpublish
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm("Delete permanently?"))
                        handleAction(post.id, "delete");
                    }}
                    disabled={busy === post.id}
                    className="h-9 px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
