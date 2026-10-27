"use client";

import { ReactNode } from "react";
import { bodyM, displayXl } from "./onboardingStyles";

interface StepHeaderProps {
  title: string;
  description?: ReactNode;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <h1 className={`${displayXl} text-[#FEF9FF]`}>{title}</h1>

      {description && (
        <p className={`${bodyM} max-w-2xl text-[#FEF9FF]/60`}>{description}</p>
      )}
    </header>
  );
}
