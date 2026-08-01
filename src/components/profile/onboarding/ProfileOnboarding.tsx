"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useOnboarding, OnboardingData } from "@/hooks/useOnboarding";
import { ONBOARDING_STEP_INFO } from "@/lib/profile/constants";

import WelcomeStep from "./steps/WelcomeStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import LocationStep from "./steps/LocationStep";
import CollectorTypeStep from "./steps/CollectorTypeStep";
import FavoriteGamesStep from "./steps/FavoriteGamesStep";
import NotificationStep from "./steps/NotificationStep";
import FinishStep from "./steps/FinishStep";
import { StepLayout } from "./shared/StepLayout";

interface ProfileOnboardingProps {
  user: any;
  profile: any;
  isEditing?: boolean;
  onExit?: () => void;
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
}: ProfileOnboardingProps) {
  const router = useRouter();
  const [completeError, setCompleteError] = useState<string | null>(null);

  const initialData = useMemo(
    () => (isEditing ? profileToOnboardingData(profile) : undefined),
    [isEditing, profile],
  );

  const {
    currentStep,
    currentIndex,
    progress,
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
    startAtStep: isEditing ? "basic" : undefined,
  });

  const stepInfo = useMemo(() => {
    return ONBOARDING_STEP_INFO[currentIndex];
  }, [currentIndex]);

  const handleNext = async () => {
    if (isLastStep) {
      setCompleteError(null);
      const success = await completeOnboarding();
      if (success) {
        if (isEditing && onExit) {
          onExit();
        } else {
          router.refresh();
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
    <div>
      {isEditing && (
        <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </button>
        </div>
      )}

      <StepLayout
        title={stepInfo.title}
        description={stepInfo.description}
        currentStep={currentIndex + 1}
        totalSteps={totalSteps}
        progress={progress}
        onBack={handleBack}
        onNext={handleNext}
        disableBack={false}
        nextDisabled={isLastStep && !data.terms_accepted}
        nextLoading={isSubmitting}
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
    </div>
  );
}
