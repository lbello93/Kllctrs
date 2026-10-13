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
    <section className="flex min-w-0 flex-col gap-5 rounded-2xl border border-[#E9E3F4] bg-white p-5 shadow-[0_12px_36px_rgba(21,30,60,0.04)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-[#8B5CF6]">Collector feedback</p>
          <h2 className="mt-1 font-space-grotesk text-2xl font-bold tracking-tight text-[#151E3C] sm:text-[28px]">
          Reviews
          </h2>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Sort reviews"
          className="max-w-full rounded-lg border border-[#D8C9FF] bg-[#FEF9FF] px-3 py-2 text-xs text-[#5B18BE] outline-none focus:ring-2 focus:ring-[#8B5CF6]/25"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D8C9FF] bg-[#FAF8FF] px-5 py-8 text-center text-sm leading-6 text-[#596078]">
          No reviews yet. Be the first!
        </div>
      ) : (
        sorted.map((review) => (
          <EventReviewCard key={review.id} review={review} />
        ))
      )}
    </section>
  );
}
