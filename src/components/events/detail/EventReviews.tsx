"use client";

import { useState } from "react";
import EventReviewCard from "./EventReviewCard";
import type { EventReview } from "@/types";

interface Props {
  reviews: EventReview[];
}

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
] as const;

export default function EventReviews({ reviews }: Props) {
  const [sortBy, setSortBy] =
    useState<(typeof SORT_OPTIONS)[number]["value"]>("recent");

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="flex w-full flex-col gap-[17px] md:w-[372px]">
      <div className="flex items-center justify-between">
        <h2 className="font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] md:text-[32px]">
          Reviews
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-[10px] border border-[#B39EF9] bg-[#FEF9FF] px-3 py-2 text-xs text-[#8B5CF6] outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-lg bg-[#FEF9FF] px-6 py-8 text-center text-sm text-[#151E3C]/60">
          No reviews yet. Be the first!
        </div>
      ) : (
        sorted.map((review) => (
          <EventReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
}
