"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useOnboarding, type OnboardingData } from "@/hooks/useOnboarding";
import {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_INFO,
} from "@/lib/profile/constants";
import type { OnboardingStep } from "@/lib/profile/types";

import WelcomeStep from "./steps/WelcomeStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import LocationStep from "./steps/LocationStep";
import CollectorTypeStep from "./steps/CollectorTypeStep";
import ExperienceStep from "./steps/ExperienceStep";
import FavoriteGamesStep from "./steps/FavoriteGamesStep";
import NotificationStep from "./steps/NotificationStep";
import FinishStep from "./steps/FinishStep";
import { validateBasicInfo } from "@/lib/profile/validation";
import { StepLayout } from "./shared/StepLayout";

interface ProfileOnboardingProps {
  user: any;
  profile: any;
  isEditing?: boolean;
  onExit?: () => void;
  startAtStep?: OnboardingStep;
}

function profileToOnboardingData(profile: any): OnboardingData {
  return {
    display_name: profile?.display_name ?? undefined,
    username: profile?.username ?? undefined,
    bio: profile?.bio ?? undefined,
    avatar_url: profile?.avatar_url ?? undefined,
    city: profile?.city ?? undefined,
    state: profile?.state ?? undefined,
    country: profile?.country ?? undefined,
    collector_type: profile?.collector_type ?? undefined,
    years_collecting: profile?.years_collecting ?? undefined,
    favorite_games: profile?.favorite_games ?? [],
    event_notifications: profile?.event_notifications ?? true,
    shop_notifications: profile?.shop_notifications ?? true,
    community_notifications: profile?.community_notifications ?? true,
    marketing_notifications: profile?.marketing_notifications ?? false,
    terms_accepted: profile?.terms_accepted ?? false,
  };
}

export default function ProfileOnboarding({
  user,
  profile,
  isEditing = false,
  onExit,
  startAtStep,
}: ProfileOnboardingProps) {
  const router = useRouter();
  const [completeError, setCompleteError] = useState<string | null>(null);

  // The first step the person can see. Editing skips the welcome screen.
  const firstStep: OnboardingStep =
    startAtStep ?? (isEditing ? "basic" : "welcome");
  const firstIndex = Math.max(0, ONBOARDING_STEPS.indexOf(firstStep));

  const initialData = useMemo(
    () =>
      isEditing
        ? profileToOnboardingData(profile)
        : {
            display_name:
              profile?.display_name ??
              user?.user_metadata?.full_name ??
              undefined,
            username:
              profile?.username ?? user?.user_metadata?.username ?? undefined,
          },
    [isEditing, profile, user],
  );

  const {
    currentStep,
    currentIndex,
    totalSteps,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,

    data,
    updateData,
    completeOnboarding,
    isSubmitting,
  } = useOnboarding({
    initialData,
    startAtStep: firstStep,
  });

  // Numbers shown on screen, counted from the first visible step.
  const stepNumber = currentIndex - firstIndex + 1;
  const visibleSteps = totalSteps - firstIndex;
  const visibleProgress = (stepNumber / visibleSteps) * 100;

  const stepInfo = useMemo(() => {
    return ONBOARDING_STEP_INFO[currentIndex];
  }, [currentIndex]);

  const handleNext = async () => {
    if (isLastStep) {
      setCompleteError(null);
      const success = await completeOnboarding();
      if (success) {
        // Reload the server data so the profile page shows the new values.
        router.refresh();
        if (isEditing && onExit) {
          onExit();
        }
      } else {
        setCompleteError(
          !data.terms_accepted
            ? "Please accept the Terms of Service and Privacy Policy to continue."
            : "Something went wrong. Please try again.",
        );
      }
      return;
    }
    nextStep();
  };

  const handleBack = () => {
    if (isFirstStep && isEditing && onExit) {
      onExit();
      return;
    }
    previousStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep user={user} profile={profile} />;

      case "basic":
        return <BasicInfoStep data={data} updateData={updateData} />;

      case "location":
        return <LocationStep data={data} updateData={updateData} />;

      case "collector":
        return <CollectorTypeStep data={data} updateData={updateData} />;

      case "experience":
        return <ExperienceStep data={data} updateData={updateData} />;

      case "games":
        return <FavoriteGamesStep data={data} updateData={updateData} />;

      case "notifications":
        return <NotificationStep data={data} updateData={updateData} />;

      case "finish":
        return (
          <FinishStep
            data={data}
            loading={isSubmitting}
            error={completeError}
            termsAccepted={data.terms_accepted}
            onTermsChange={(accepted) =>
              updateData({ terms_accepted: accepted })
            }
          />
        );

      default:
        return <WelcomeStep user={user} profile={profile} />;
    }
  };

  return (
    <StepLayout
      title={stepInfo.title}
      description={stepInfo.description}
      currentStep={stepNumber}
      totalSteps={visibleSteps}
      progress={visibleProgress}
      onBack={handleBack}
      onNext={handleNext}
      disableBack={isFirstStep && !isEditing}
      nextLoading={isSubmitting}
      nextDisabled={
        (isLastStep && !data.terms_accepted) ||
        (currentStep === "basic" && !validateBasicInfo(data).isValid)
      }
      nextLabel={
        currentStep === "welcome"
          ? "Get Started"
          : isLastStep
            ? isEditing
              ? "Save Changes"
              : "Complete Profile"
            : "Continue"
      }
      backLabel={isFirstStep && isEditing ? "Cancel" : "Back"}
    >
      {renderStep()}
    </StepLayout>
  );
}
