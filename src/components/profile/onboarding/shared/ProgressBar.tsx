"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  progress,
}: ProgressBarProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-white/40">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-medium text-white/40">
          {Math.round(progress)}%
        </span>
      </div>

      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={`Onboarding progress: step ${currentStep} of ${totalSteps}`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[#E8B85C]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
