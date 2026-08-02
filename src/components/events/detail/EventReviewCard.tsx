import { Star } from "lucide-react";
import type { EventReview } from "@/types";

export default function EventReviewCard({ review }: { review: EventReview }) {
  return (
    <div className="flex flex-col gap-5 rounded-lg bg-[#FEF9FF] px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
          {review.reviewer_avatar_url && (
            <img
              src={review.reviewer_avatar_url}
              alt={review.reviewer_name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-space-grotesk text-base font-bold tracking-tight text-black">
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
      <p className="text-xs leading-3 text-[#151E3C]">{review.comment}</p>
    </div>
  );
}
