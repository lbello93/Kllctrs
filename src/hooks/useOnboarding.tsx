"use client";

import { useMemo, useState } from "react";

import { ONBOARDING_STEPS } from "@/lib/profile/constants";
import type { OnboardingStep } from "@/lib/profile/types";

export type { OnboardingStep };

export interface OnboardingData {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
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
  const requestedIndex = options.startAtStep
    ? ONBOARDING_STEPS.indexOf(options.startAtStep)
    : 0;

  // The first step the user can see. In edit mode this is "basic", not "welcome".
  const minIndex = requestedIndex >= 0 ? requestedIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(minIndex);
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

  const totalSteps = ONBOARDING_STEPS.length;
  const currentStep = ONBOARDING_STEPS[currentIndex];

  // Numbers the user sees, counted from the first visible step.
  const visibleSteps = totalSteps - minIndex;
  const stepNumber = currentIndex - minIndex + 1;

  const progress = useMemo(
    () => (stepNumber / visibleSteps) * 100,
    [stepNumber, visibleSteps],
  );

  const nextStep = () => {
    setCurrentIndex((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  };

  const previousStep = () => {
    setCurrentIndex((prev) => (prev > minIndex ? prev - 1 : prev));
  };

  const updateData = (values: Partial<OnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const completeOnboarding = async (): Promise<boolean> => {
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
    stepNumber,
    visibleSteps,
    progress,
    totalSteps,
    nextStep,
    previousStep,
    isFirstStep: currentIndex === minIndex,
    isLastStep: currentIndex === totalSteps - 1,
    data,
    updateData,
    completeOnboarding,
    isSubmitting,
    submitError,
  };
}
