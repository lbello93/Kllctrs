"use client";

import { caption } from "@/components/profile/onboarding/shared/onboardingStyles";

interface FieldLabelProps {
  children: React.ReactNode;
}

export default function FieldLabel({ children }: FieldLabelProps) {
  return (
    <label className={`${caption} mb-1.5 block text-[#FEF9FF]/70`}>
      {children}
    </label>
  );
}
