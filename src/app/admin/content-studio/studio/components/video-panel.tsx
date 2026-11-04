"use client";

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  VIDEO_STYLES,
  type AspectRatio,
  type StudioInput,
} from "@/lib/content-studio";

import { VideoStyleCard } from "./video-style-card";

const ASPECTS: AspectRatio[] = ["16:9", "9:16", "1:1"];

export function VideoPanel({ input }: { input: StudioInput }) {
  const [selectedId, setSelectedId] = useState(VIDEO_STYLES[0].id);
  const [copied, setCopied] = useState(false);
  const style = VIDEO_STYLES.find((s) => s.id === selectedId) ?? VIDEO_STYLES[0];

  // Keep the aspect valid for the chosen style (first supported = default).
  const [aspect, setAspect] = useState<AspectRatio>(style.aspects[0]);
  const effectiveAspect = style.aspects.includes(aspect) ? aspect : style.aspects[0];

  const prompt = useMemo(
    () => style.build(input, effectiveAspect),
    [style, input, effectiveAspect],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const selectStyle = (id: string) => {
    setSelectedId(id);
    const next = VIDEO_STYLES.find((s) => s.id === id);
    if (next && !next.aspects.includes(aspect)) setAspect(next.aspects[0]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {VIDEO_STYLES.map((s) => (
          <VideoStyleCard
            key={s.id}
            style={s}
            selected={s.id === selectedId}
            onSelect={() => selectStyle(s.id)}
          />
        ))}
      </div>

      <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{style.emoji}</span>
            <div>
              <p className="text-sm font-bold text-white">{style.name}</p>
              <p className="text-[11px] text-white/50">{style.renderMethod} · {style.duration}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {ASPECTS.map((a) => {
              const supported = style.aspects.includes(a);
              return (
                <button
                  key={a}
                  disabled={!supported}
                  onClick={() => setAspect(a)}
                  className={`rounded-md px-2 py-1 text-xs transition ${
                    effectiveAspect === a
                      ? "bg-amethyst-500 text-white"
                      : supported
                        ? "bg-white/[0.06] text-white/70 hover:bg-white/10"
                        : "cursor-not-allowed bg-white/[0.02] text-white/20"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>

        <pre className="max-h-[480px] flex-1 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-relaxed text-white/75">
          {prompt}
        </pre>

        <div className="flex items-center gap-2 border-t border-white/10 p-3">
          <Button
            onClick={copy}
            className="flex-1"
            style={{ background: input.accent, color: "#FEF9FF" }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied prompt" : "Copy prompt"}
          </Button>
          <Button variant="outline" asChild>
            <a href="https://claude.ai/new" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> Open Claude
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
