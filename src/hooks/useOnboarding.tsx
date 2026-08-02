"use client";

import { useMemo, useState } from "react";

const STEPS = [
  "welcome",
  "basic",
  "location",
  "collector",
  "experience",
  "games",
  "notifications",
  "finish",
] as const;

export type OnboardingStep = (typeof STEPS)[number];

export interface OnboardingData {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  country?: string;
  collector_type?: string;
  years_collecting?: number;
  favorite_games?: string[];
  event_notifications?: boolean;
  shop_notifications?: boolean;
  community_notifications?: boolean;
  marketing_notifications?: boolean;
  terms_accepted?: boolean;
}

interface UseOnboardingOptions {
  initialData?: OnboardingData;
  startAtStep?: OnboardingStep;
}

export function useOnboarding(options: UseOnboardingOptions = {}) {
  const startIndex = options.startAtStep
    ? STEPS.indexOf(options.startAtStep)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(
    startIndex >= 0 ? startIndex : 0,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    favorite_games: [],
    event_notifications: true,
    shop_notifications: true,
    community_notifications: true,
    marketing_notifications: false,
    terms_accepted: false,
    ...options.initialData,
  });

  const totalSteps = STEPS.length;
  const currentStep = STEPS[currentIndex];

  const progress = useMemo(
    () => ((currentIndex + 1) / totalSteps) * 100,
    [currentIndex, totalSteps],
  );

  const nextStep = () => {
    setCurrentIndex((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  };

  const previousStep = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const updateData = (values: Partial<OnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const completeOnboarding = async (): Promise<boolean> => {
    if (!data.terms_accepted) {
      setSubmitError(
        "Please accept the Terms of Service and Privacy Policy to continue.",
      );
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          profile_completed: true,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save profile");
      }

      return true;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    currentIndex,
    progress,
    totalSteps,
    nextStep,
    previousStep,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === totalSteps - 1,
    data,
    updateData,
    completeOnboarding,
    isSubmitting,
    submitError,
  };
}
