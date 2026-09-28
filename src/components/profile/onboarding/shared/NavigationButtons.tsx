"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { primaryButtonClass } from "./onboardingStyles";

// Gold gradient for Back and Cancel. Navy text keeps it easy to read.
const goldButtonClass =
  "flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(94.43deg,#F0C040_35.73%,#FCDB9F_100%)] px-[14px] py-[10px] font-inter text-[14px] font-normal leading-[17px] tracking-[-0.01em] text-[#151E3C] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  disableBack?: boolean;
  isLoading?: boolean;
  nextDisabled?: boolean;
}

export function NavigationButtons({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Continue",
  disableBack = false,
  isLoading = false,
  nextDisabled = false,
}: NavigationButtonsProps) {
  return (
    <nav
      className="flex items-center justify-between gap-3"
      aria-label="Onboarding navigation"
    >
      <button
        type="button"
        onClick={onBack}
        disabled={disableBack || isLoading}
        className={goldButtonClass}
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLoading || nextDisabled}
        className={`${primaryButtonClass} flex min-w-[140px] flex-1 items-center justify-center gap-2 sm:flex-none`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </nav>
  );
}
