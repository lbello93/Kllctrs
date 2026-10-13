import { Star } from "lucide-react";
import type { EventReview } from "@/types";

export default function EventReviewCard({ review }: { review: EventReview }) {
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-xl border border-[#EEE9F7] bg-[#FAF8FF] p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#E5DFFD]">
          {review.reviewer_avatar_url && (
            <img
              src={review.reviewer_avatar_url}
              alt={review.reviewer_name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="break-words font-space-grotesk text-sm font-bold tracking-tight text-[#151E3C] sm:text-base">
            {review.reviewer_name}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5"
                fill={i < review.rating ? "#F0C040" : "none"}
                stroke="#F0C040"
                strokeWidth={2}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="break-words text-sm leading-6 text-[#46506B]">{review.comment}</p>
    </article>
  );
}
