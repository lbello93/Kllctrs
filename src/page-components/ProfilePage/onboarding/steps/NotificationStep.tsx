"use client";

import NotificationSection from "@/page-components/ProfilePage/edit/sections/NotificationSection";
import type { NotificationPreferences } from "@/page-components/ProfilePage/edit/sections/NotificationSection";

import type { OnboardingData } from "@/hooks/useOnboarding";

interface NotificationStepProps {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function NotificationStep({
  data,
  updateData,
}: NotificationStepProps) {
  return (
    <NotificationSection
      value={{
        event_notifications: data.event_notifications ?? true,
        shop_notifications: data.shop_notifications ?? true,
        community_notifications: data.community_notifications ?? true,
        marketing_notifications: data.marketing_notifications ?? false,
      }}
      onChange={(preferences: NotificationPreferences) =>
        updateData(preferences)
      }
    />
  );
}
