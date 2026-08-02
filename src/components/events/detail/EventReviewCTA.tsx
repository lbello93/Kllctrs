"use client";

import { useState } from "react";
import WriteReviewModal from "./WriteReviewModal";

export default function EventReviewCTA({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-col items-start gap-5 rounded-lg bg-[#FEF9FF] p-6 md:flex-row md:items-center md:justify-between md:gap-[102px] md:p-10">
        <div className="flex flex-col gap-2">
          <h3 className="font-space-grotesk text-xl font-bold tracking-tight text-black">
            Been to this show before? Share your experience!
          </h3>
          <p className="text-sm tracking-tight text-black">
            Help other collectors make informed decisions
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-full shrink-0 rounded bg-[#8B5CF6] px-8 py-3 text-sm text-[#FEF9FF] md:w-auto"
        >
          Write A Review
        </button>
      </div>

      {open && (
        <WriteReviewModal
          eventId={eventId}
          onClose={() => setOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </>
  );
}
