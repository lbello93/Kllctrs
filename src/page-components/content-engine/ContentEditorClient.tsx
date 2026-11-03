"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Loader2, Pencil } from "lucide-react";

import ArticleMarkdown from "@/page-components/BlogPage/ArticleMarkdown";
import { STATUS_META, typeLabel, type EditableContent } from "./types";

const field =
  "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-[#1a0a3d] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30";
const labelCls = "mb-1 block text-xs font-bold text-[#4a3f6b]/70";

export default function ContentEditorClient({ post }: { post: EditableContent }) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [tagsInput, setTagsInput] = useState(post.tags.join(", "));
  const [seoTitle, setSeoTitle] = useState(post.seo_title);
  const [seoDescription, setSeoDescription] = useState(post.seo_description || post.meta_description);
  const [status, setStatus] = useState(post.status);

  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState<null | "draft" | "publish">(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const save = async (nextStatus: "draft" | "review" | "published") => {
    setSaving(nextStatus === "published" ? "publish" : "draft");
    setMessage(null);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#+/, ""))
      .filter(Boolean);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          excerpt,
          tags,
          seo_title: seoTitle,
          seo_description: seoDescription,
          meta_description: seoDescription,
          status: nextStatus,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ kind: "err", text: data.error ?? "Save failed." });
        return;
      }
      setStatus(nextStatus === "review" ? "review" : nextStatus === "published" ? "published" : "draft");
      setMessage({
        kind: "ok",
        text: nextStatus === "published" ? "Published." : "Saved.",
      });
      router.refresh();
    } catch {
      setMessage({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setSaving(null);
    }
  };

  const meta = STATUS_META[status];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B18BE] hover:underline">
        <ArrowLeft className="h-4 w-4" /> Content Engine
      </Link>

      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-[#1a0a3d]">Edit content</h1>
          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700">
            {typeLabel(post.type)}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.className}`}>{meta.label}</span>
          {post.is_ai_generated && (
            <span className="text-[10px] font-bold uppercase text-[#5f2eea]">AI-generated</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => save("draft")}
            disabled={saving !== null}
            className="rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-[#4a3f6b] hover:bg-violet-50 disabled:opacity-50"
          >
            {saving === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Draft"}
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving !== null}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
          >
            {saving === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
          </button>
        </div>
      </header>

      {message && (
        <div
          className={`mb-4 rounded-xl border p-3 text-sm ${
            message.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Main editor */}
        <div className="space-y-4 rounded-2xl border border-violet-100 bg-white p-5">
          <div>
            <label className={labelCls} htmlFor="ed-title">Title</label>
            <input id="ed-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className={labelCls} htmlFor="ed-body">Body (Markdown)</label>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B18BE] hover:underline"
              >
                {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <article className="prose prose-sm max-w-none rounded-lg border border-violet-100 bg-[#faf9ff] p-4 prose-headings:text-[#1a0a3d] prose-a:text-[#5B18BE]">
                <ArticleMarkdown body={body || "_Nothing to preview yet._"} />
              </article>
            ) : (
              <textarea
                id="ed-body"
                className={`${field} min-h-[420px] font-mono text-xs leading-relaxed`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Meta sidebar */}
        <div className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-violet-100 bg-white p-5">
            <div>
              <label className={labelCls} htmlFor="ed-excerpt">Excerpt</label>
              <textarea id="ed-excerpt" rows={3} className={field} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ed-tags">Tags (comma-separated)</label>
              <input id="ed-tags" className={field} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="cards, events, pokemon" />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-violet-100 bg-white p-5">
            <h3 className="text-sm font-black text-[#1a0a3d]">SEO</h3>
            <div>
              <label className={labelCls} htmlFor="ed-seo-title">SEO title</label>
              <input id="ed-seo-title" className={field} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ed-seo-desc">SEO / meta description</label>
              <textarea id="ed-seo-desc" rows={3} className={field} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-5">
            <label className={labelCls} htmlFor="ed-status">Status</label>
            <select
              id="ed-status"
              className={field}
              value={status}
              onChange={(e) => save(e.target.value === "review" ? "review" : e.target.value === "published" ? "published" : "draft")}
            >
              <option value="draft">Draft</option>
              <option value="review">In review</option>
              <option value="published">Published</option>
            </select>
            <p className="mt-2 text-xs text-[#4a3f6b]/50">Changing status saves immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
