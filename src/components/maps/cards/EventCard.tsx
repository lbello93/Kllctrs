"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import {
  Bookmark,
  BookmarkCheck,
  Globe,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatDistance } from "@/lib/geo/distance";
import type { Event } from "@/types";

interface Props {
  event: Event;
  isSaved: boolean;
  savedEventIds: string[];
  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
  distanceMiles?: number;
}

export default function EventCard({
  event,
  isSaved,
  savedEventIds,
  setSavedEventIds,
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
        updated = savedEventIds.filter((id) => id !== event.id);

        const { error } = await supabase
          .from("profiles")
          .update({ saved_events: updated })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        setSavedEventIds(updated);
        toast.success("Removed from Collection");
        return;
      }

      updated = [...savedEventIds, event.id];

      const { error } = await supabase
        .from("profiles")
        .update({ saved_events: updated })
        .eq("id", user.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      setSavedEventIds(updated);
      toast.success("Added to Collection ✨", { description: event.name });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const sameDay =
    !event.date_end ||
    format(new Date(event.date_start), "yyyy-MM-dd") ===
      format(new Date(event.date_end), "yyyy-MM-dd");

  const dateLabel = sameDay
    ? format(new Date(event.date_start), "MMM d, yyyy")
    : `${format(new Date(event.date_start), "MMM d")} – ${format(new Date(event.date_end!), "MMM d, yyyy")}`;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#F2EFFE] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F0C040]/15 px-3 py-1 text-xs font-semibold text-[#8a6600]">
            Upcoming
          </span>

          {distanceMiles != null && (
            <span className="rounded-full bg-[#1F8A4C]/10 px-3 py-1 text-xs font-semibold text-[#1F8A4C]">
              {formatDistance(distanceMiles)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[#151E3C]">
          {event.name}
        </h3>

        {/* Location */}
        <div className="mt-2 flex items-start gap-1.5 text-sm text-[#8B5CF6]">
          <MapPin size={15} className="mt-0.5 shrink-0" />
          <span className="font-medium">
            {event.venue_name
              ? `${event.venue_name}, ${event.city}, ${event.state}`
              : `${event.city}, ${event.state}`}
          </span>
        </div>

        {/* Date */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#4a3f6b]/70">
          <Calendar size={15} className="shrink-0" />
          <span>{dateLabel}</span>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#4a3f6b]/60">
          {event.vendor_tables
            ? `${event.vendor_tables} vendor tables available.`
            : "Trading cards, vendors, collector meetups and hobby activities."}
        </p>
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
          href={event.website ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-[#4a3f6b]/60 hover:bg-[#F2EFFE] hover:text-[#8B5CF6] transition-colors"
        >
          <Globe size={16} />
          Web
        </a>

        <Link
          href={`/events/${event.slug}`}
          className="ml-auto flex h-9 items-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Details
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
