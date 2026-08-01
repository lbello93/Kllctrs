"use client";

import CollectorTypeSection from "@/components/profile/edit/sections/CollectorTypeSection";

import type { OnboardingData } from "@/hooks/useOnboarding";

interface CollectorTypeStepProps {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function CollectorTypeStep({
  data,
  updateData,
}: CollectorTypeStepProps) {
  return (
    <CollectorTypeSection
      value={data.collector_type}
      onChange={(value) =>
        updateData({
          collector_type: value,
        })
      }
    />
  );
}
