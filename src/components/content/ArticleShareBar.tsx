"use client";

import { useEffect, useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5L6.1 22H3l8.1-9.3L2.7 2h6.6l4.5 6zM17.6 20h1.7L7.9 3.9H6.1z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ArticleShareBar({ title }: { title: string }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex h-9 items-center gap-1.5 rounded-full border border-violet-200 px-3 text-xs font-medium text-[#4a3f6b]/60 transition-colors hover:bg-violet-50 hover:text-[#5f2eea]"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Link2 className="w-3.5 h-3.5" />
        )}
        {copied ? "Copied" : "Copy Link"}
      </button>

      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 text-[#4a3f6b]/60 transition-colors hover:bg-violet-50 hover:text-[#5f2eea]"
      >
        <XIcon className="w-3.5 h-3.5" />
      </a>

      <a
        href={linkedinShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 text-[#4a3f6b]/60 transition-colors hover:bg-violet-50 hover:text-[#5f2eea]"
      >
        <LinkedinIcon className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
