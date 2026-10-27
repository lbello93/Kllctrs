"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Eye,
  MousePointerClick,
  Globe,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  slug: string;
  category: string;
  tier?: string | null;
  description?: string | null;
  website?: string | null;
  tagline?: string | null;
  offerings?: string[] | null;
  product_categories?: string[] | null;
  target_audience?: string[] | null;
  service_area?: string | null;
  info_source_url?: string | null;
  info_verified_at?: string | null;
  profile_views?: number | null;
  website_clicks?: number | null;
}

interface Props {
  initialSponsors: Sponsor[];
}

const TIER_COLORS: Record<string, string> = {
  platinum: "bg-slate-100 text-slate-700 border-slate-300",
  gold: "bg-amber-50 text-amber-700 border-amber-200",
  silver: "bg-gray-100 text-gray-600 border-gray-300",
  bronze: "bg-orange-50 text-orange-700 border-orange-200",
};

const CATEGORY_LABELS: Record<string, string> = {
  grading: "Grading",
  grading_company: "Grading",
  auction: "Auctions",
  manufacturer: "Manufacturer",
  card_manufacturer: "Manufacturer",
  marketplace: "Marketplace",
  breaker: "Breakers",
  shop: "Shop",
  software: "Software",
  media: "Media",
  other: "Other",
};

