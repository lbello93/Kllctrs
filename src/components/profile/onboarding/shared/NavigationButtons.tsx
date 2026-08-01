"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Onboarding navigation"
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={disableBack || isLoading}
        className="w-full text-white/70 hover:text-white hover:bg-white/5 sm:w-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={isLoading || nextDisabled}
        className="w-full bg-[#E8B85C] text-[#150B30] hover:bg-[#E8B85C]/90 sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </nav>
  );
}
