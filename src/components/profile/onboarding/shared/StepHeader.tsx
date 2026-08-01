"use client";

import { ReactNode } from "react";

interface StepHeaderProps {
  title: string;
  description?: ReactNode;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>

      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