export default function AdminSponsorsClient({ initialSponsors }: Props) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Sponsor>>({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "clicks" | "name">("views");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const totalViews = sponsors.reduce((s, sp) => s + (sp.profile_views ?? 0), 0);
  const totalClicks = sponsors.reduce(
    (s, sp) => s + (sp.website_clicks ?? 0),
    0,
  );

  const filtered = [...sponsors]
    .filter(
      (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      if (sortBy === "views")
        return ((a.profile_views ?? 0) - (b.profile_views ?? 0)) * dir;
      if (sortBy === "clicks")
        return ((a.website_clicks ?? 0) - (b.website_clicks ?? 0)) * dir;
      return a.name.localeCompare(b.name) * dir;
    });

  const toggleSort = (col: "views" | "clicks" | "name") => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const startEdit = (sp: Sponsor) => {
    setEditing(sp.id);
    setEditData({
      name: sp.name,
      description: sp.description ?? "",
      website: sp.website ?? "",
      tier: sp.tier ?? "",
      category: sp.category,
      tagline: sp.tagline ?? "",
      offerings: sp.offerings ?? [],
      product_categories: sp.product_categories ?? [],
      target_audience: sp.target_audience ?? [],
      service_area: sp.service_area ?? "",
      info_source_url: sp.info_source_url ?? "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditData({});
  };

  const handleSave = async (id: string) => {
    setBusy(id);
    const res = await fetch(`/api/admin/sponsors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setBusy(null);
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    setSponsors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...editData } : s)),
    );
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sponsor permanently?")) return;
    setBusy(id);
    const res = await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  const inputClass =
    "w-full h-9 px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Sponsors
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          Edit profiles and view analytics
        </p>
      </div>

      {/* Analytics summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Sponsors", value: sponsors.length, icon: Trophy },
          {
            label: "Total Profile Views",
            value: totalViews.toLocaleString(),
            icon: Eye,
          },
          {
            label: "Total Website Clicks",
            value: totalClicks.toLocaleString(),
            icon: MousePointerClick,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase">
                {label}
              </span>
              <Icon className="w-4 h-4 text-[#5f2eea]/30" />
            </div>
            <p className="text-3xl font-black text-[#5f2eea]">{value}</p>
          </div>
        ))}
      </div>

      {/* Search + sort */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-4 flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sponsors…"
          className={`${inputClass} flex-1 min-w-[180px]`}
        />
        <div className="flex items-center gap-2 text-xs text-[#4a3f6b]/50 font-medium">
          Sort by:
          {(["views", "clicks", "name"] as const).map((col) => (
            <button
              key={col}
              onClick={() => toggleSort(col)}
              className={`px-3 py-1.5 rounded-lg capitalize border transition-colors cursor-pointer flex items-center gap-1 ${
                sortBy === col
                  ? "bg-[#5f2eea] text-white border-[#5f2eea]"
                  : "border-violet-200 hover:bg-violet-50 text-[#4a3f6b]/60"
              }`}
            >
              {col}
              {sortBy === col &&
                (sortDir === "desc" ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronUp className="w-3 h-3" />
                ))}
            </button>
          ))}
        </div>
      </div>

      {/* Sponsor list */}
      <div className="space-y-3">
        {filtered.map((sp, i) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-sm shadow-violet-200/20 overflow-hidden"
          >
            {editing === sp.id ? (
              /* Edit mode */
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
                    Editing
                  </span>
                  <button
                    onClick={cancelEdit}
                    className="text-[#4a3f6b]/40 hover:text-[#4a3f6b] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">
                      Name
                    </label>
                    <input
                      value={editData.name ?? ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, name: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">
                      Website
                    </label>
                    <input
                      value={editData.website ?? ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, website: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">
                      Tier
                    </label>
                    <select
                      value={editData.tier ?? ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, tier: e.target.value }))
                      }
                      className={inputClass}
                    >
                      <option value="">None</option>
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">
                      Category
                    </label>
                    <select
                      value={editData.category ?? ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, category: e.target.value }))
                      }
                      className={inputClass}
                    >
                      <option value="grading">Grading</option>
                      <option value="auction">Auction</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="breaker">Breaker</option>
                      <option value="shop">Shop</option>
                      <option value="software">Software</option>
                      <option value="media">Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">
                    Description
                  </label>
                  <textarea
                    value={editData.description ?? ""}
                    onChange={(e) =>
                      setEditData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">One-line tagline</label>
                    <input value={editData.tagline ?? ""} onChange={(e) => setEditData((p) => ({ ...p, tagline: e.target.value }))} maxLength={180} className={inputClass} placeholder="What this brand is known for" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">Service area</label>
                    <input value={editData.service_area ?? ""} onChange={(e) => setEditData((p) => ({ ...p, service_area: e.target.value }))} maxLength={240} className={inputClass} placeholder="Online nationwide, or regions served" />
                  </div>
                  {([
                    ["offerings", "Products and services", "Grading, auctions, card supplies"],
                    ["product_categories", "Collecting categories", "Sports cards, Pokémon, comics"],
                    ["target_audience", "Who it serves", "New collectors, advanced collectors"],
                  ] as const).map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">{label} <span className="font-normal">(comma separated)</span></label>
                      <textarea value={(editData[key] ?? []).join(", ")} onChange={(e) => setEditData((p) => ({ ...p, [key]: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} rows={2} className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30" placeholder={placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-medium text-[#4a3f6b]/50 block mb-1">Verification source URL</label>
                    <input value={editData.info_source_url ?? ""} onChange={(e) => setEditData((p) => ({ ...p, info_source_url: e.target.value }))} className={inputClass} placeholder="https://official-brand-site.com/about" />
                    {sp.info_verified_at && <p className="mt-1 text-[10px] text-[#4a3f6b]/45">Last recorded check: {new Date(sp.info_verified_at).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(sp.id)}
                    disabled={busy === sp.id}
                    className="h-9 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-black flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {busy === sp.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="h-9 px-4 rounded-xl border border-violet-200 text-xs font-bold text-[#4a3f6b]/60 hover:bg-violet-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-black text-[#1a0a3d] text-base">
                      {sp.name}
                    </h3>
                    {sp.tier && (
                      <span
                        className={`text-xs font-semibold border px-2 py-0.5 rounded-full capitalize ${TIER_COLORS[sp.tier] ?? TIER_COLORS.silver}`}
                      >
                        {sp.tier}
                      </span>
                    )}
                    <span className="text-xs font-medium bg-violet-50 text-[#5f2eea] border border-violet-200 px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[sp.category] ?? sp.category}
                    </span>
                  </div>
                  {sp.description && (
                    <p className="text-sm text-[#4a3f6b]/55 line-clamp-1 mb-1">
                      {sp.description}
                    </p>
                  )}
                  {sp.website && (
                    <a
                      href={sp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#5f2eea] inline-flex items-center gap-1 hover:text-[#4a1fa8] transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      {sp.website
                        .replace(/^https?:\/\/(www\.)?/, "")
                        .replace(/\/$/, "")}
                    </a>
                  )}
                </div>

                {/* Analytics */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-black text-[#5f2eea]">
                      {(sp.profile_views ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#4a3f6b]/35 uppercase tracking-wider flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" /> Views
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-[#5f2eea]">
                      {(sp.website_clicks ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#4a3f6b]/35 uppercase tracking-wider flex items-center gap-0.5">
                      <MousePointerClick className="w-2.5 h-2.5" /> Clicks
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/brands/${sp.slug}`}
                      target="_blank"
                      className="h-9 px-3 rounded-xl border border-violet-200 text-xs font-bold text-[#4a3f6b]/60 inline-flex items-center gap-1.5 hover:bg-violet-50 transition-colors"
                    >
                      <TrendingUp className="w-3 h-3" /> View
                    </Link>
                    <button
                      onClick={() => startEdit(sp)}
                      className="h-9 px-3 rounded-xl border border-violet-200 text-xs font-bold text-[#5f2eea] inline-flex items-center gap-1.5 hover:bg-violet-50 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sp.id)}
                      disabled={busy === sp.id}
                      className="h-9 px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === sp.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
