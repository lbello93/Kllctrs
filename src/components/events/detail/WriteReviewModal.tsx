"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteReviewModal({
  eventId,
  onClose,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please sign in to leave a review.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();

    const { error: insertError } = await supabase.from("event_reviews").insert({
      event_id: eventId,
      user_id: user.id,
      reviewer_name: profile?.display_name || "Collector",
      reviewer_avatar_url: profile?.avatar_url ?? null,
      rating,
      comment: comment.trim(),
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "You've already reviewed this show."
          : "Something went wrong. Please try again.",
      );
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-[#FEF9FF] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-space-grotesk text-xl font-bold tracking-tight text-black">
            Write A Review
          </h3>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-[#151E3C]" />
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
            >
              <Star
                className="h-7 w-7"
                fill={i < (hoverRating || rating) ? "#F0C040" : "none"}
                stroke="#F0C040"
                strokeWidth={2}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="mb-4 w-full rounded-md border border-[#CBBEFB] bg-white p-3 text-sm text-[#151E3C] outline-none focus:border-[#8B5CF6]"
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#8B5CF6] py-3 text-sm font-medium text-[#FEF9FF] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}