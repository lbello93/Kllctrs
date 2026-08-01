"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { StepHeader } from "./StepHeader";
import { NavigationButtons } from "./NavigationButtons";

interface StepLayoutProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onBack: () => void;
  onNext: () => void;
  disableBack?: boolean;
  nextLabel?: string;
  backLabel?: string;
  nextLoading?: boolean;
  nextDisabled?: boolean;
  children: ReactNode;
}

export function StepLayout({
  title,
  description,
  currentStep,
  totalSteps,
  progress,
  onBack,
  onNext,
  disableBack = false,
  nextLabel = "Continue",
  backLabel = "Back",
  nextLoading = false,
  nextDisabled = false,
  children,
}: StepLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-var(--navbar-height,4rem))] w-full bg-[#150B30]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        />

        <StepHeader title={title} description={description} />

        <motion.main
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex w-full flex-col gap-8"
        >
          {children}
        </motion.main>

        <div className="w-full border-t border-white/10 pt-6">
          <NavigationButtons
            onBack={onBack}
            onNext={onNext}
            backLabel={backLabel}
            nextLabel={nextLabel}
            disableBack={disableBack}
            isLoading={nextLoading}
            nextDisabled={nextDisabled}
          />
        </div>
      </div>
    </div>
  );
}
