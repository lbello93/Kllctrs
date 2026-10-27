"use client";

import { LocateFixed, Loader2 } from "lucide-react";
import type { LocationStatus } from "@/hooks/useUserLocation";

interface Props {
  status: LocationStatus;
  onRequest: () => void;
}

export default function NearMeBanner({ status, onRequest }: Props) {
  if (status === "granted") {
    return (
      <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-[#CBBEFB] bg-[#F2EFFE] px-4 py-2 text-[12px] font-medium text-[#8B5CF6]">
        <LocateFixed size={14} />
        Showing results closest to you first
      </div>
    );
  }

  if (status === "denied" || status === "unsupported") {
    return null;
  }

  return (
    <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-[#CBBEFB] bg-white px-4 py-2 shadow-sm">
      <span className="text-[12px] font-medium text-[#1E1E1E]">
        See what&apos;s happening near you
      </span>

      <button
        onClick={onRequest}
        disabled={status === "loading"}
        className="flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-3 py-1.5 text-[11px] font-medium text-white hover:opacity-90 transition disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <LocateFixed size={13} />
        )}
        {status === "loading" ? "Locating..." : "Use my location"}
      </button>
    </div>
  );
}
