"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, CheckCircle2, Loader2, Clock, Copy, Share2, RefreshCw, ExternalLink } from "lucide-react";
import LinkedInPreview from "@/page-components/AdminPage/LinkedInPreview";
import type { Json } from "@/types/database";

interface SocialDrafts {
  instagram: { caption: string; carousel_slides: string[]; hashtags: string[]; visual_brief: string };
  linkedin: { post: string; hashtags: string[] };
  generated_at?: string;
}

function parseSocialDrafts(value: Json | null | undefined): SocialDrafts | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, Json | undefined>;
  const instagram = data.instagram;
  const linkedin = data.linkedin;
  if (!instagram || typeof instagram !== "object" || Array.isArray(instagram) || !linkedin || typeof linkedin !== "object" || Array.isArray(linkedin)) return null;
  const ig = instagram as Record<string, Json | undefined>;
  const li = linkedin as Record<string, Json | undefined>;
  if (typeof ig.caption !== "string" || typeof li.post !== "string") return null;
  return {
    instagram: {
      caption: ig.caption,
      carousel_slides: Array.isArray(ig.carousel_slides) ? ig.carousel_slides.filter((x): x is string => typeof x === "string") : [],
      hashtags: Array.isArray(ig.hashtags) ? ig.hashtags.filter((x): x is string => typeof x === "string") : [],
      visual_brief: typeof ig.visual_brief === "string" ? ig.visual_brief : "",
    },
    linkedin: {
      post: li.post,
      hashtags: Array.isArray(li.hashtags) ? li.hashtags.filter((x): x is string => typeof x === "string") : [],
    },
    generated_at: typeof data.generated_at === "string" ? data.generated_at : undefined,
  };
}

interface Props {
  post: {
    id: string;
    title: string;
    slug: string;
    body: string;
    meta_description: string | null;
    status: string;
    author: string | null;
    category?: string | null;
    social_drafts?: Json | null;
    source_links?: Json | null;
  };
}

