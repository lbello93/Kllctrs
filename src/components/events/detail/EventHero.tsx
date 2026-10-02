"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
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
        src="/EventSlug/Sho.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#151E3C]/85 via-[#151E3C]/45 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[285px] max-w-[1320px] flex-col justify-center gap-5 px-6 py-14 md:px-[120px]">
        <span className="font-space-grotesk text-[11px] font-medium uppercase tracking-[0.15em] text-[#FEF9FF]">
          Discover
        </span>

        <h1 className="line-clamp-3 max-w-[600px] font-unica-one text-3xl leading-tight tracking-[-0.03em] text-[#FEF9FF] sm:text-4xl md:text-[48px] md:leading-[54px] md:tracking-[-0.04em]">
          {event.name}
        </h1>

        <p className="font-inter text-base leading-[18px] text-[#FEF9FF]">
          {event.venue_name
            ? `at ${event.venue_name}`
            : `${event.city}, ${event.state}`}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded bg-[#8B5CF6] px-6 font-inter text-sm text-[#FEF9FF] disabled:opacity-60"
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
              className="flex h-12 items-center justify-center rounded bg-[#8B5CF6] px-8 font-inter text-sm text-[#FEF9FF]"
            >
              Visit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
