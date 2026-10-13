"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WriteReviewModal from "./WriteReviewModal";

export default function EventReviewCTA({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-col items-start gap-5 rounded-2xl border border-[#E9E3F4] bg-white p-5 shadow-[0_12px_36px_rgba(21,30,60,0.04)] sm:p-7 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="font-space-grotesk text-xl font-bold tracking-tight text-[#151E3C]">
            Been to this show before? Share your experience!
          </h3>
          <p className="text-sm leading-6 text-[#596078]">
            Help other collectors make informed decisions
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-full shrink-0 rounded-lg bg-[#8B5CF6] px-6 py-3 text-sm font-semibold text-[#FEF9FF] transition hover:bg-[#7137DA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B18BE] md:w-auto"
        >
          Write A Review
        </button>
      </div>

      {open && (
        <WriteReviewModal
          eventId={eventId}
          onClose={() => setOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
