"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { ONBOARDING_STEPS } from "@/lib/profile/constants";
import type { OnboardingStep, ProfileClientProps } from "@/lib/profile/types";

import ProfileHero from "./hero/ProfileHero";
import SavedShops from "./shops/SavedShops";
import SavedEvents from "./events/SavedEvents";

import ProfileOnboarding from "./onboarding/ProfileOnboarding";

export default function ProfileClient({
  user,
  profile,
  savedShops,
  savedEvents,
}: ProfileClientProps) {
  // /profile?edit=welcome opens the edit flow at that step.
  const searchParams = useSearchParams();
  const requestedStep = searchParams.get("edit");
  const linkedStep: OnboardingStep | undefined = ONBOARDING_STEPS.find(
    (step) => step === requestedStep,
  );

  const [isEditing, setIsEditing] = useState(linkedStep !== undefined);
  const [editStep, setEditStep] = useState<OnboardingStep | undefined>(
    linkedStep,
  );

  if (!profile) {
    return null;
  }

  // First time users complete onboarding
  if (!profile.profile_completed) {
    return <ProfileOnboarding user={user} profile={profile} />;
  }

  if (isEditing) {
    return (
      <ProfileOnboarding
        user={user}
        profile={profile}
        isEditing
        startAtStep={editStep}
        onExit={() => {
          setIsEditing(false);
          setEditStep(undefined);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FEF9FF]">
      <ProfileHero
        user={user}
        profile={profile}
        onEdit={() => setIsEditing(true)}
      />

      <div className="mx-auto max-w-7xl space-y-12 px-6 pb-16 pt-10">
        <SavedShops shops={savedShops} />
        <SavedEvents events={savedEvents} />
      </div>
    </main>
  );
}
