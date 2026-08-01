"use client";

import LocationSection from "@/components/profile/edit/sections/LocationSection";

import type { OnboardingData } from "@/hooks/useOnboarding";

interface LocationStepProps {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function LocationStep({ data, updateData }: LocationStepProps) {
  return (
    <LocationSection
      country={data.country}
      state={data.state}
      city={data.city}
      timezone={data.timezone}
      onCountryChange={(value) => updateData({ country: value })}
      onStateChange={(value) => updateData({ state: value })}
      onCityChange={(value) => updateData({ city: value })}
      onTimezoneChange={(value) => updateData({ timezone: value })}
    />
  );
}
