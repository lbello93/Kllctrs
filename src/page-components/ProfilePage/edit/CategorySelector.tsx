"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface CategorySelectorProps {
  selected?: string[];
  onChange?: (categories: string[]) => void;
}

const ALL_CATEGORIES = [
  "Pokemon",
  "Sports",
  "Vintage",
  "Marvel",
  "NBA",
  "NFL",
  "Soccer",
  "Magic",
  "Yu-Gi-Oh!",
  "One Piece",
  "Baseball",
  "Hockey",
  "Anime",
  "Formula 1",
  "Cricket",
];

export default function CategorySelector({
  selected,
  onChange,
}: CategorySelectorProps) {
  const [internalSelection, setInternalSelection] = useState<string[]>([]);
  const selectedCategories = selected ?? internalSelection;

  function toggleCategory(category: string) {
    let updated: string[];

    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter((item) => item !== category);
    } else {
      updated = [...selectedCategories, category];
    }

    if (selected === undefined) setInternalSelection(updated);
    onChange?.(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f2eea]">
          Specialties
        </h3>
        <span className="text-xs text-zinc-400">
          {selectedCategories.length} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {ALL_CATEGORIES.map((category) => {
          const active = selectedCategories.includes(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              aria-pressed={active}
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                duration-200
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#5f2eea]
                ${
                  active
                    ? "border-transparent bg-gradient-to-r from-[#5f2eea] to-[#4a1fa8] text-white shadow-[0_6px_20px_-4px_rgba(95,46,234,0.45)]"
                    : "border-zinc-200 bg-white text-zinc-500 hover:border-violet-200 hover:bg-violet-50/60 hover:text-[#4a3f6b]"
                }
              `}
            >
              {active && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
