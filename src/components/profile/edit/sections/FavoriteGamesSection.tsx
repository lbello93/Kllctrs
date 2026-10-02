"use client";

import { Check } from "lucide-react";

interface FavoriteGamesSectionProps {
  value: string[];
  onChange: (games: string[]) => void;
}

const GAMES = [
  "Pokémon TCG",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
  "One Piece",
  "Disney Lorcana",
  "Flesh and Blood",
  "Dragon Ball Super",
  "Sports Cards",
  "Other",
];

export default function FavoriteGamesSection({
  value,
  onChange,
}: FavoriteGamesSectionProps) {
  function toggleGame(game: string) {
    onChange(
      value.includes(game) ? value.filter((g) => g !== game) : [...value, game],
    );
  }

  return (
    <div className="my-auto flex flex-col gap-4">
      <div className="flex h-6 items-center justify-between">
        <p
          aria-live="polite"
          className="font-inter text-[12px] leading-[15px] text-[#FEF9FF]/60"
        >
          {value.length === 0
            ? "Pick as many as you like, or skip this step."
            : `${value.length} selected`}
        </p>

        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="font-inter text-[12px] leading-[15px] text-[#9C7CF7] underline-offset-4 transition hover:text-[#B39EF9] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="Games you collect"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {GAMES.map((game) => {
          const selected = value.includes(game);

          return (
            <button
              key={game}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleGame(game)}
              className={`flex min-h-[56px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left font-inter text-[14px] leading-[17px] outline-none transition focus-visible:ring-2 focus-visible:ring-[#9C7CF7]/40 ${selected ? "border-[#9C7CF7] bg-[#9C7CF7]/15 text-[#FEF9FF]" : "border-white/10 bg-[#FEF9FF]/[0.06] text-[#FEF9FF]/80 hover:border-[#9C7CF7]/50 hover:text-[#FEF9FF]"}`}
            >
              <span>{game}</span>

              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${selected ? "border-[#9C7CF7] bg-[#9C7CF7] text-white" : "border-white/25"}`}
              >
                {selected && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
