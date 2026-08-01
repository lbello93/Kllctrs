"use client";

import { Card, CardContent } from "@/components/ui/card";

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
    if (value.includes(game)) {
      onChange(value.filter((g) => g !== game));
    } else {
      onChange([...value, game]);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Which games do you collect?
        </h3>

        <p className="text-sm text-white/50">Select all that apply.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => {
          const selected = value.includes(game);

          return (
            <Card
              key={game}
              onClick={() => toggleGame(game)}
              className={`cursor-pointer border bg-[#1E1240] transition-all ${
                selected
                  ? "border-[#E8B85C] ring-2 ring-[#E8B85C]/30"
                  : "border-white/10 hover:border-[#E8B85C]/40"
              }`}
            >
              <CardContent className="flex items-center justify-center p-5 text-center font-medium text-white">
                {game}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-white/50">
        {value.length} game{value.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
}
