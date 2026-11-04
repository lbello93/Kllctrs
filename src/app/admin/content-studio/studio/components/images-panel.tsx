"use client";

import { useState } from "react";

import { IMAGE_TEMPLATES, type StudioInput } from "@/lib/content-studio";

import { ImagePreview } from "./image-preview";

export function ImagesPanel({ input }: { input: StudioInput }) {
  const [selected, setSelected] = useState(IMAGE_TEMPLATES[0].id);
  const template = IMAGE_TEMPLATES.find((t) => t.id === selected) ?? IMAGE_TEMPLATES[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {IMAGE_TEMPLATES.map((t) => {
          const active = t.id === selected;
          return (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`rounded-xl border p-3 text-left transition hover:scale-[1.01] ${
                active ? "border-amethyst-500 bg-amethyst-500/15" : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-white/40">{t.aspect} · {t.width}×{t.height}</p>
            </button>
          );
        })}
      </div>

      <ImagePreview template={template} input={input} />
    </div>
  );
}
