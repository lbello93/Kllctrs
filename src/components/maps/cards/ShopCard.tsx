"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Globe,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatDistance } from "@/lib/geo/distance";
import type { Shop } from "@/types";

interface Props {
  shop: Shop;
  isSaved: boolean;
  savedShopIds: string[];
  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;
  distanceMiles?: number;
}

export default function ShopCard({
  shop,
  isSaved,
  savedShopIds,
  setSavedShopIds,
  distanceMiles,
}: Props) {
  const supabase = createClient();

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      let updated: string[];

      if (isSaved) {
        updated = savedShopIds.filter((id) => id !== shop.id);
        setSavedShopIds(updated);

        const { error } = await supabase
          .from("profiles")
          .update({ saved_shops: updated })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Removed from Collection");
      } else {
        updated = [...savedShopIds, shop.id];
        setSavedShopIds(updated);

        const { error } = await supabase
          .from("profiles")
          .update({ saved_shops: updated })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Added to Collection ✨", { description: shop.name });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const tags =
    typeof shop.specialty === "string"
      ? shop.specialty
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#F2EFFE] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {distanceMiles != null && (
            <span className="rounded-full bg-[#1F8A4C]/10 px-3 py-1 text-xs font-semibold text-[#1F8A4C]">
              {formatDistance(distanceMiles)}
            </span>
          )}

          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 text-xs font-semibold text-[#8B5CF6]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[#151E3C]">
          {shop.name}
        </h3>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#8B5CF6]">
          <MapPin size={15} className="shrink-0" />
          <span className="font-medium">
            {shop.city}, {shop.state}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 border-t border-[#F2EFFE] px-4 py-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
            isSaved
              ? "bg-violet-50 text-violet-700"
              : "text-[#4a3f6b]/60 hover:bg-[#F2EFFE] hover:text-[#8B5CF6]"
          }`}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {saving ? "Saving..." : isSaved ? "Saved" : "Save"}
        </button>
        <a
          href={shop.website ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-[#4a3f6b]/60 hover:bg-[#F2EFFE] hover:text-[#8B5CF6] transition-colors"
        >
          <Globe size={16} />
          Web
        </a>

        <Link
          href={`/shops/${shop.slug}`}
          className="ml-auto flex h-9 items-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          View Shop
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
