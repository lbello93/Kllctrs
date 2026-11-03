"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function ShopReviewForm({ shopId }: { shopId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/shops/${shopId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content }),
      });
      if (res.status === 401) {
        router.push(`/login?redirect=/shops/${shopId}`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not submit your review.");
        return;
      }
      setDone(true);
      setContent("");
      setRating(0);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        Thanks — your review has been posted.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-violet-100 bg-white p-4">
      <h3 className="mb-2 text-sm font-black text-[#1a0a3d]">Write a review</h3>
      <div className="mb-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
            className="cursor-pointer"
          >
            <Star
              className="h-6 w-6"
              fill={i <= (hover || rating) ? "#F0C040" : "none"}
              stroke="#F0C040"
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Share your experience (optional)…"
        className="w-full rounded-lg border border-violet-200 bg-[#faf9ff] px-3 py-2 text-sm text-[#1a0a3d] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
      >
        {submitting ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