export default function AdminBlogEditClient({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [metaDesc, setMetaDesc] = useState(post.meta_description ?? "");
  const [body, setBody] = useState(post.body);
  const [category, setCategory] = useState(post.category ?? "card");
  const [socialDrafts, setSocialDrafts] = useState<SocialDrafts | null>(() => parseSocialDrafts(post.social_drafts));
  const [generatingSocial, setGeneratingSocial] = useState(false);
  const [socialTab, setSocialTab] = useState<"instagram" | "linkedin">("instagram");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const sourceLinks = Array.isArray(post.source_links)
    ? post.source_links.filter((item): item is { title: string; url: string; checked_at?: string } =>
        !!item && typeof item === "object" && !Array.isArray(item) &&
        typeof item.title === "string" && typeof item.url === "string" && /^https?:\/\//i.test(item.url))
    : [];

  const handleSave = async (publish = false) => {
    setSaving(true);
    const update: Record<string, unknown> = {
      title,
      meta_description: metaDesc,
      body,
      category,
      ...(socialDrafts ? { social_drafts: socialDrafts } : {}),
    };
    if (publish) update.status = "published";

    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setSaving(false);

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Save failed");
      return;
    }

    setSavedAt(new Date());
    if (publish) router.push("/admin/blog?status=published");
  };

  const generateSocial = async () => {
    setGeneratingSocial(true);
    try {
      const response = await fetch(`/api/admin/blog/${post.id}/social`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Generation failed");
      setSocialDrafts(data.social_drafts as SocialDrafts);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not generate social drafts.");
    } finally {
      setGeneratingSocial(false);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const inputClass =
    "w-full px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-xs font-medium text-[#4a3f6b]/60 block mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Posts
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#4a3f6b]/40">
          <span
            className={`px-2 py-0.5 rounded-full font-bold capitalize ${
              post.status === "published"
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-violet-50 text-[#5f2eea] border border-violet-200"
            }`}
          >
            {post.status}
          </span>
          {savedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6 space-y-5">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
          Edit Post
        </h2>

        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputClass} h-11 font-bold text-base`}
          />
        </div>

        {/* Meta description */}
        <div>
          <label className={labelClass}>Content category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} h-10`}>
            <option value="card">Card collecting</option><option value="brands">Brands</option><option value="editorial">Editorial</option><option value="community">Community</option><option value="market_intel">Market intelligence</option>
          </select>
        </div>

        {/* Meta description */}
        <div>
          <label className={labelClass}>
            Meta Description ({metaDesc.length}/155)
            <span
              className={`ml-2 ${metaDesc.length > 140 ? "text-amber-500" : "text-[#4a3f6b]/30"}`}
            >
              {155 - metaDesc.length} left
            </span>
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={2}
            maxLength={155}
            className={`${inputClass} py-2.5 resize-none`}
          />
        </div>

        {/* Body */}
        <div>
          <label className={labelClass}>Body (Markdown)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={24}
            className={`${inputClass} py-3 font-mono text-xs leading-relaxed resize-y`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-violet-100">
          <motion.button
            onClick={() => handleSave(false)}
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-5 rounded-xl border border-violet-200 text-sm font-bold text-[#4a3f6b] hover:bg-violet-50 flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </motion.button>

          <motion.button
            onClick={() => handleSave(true)}
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-5 rounded-xl text-sm font-black text-white flex items-center gap-2 border-0 shadow-lg shadow-green-500/20 disabled:opacity-50 cursor-pointer transition-colors bg-green-500 hover:bg-green-600"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Save & Publish
          </motion.button>
        </div>
      </div>

      {sourceLinks.length > 0 && <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
        <h2 className="text-sm font-black text-[#1a0a3d]">Research sources · verify before publishing</h2>
        <p className="mt-1 text-xs text-[#4a3f6b]/60">Search results are starting points. Confirm the transaction type, date, price, card identity, and grade against the original source.</p>
        <ul className="mt-3 space-y-2">{sourceLinks.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#5f2eea] hover:underline">{source.title}<ExternalLink className="h-3.5 w-3.5" /></a>{source.checked_at && <span className="ml-2 text-[11px] text-[#4a3f6b]/45">Checked {new Date(source.checked_at).toLocaleString()}</span>}</li>)}</ul>
      </section>}

      <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white/90 shadow-lg shadow-violet-200/20">
        <div className="flex flex-col gap-4 border-b border-violet-100 bg-violet-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#5f2eea]"><Share2 className="h-4 w-4" /> Social content studio</p><p className="mt-1 text-sm text-[#4a3f6b]/65">Generate platform-specific copy from this article, review it, then copy it into the social app.</p></div>
          <button onClick={generateSocial} disabled={generatingSocial} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5f2eea] px-4 text-xs font-bold text-white transition hover:bg-[#4a1fa8] disabled:opacity-50">{generatingSocial ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}{socialDrafts ? "Regenerate drafts" : "Generate social drafts"}</button>
        </div>
        {socialDrafts ? <div className="p-5">
          <div className="mb-4 flex gap-2"><button onClick={() => setSocialTab("instagram")} className={`rounded-full px-4 py-2 text-xs font-bold ${socialTab === "instagram" ? "bg-[#5f2eea] text-white" : "bg-violet-50 text-[#4a3f6b]"}`}>Instagram</button><button onClick={() => setSocialTab("linkedin")} className={`rounded-full px-4 py-2 text-xs font-bold ${socialTab === "linkedin" ? "bg-[#5f2eea] text-white" : "bg-violet-50 text-[#4a3f6b]"}`}>LinkedIn</button></div>
          {socialTab === "instagram" ? <div className="space-y-4">
            <label className={labelClass}>Caption<textarea value={socialDrafts.instagram.caption} onChange={(e) => setSocialDrafts((current) => current ? { ...current, instagram: { ...current.instagram, caption: e.target.value } } : current)} rows={7} className={`${inputClass} mt-1 py-3`} /></label>
            <label className={labelClass}>Carousel slide copy <span className="font-normal">(one slide per line)</span><textarea value={socialDrafts.instagram.carousel_slides.join("\n")} onChange={(e) => setSocialDrafts((current) => current ? { ...current, instagram: { ...current.instagram, carousel_slides: e.target.value.split("\n") } } : current)} rows={6} className={`${inputClass} mt-1 py-3`} /></label>
            <label className={labelClass}>Hashtags<input value={socialDrafts.instagram.hashtags.join(" ")} onChange={(e) => setSocialDrafts((current) => current ? { ...current, instagram: { ...current.instagram, hashtags: e.target.value.split(/\s+/).filter(Boolean) } } : current)} className={`${inputClass} mt-1 h-10`} /></label>
            <label className={labelClass}>Visual direction<textarea value={socialDrafts.instagram.visual_brief} onChange={(e) => setSocialDrafts((current) => current ? { ...current, instagram: { ...current.instagram, visual_brief: e.target.value } } : current)} rows={2} className={`${inputClass} mt-1 py-2`} /></label>
            <button onClick={() => copyText(`${socialDrafts.instagram.caption}\n\n${socialDrafts.instagram.hashtags.join(" ")}`)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-4 text-xs font-bold text-[#5f2eea]"><Copy className="h-3.5 w-3.5" />Copy Instagram caption</button>
            <button onClick={() => copyText(socialDrafts.instagram.carousel_slides.map((slide, index) => `Slide ${index + 1}: ${slide}`).join("\n"))} className="ml-2 inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-4 text-xs font-bold text-[#5f2eea]"><Copy className="h-3.5 w-3.5" />Copy slide text</button>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-orange-400 px-4 text-xs font-bold text-white"><ExternalLink className="h-3.5 w-3.5" />Open Instagram</a>
          </div> : <div className="space-y-4">
            <label className={labelClass}>LinkedIn post<textarea value={socialDrafts.linkedin.post} onChange={(e) => setSocialDrafts((current) => current ? { ...current, linkedin: { ...current.linkedin, post: e.target.value } } : current)} rows={9} className={`${inputClass} mt-1 py-3`} /></label>
            <p className={`text-right text-xs ${socialDrafts.linkedin.post.length > 3000 ? "text-red-600" : "text-[#4a3f6b]/45"}`}>{socialDrafts.linkedin.post.length} / 3,000 characters</p>
            <label className={labelClass}>Hashtags<input value={socialDrafts.linkedin.hashtags.join(" ")} onChange={(e) => setSocialDrafts((current) => current ? { ...current, linkedin: { ...current.linkedin, hashtags: e.target.value.split(/\s+/).filter(Boolean) } } : current)} className={`${inputClass} mt-1 h-10`} /></label>
            <button onClick={() => copyText(`${socialDrafts.linkedin.post}\n\n${socialDrafts.linkedin.hashtags.join(" ")}`)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-4 text-xs font-bold text-[#5f2eea]"><Copy className="h-3.5 w-3.5" />Copy LinkedIn post</button>
            <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0a66c2] px-4 text-xs font-bold text-white"><ExternalLink className="h-3.5 w-3.5" />Open LinkedIn</a>
          </div>}
          <p className="mt-5 border-t border-violet-100 pt-4 text-[10px] leading-4 text-[#4a3f6b]/45">AI-generated drafts need editorial and factual review before posting. Social text is saved with this article when you save it.</p>
        </div> : <p className="p-5 text-xs text-[#4a3f6b]/50">Generate Instagram and LinkedIn versions once the article is ready for promotion.</p>}
      </section>

      <LinkedInPreview title={title} description={metaDesc} slug={post.slug} />
    </div>
  );
}
