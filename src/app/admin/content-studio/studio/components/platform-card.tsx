"use client";

import { useState } from "react";
import {
  AtSign,
  Camera,
  Check,
  ChevronDown,
  Copy,
  Hash,
  Music,
  Play,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlatformId, PlatformPost } from "@/lib/content-studio";

// lucide 1.x dropped brand glyphs, so we use neutral icons + brand-colored gradients.
const META: Record<PlatformId, { gradient: string; Icon: React.ComponentType<{ className?: string }> }> = {
  instagram: { gradient: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", Icon: Camera },
  x: { gradient: "linear-gradient(135deg,#1d1d1f,#444)", Icon: AtSign },
  linkedin: { gradient: "linear-gradient(135deg,#0a66c2,#004182)", Icon: Share2 },
  youtube: { gradient: "linear-gradient(135deg,#ff0000,#c4302b)", Icon: Play },
  threads: { gradient: "linear-gradient(135deg,#000,#333)", Icon: Hash },
  tiktok: { gradient: "linear-gradient(135deg,#25f4ee,#000,#fe2c55)", Icon: Music },
};

export function PlatformCard({ post }: { post: PlatformPost }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { gradient, Icon } = META[post.platform];

  const copy = async () => {
    await navigator.clipboard.writeText(post.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-3 p-3" style={{ background: gradient }}>
        <Icon className="size-5 text-white" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{post.label}</p>
          <p className="truncate text-[11px] text-white/80">{post.meta}</p>
        </div>
      </div>

      <div className="flex-1 p-3">
        <pre className={`whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-white/80 ${expanded ? "" : "line-clamp-4"}`}>
          {post.text}
        </pre>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 p-2">
        <Button variant="ghost" size="xs" onClick={() => setExpanded((v) => !v)}>
          <ChevronDown className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "Collapse" : "Expand"}
        </Button>
        <Button variant="outline" size="xs" onClick={copy}>
          {copied ? <Check className="size-3 text-amethyst-400" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
