"use client";

import { useState } from "react";
import type { ProfileClientProps } from "@/lib/profile/types";

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
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return null;
  }

  // First-time users complete onboarding
  if (!profile.profile_completed) {
    return <ProfileOnboarding user={user} profile={profile} />;
  }

  if (isEditing) {
    return (
      <ProfileOnboarding
        user={user}
        profile={profile}
        isEditing
        onExit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <main className="min-h-screen">
      <ProfileHero
        user={user}
        profile={profile}
        onEdit={() => setIsEditing(true)}
      />

      <div className="mx-auto mt-10 max-w-7xl px-6 pb-16">
        <SavedShops shops={savedShops} />
        <SavedEvents events={savedEvents} />
      </div>
    </main>
  );
}
