"use client";

import type { VideoStyle } from "@/lib/content-studio";

interface Props {
  style: VideoStyle;
  selected: boolean;
  onSelect: () => void;
}

export function VideoStyleCard({ style, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition hover:scale-[1.01] ${
        selected ? "border-amethyst-500 bg-amethyst-500/15" : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{style.emoji}</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
          {style.duration}
        </span>
      </div>
      <p className="text-sm font-bold text-white">{style.name}</p>
      <p className="text-xs leading-snug text-white/50">{style.description}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {style.bestFor.map((b) => (
          <span key={b} className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/60">
            {b}
          </span>
        ))}
      </div>
      <span className="mt-1 text-[10px] font-medium text-tuscan-500">{style.renderMethod}</span>
    </button>
  );
}
