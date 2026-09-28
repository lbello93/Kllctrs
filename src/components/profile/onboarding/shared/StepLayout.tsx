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
    <div
      data-focus-screen
      className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#151E3C]"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-5 px-4 pt-20 sm:px-6 [@media(min-height:800px)]:gap-8 [@media(min-height:800px)]:pt-28">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        />

        <StepHeader title={title} description={description} />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-4 [scrollbar-color:rgba(254,249,255,0.25)_transparent] [scrollbar-width:thin]"
        >
          {children}
        </motion.div>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-[#151E3C]">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
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
