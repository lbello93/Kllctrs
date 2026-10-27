"use client";

import { useState } from "react";
import { Copy, CheckCircle2, ExternalLink } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface Props {
  title: string;
  description: string;
  slug: string;
  eventCity?: string;
  eventState?: string;
}

export default function LinkedInPreview({
  title,
  description,
  slug,
  eventCity,
  eventState,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const postUrl = `https://www.kllctrs.com/blog/${slug}`;
  const location =
    eventCity && eventState ? ` in ${eventCity}, ${eventState}` : "";

  const postText = `New on KLLCTRS: ${title}\n\n${description}${location ? "\n\n📍 " + location.trim() : ""}\n\n🔗 ${postUrl}\n\n#sportscards #cardshow #tradingcards #collecting #hobby #KLLCTRS`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 overflow-hidden">
      {/* Header — clickable to expand/collapse */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-violet-50/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
            <LinkedinIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-black text-[#1a0a3d]">
              LinkedIn Post Preview
            </p>
            <p className="text-[10px] text-[#4a3f6b]/40">
              Ready to share — copy text or open LinkedIn
            </p>
          </div>
        </div>
        <span className="text-xs text-[#5f2eea] font-bold">
          {expanded ? "Hide ↑" : "Show ↓"}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-violet-100 pt-4 space-y-4">
          {/* LinkedIn post mockup */}
          <div className="rounded-xl border border-violet-100 bg-[#f4f3fb] overflow-hidden">
            {/* Post header */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5f2eea] to-[#4a1fa8] flex items-center justify-center text-white font-black text-sm shrink-0">
                  K
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a0a3d]">KLLCTRS</p>
                  <p className="text-xs text-[#4a3f6b]/40">Just now · 🌐</p>
                </div>
              </div>
              <p className="text-sm text-[#1a0a3d] whitespace-pre-wrap leading-relaxed">
                {postText}
              </p>
            </div>

            {/* Link preview card */}
            <div className="mx-4 mb-4 rounded-xl border border-violet-200 bg-white overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#5f2eea] to-[#a855f7]" />
              <div className="p-3">
                <p className="text-xs font-bold text-[#1a0a3d] truncate mb-0.5">
                  {title}
                </p>
                <p className="text-[10px] text-[#4a3f6b]/40 truncate">
                  {description}
                </p>
                <p className="text-[10px] text-[#4a3f6b]/25 mt-1">
                  kllctrs.com
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                copied
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "border-violet-200 text-[#5f2eea] hover:bg-violet-50"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy post text
                </>
              )}
            </button>

            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              Share on LinkedIn
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          <p className="text-[10px] text-[#4a3f6b]/30">
            Auto-posting will be enabled when LinkedIn API access is approved.
            Copy the text and paste into a new LinkedIn post for now.
          </p>
        </div>
      )}
    </div>
  );
}
