"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { ONBOARDING_STEPS } from "@/lib/profile/constants";
import type { OnboardingStep, ProfileClientProps } from "@/lib/profile/types";

import ProfileHero from "./hero/ProfileHero";
import SavedShops from "./shops/SavedShops";
import SavedEvents from "./events/SavedEvents";

import ProfileOnboarding from "./onboarding/ProfileOnboarding";
import { Bookmark, CalendarDays, Store } from "lucide-react";

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
    <div className="min-h-screen bg-[#F7F5FC]">
      <ProfileHero
        user={user}
        profile={profile}
        onEdit={() => setIsEditing(true)}
      />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <section aria-label="Collection overview" className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#E7E0F5] bg-white p-5 shadow-[0_8px_30px_rgba(21,30,60,0.04)] sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF7E5] text-[#9A7A26]">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[#777B8D]">Saved events</p>
              <p className="mt-1 font-space-grotesk text-2xl font-semibold text-[#151E3C]">{savedEvents.length}</p>
            </div>
            <CalendarDays className="ml-auto h-5 w-5 text-[#E8B85C]" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#E7E0F5] bg-white p-5 shadow-[0_8px_30px_rgba(21,30,60,0.04)] sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F2EFFE] text-[#5B18BE]">
              <Store className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-[#777B8D]">Saved shops</p>
              <p className="mt-1 font-space-grotesk text-2xl font-semibold text-[#151E3C]">{savedShops.length}</p>
            </div>
            <Bookmark className="ml-auto h-5 w-5 text-[#B39EF9]" aria-hidden="true" />
          </div>
        </section>

        <div className="mb-8 border-b border-[#E4DDF1] pb-5">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[#8B5CF6]">Your KLLCTRS space</p>
          <h2 className="mt-1 font-unica-one text-3xl leading-tight text-[#151E3C] sm:text-4xl">Your collection</h2>
          <p className="mt-2 max-w-2xl font-inter text-sm leading-6 text-[#596078]">Keep the shops and card shows you care about close at hand.</p>
        </div>

        <div className="space-y-12">
        <SavedEvents events={savedEvents} />
        <SavedShops shops={savedShops} />
        </div>
      </div>
    </div>
  );
}
