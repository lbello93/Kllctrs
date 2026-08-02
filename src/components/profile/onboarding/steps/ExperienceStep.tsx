"use client";

import type { OnboardingData } from "@/hooks/useOnboarding";

interface Props {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function ExperienceStep({ data, updateData }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-white/70">Years collecting</label>
      <input
        type="number"
        min={0}
        max={99}
        inputMode="numeric"
        placeholder="e.g. 5"
        value={data.years_collecting ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          updateData({
            years_collecting: val === "" ? undefined : Number(val),
          });
        }}
        className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/40"
      />
    </div>
  );
}
