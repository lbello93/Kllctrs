"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

/** Share controls for an event: native share (when available), social links, copy link. */
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const shareUrl = (href: string) =>
    typeof window !== "undefined" ? href.replace("__URL__", encodeURIComponent(window.location.href)) : "#";

  const btn =
    "inline-flex items-center gap-1.5 rounded-full border border-[#E4DDF1] bg-white px-3 py-1.5 text-xs font-medium text-[#5B18BE] transition hover:border-[#B39EF9] hover:bg-[#F8F5FF]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={share} className={btn}>
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
      <a
        className={btn}
        target="_blank"
        rel="noreferrer"
        href={shareUrl(`https://twitter.com/intent/tweet?url=__URL__`)}
      >
        X
      </a>
      <a
        className={btn}
        target="_blank"
        rel="noreferrer"
        href={shareUrl(`https://www.facebook.com/sharer/sharer.php?u=__URL__`)}
      >
        Facebook
      </a>
      <button onClick={copy} className={btn}>
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
