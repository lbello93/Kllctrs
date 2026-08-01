"use client";

import FavoriteGamesSection from "@/components/profile/edit/sections/FavoriteGamesSection";

import type { OnboardingData } from "@/hooks/useOnboarding";

interface FavoriteGamesStepProps {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function FavoriteGamesStep({
  data,
  updateData,
}: FavoriteGamesStepProps) {
  return (
    <FavoriteGamesSection
      value={data.favorite_games ?? []}
      onChange={(games) =>
        updateData({
          favorite_games: games,
        })
      }
    />
  );
}
