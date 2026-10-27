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
        <span className="font-inter text-[12px] font-medium uppercase leading-[15px] tracking-widest text-[#FEF9FF]/50">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-inter text-[12px] font-medium leading-[15px] text-[#FEF9FF]/50">
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
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(94.43deg,#5B18BE_35.73%,#9C7CF7_100%)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
