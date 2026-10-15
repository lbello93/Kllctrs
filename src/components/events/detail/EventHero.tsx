"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Event } from "@/types";

interface Props {
  event: Event;
  isSaved: boolean;
}

export default function EventHero({ event, isSaved: initialSaved }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/events/${event.id}/save`, {
        method: "POST",
      });

      if (res.status === 401) {
        setIsSaved(wasSaved);
        router.push(`/login?redirect=/events/${event.slug}`);
        return;
      }

      if (!res.ok) {
        setIsSaved(wasSaved);
        toast.error("Something went wrong");
        return;
      }

      const data: { saved: boolean } = await res.json();
      setIsSaved(data.saved);
      router.refresh();
    } catch {
      setIsSaved(wasSaved);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(89.06deg, #8B5CF6 0.7%, #151E3C 73.95%)",
      }}
    >
      <Image
        src="/EventSlug/Sho.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#151E3C]/85 via-[#151E3C]/45 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-7xl flex-col justify-center gap-4 px-5 py-12 sm:px-8 md:min-h-[360px] md:px-10 lg:px-12">
        <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 font-space-grotesk text-[11px] font-medium uppercase tracking-[0.15em] text-[#FEF9FF] backdrop-blur-sm">
          Collector event
        </span>

        <h1 className="max-w-3xl break-words font-unica-one text-3xl leading-[1.05] tracking-[-0.03em] text-[#FEF9FF] sm:text-4xl md:text-5xl md:leading-[1.08] lg:text-[56px]">
          {event.name}
        </h1>

        <p className="flex items-start gap-2 font-inter text-sm leading-6 text-[#FEF9FF]/90 sm:text-base">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D9CCFF]" aria-hidden="true" />
          {event.venue_name
            ? `at ${event.venue_name}`
            : `${event.city}, ${event.state}`}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#8B5CF6] px-6 font-inter text-sm font-semibold text-[#FEF9FF] shadow-lg shadow-black/15 transition hover:bg-[#7137DA] disabled:opacity-60"
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isSaved ? "Saved" : "Save"}
          </button>

          {event.website && (
            <Link
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center rounded-lg border border-white/35 bg-white/10 px-8 font-inter text-sm font-semibold text-[#FEF9FF] backdrop-blur-sm transition hover:bg-white/20"
            >
              Visit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
