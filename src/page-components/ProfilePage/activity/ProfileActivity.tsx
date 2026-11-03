import Link from "next/link";
import { MessageSquare, Settings, Star, Store } from "lucide-react";

import type { ProfileActivityData } from "@/lib/profile/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          fill={i <= rating ? "#E8B85C" : "none"}
          stroke="#E8B85C"
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-600",
};

export default function ProfileActivity({ activity }: { activity: ProfileActivityData }) {
  const { submittedShops, reviews, chatThreadCount } = activity;

  return (
    <div className="space-y-8">
      {/* Submitted shops */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-space-grotesk text-xl font-semibold text-[#151E3C]">
          <Store className="h-5 w-5 text-[#5B18BE]" /> Your submitted shops
        </h3>
        {submittedShops.length === 0 ? (
          <p className="rounded-2xl border border-[#E7E0F5] bg-white p-5 text-sm text-[#596078]">
            You haven&apos;t submitted any shops yet.{" "}
            <Link href="/shops/submit" className="font-semibold text-[#5B18BE] hover:underline">
              Submit a shop
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {submittedShops.map((shop) => {
              const status = shop.is_verified ? "approved" : shop.status ?? "pending";
              return (
                <div key={shop.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E0F5] bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#151E3C]">{shop.name}</p>
                    <p className="truncate text-xs text-[#777B8D]">
                      {[shop.city, shop.state].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                      STATUS_STYLE[status] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-space-grotesk text-xl font-semibold text-[#151E3C]">
          <Star className="h-5 w-5 text-[#E8B85C]" /> Your reviews
        </h3>
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-[#E7E0F5] bg-white p-5 text-sm text-[#596078]">
            You haven&apos;t written any reviews yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={`${r.kind}-${r.id}`} className="rounded-2xl border border-[#E7E0F5] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-700">
                      {r.kind}
                    </span>
                    {r.href ? (
                      <Link href={r.href} className="font-semibold text-[#5B18BE] hover:underline">
                        {r.target}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[#151E3C]">{r.target}</span>
                    )}
                  </div>
                  <Stars rating={r.rating} />
                </div>
                {r.comment && <p className="mt-2 text-sm text-[#596078]">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chat history + account settings */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/?chat=open"
          className="flex items-center gap-3 rounded-2xl border border-[#E7E0F5] bg-white p-5 transition hover:border-[#B39EF9]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2EFFE] text-[#5B18BE]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[#151E3C]">Chat history</p>
            <p className="text-xs text-[#777B8D]">
              {chatThreadCount} conversation{chatThreadCount === 1 ? "" : "s"} with the AI assistant
            </p>
          </div>
        </Link>

        <Link
          href="/profile?edit=welcome"
          className="flex items-center gap-3 rounded-2xl border border-[#E7E0F5] bg-white p-5 transition hover:border-[#B39EF9]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7E5] text-[#9A7A26]">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[#151E3C]">Account settings</p>
            <p className="text-xs text-[#777B8D]">Edit your profile, preferences, and notifications</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
