"use client";

import { Minus, Plus } from "lucide-react";
import type { OnboardingData } from "@/hooks/useOnboarding";

const MIN_YEARS = 0;
const MAX_YEARS = 99;

const QUICK_PICKS = [
  { label: "Just started", value: 0 },
  { label: "1 year", value: 1 },
  { label: "3 years", value: 3 },
  { label: "5 years", value: 5 },
  { label: "10 years", value: 10 },
  { label: "20 years", value: 20 },
];

const clamp = (n: number) =>
  Math.min(MAX_YEARS, Math.max(MIN_YEARS, Math.floor(n)));

const stepButtonClass =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#FEF9FF]/[0.06] text-[#FEF9FF] transition hover:border-[#9C7CF7]/60 hover:bg-[#9C7CF7]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C7CF7]/40 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-[#FEF9FF]/[0.06]";

interface Props {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function ExperienceStep({ data, updateData }: Props) {
  const value =
    typeof data.years_collecting === "number" ? data.years_collecting : null;
  const shown = value ?? 0;

  const setYears = (next: number | undefined) =>
    updateData({ years_collecting: next });

  return (
    <div className="my-auto flex flex-col gap-6">
      <div className="rounded-2xl border border-white/10 bg-[#FEF9FF]/[0.06] p-5 sm:p-6">
        <p className="mb-4 text-center font-inter text-[12px] font-medium uppercase leading-[15px] tracking-[0.12em] text-[#9C7CF7] sm:text-left">
          Years collecting
        </p>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="One year less"
            disabled={shown <= MIN_YEARS}
            onClick={() => setYears(clamp(shown - 1))}
            className={stepButtonClass}
          >
            <Minus className="h-5 w-5" />
          </button>

          <div className="flex items-baseline justify-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              aria-label="Years collecting"
              placeholder="0"
              value={value === null ? "" : String(value)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setYears(digits === "" ? undefined : clamp(Number(digits)));
              }}
              className="w-24 bg-transparent text-center font-unica-one text-[56px] leading-[64px] text-[#FEF9FF] outline-none placeholder:text-[#FEF9FF]/25"
            />
            <span className="font-inter text-[14px] leading-[17px] text-[#FEF9FF]/60">
              {shown === 1 ? "year" : "years"}
            </span>
          </div>

          <button
            type="button"
            aria-label="One year more"
            disabled={shown >= MAX_YEARS}
            onClick={() => setYears(clamp(shown + 1))}
            className={stepButtonClass}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {value !== null && (
          <p className="mt-4 text-center font-inter text-[14px] leading-[17px] text-[#FEF9FF]/60">
            {value === 0
              ? "Welcome to the hobby."
              : `That puts your start around ${new Date().getFullYear() - value}.`}
          </p>
        )}
      </div>

      <div
        role="group"
        aria-label="Quick picks"
        className="flex flex-wrap justify-center gap-2 sm:justify-start"
      >
        {QUICK_PICKS.map((pick) => {
          const active = value === pick.value;

          return (
            <button
              key={pick.label}
              type="button"
              aria-pressed={active}
              onClick={() => setYears(pick.value)}
              className={`h-9 rounded-full border px-4 font-inter text-[14px] leading-[17px] transition ${active ? "border-[#9C7CF7] bg-[#9C7CF7]/20 text-[#FEF9FF]" : "border-white/10 bg-[#FEF9FF]/[0.06] text-[#FEF9FF]/70 hover:border-[#9C7CF7]/50 hover:text-[#FEF9FF]"}`}
            >
              {pick.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
