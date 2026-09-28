"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  bodyM,
  headingM,
} from "@/components/profile/onboarding/shared/onboardingStyles";

interface CollectorTypeSectionProps {
  value?: string;
  onChange: (value: string) => void;
}

const collectorTypes = [
  {
    id: "casual",
    title: "Casual Collector",
    description: "Collect for fun and personal enjoyment.",
  },
  {
    id: "investor",
    title: "Investor",
    description: "Focus on long-term value and rare cards.",
  },
  {
    id: "trader",
    title: "Trader",
    description: "Buy, sell and trade frequently.",
  },
  {
    id: "competitive",
    title: "Competitive Player",
    description: "Collect mainly to play tournaments.",
  },
];

export default function CollectorTypeSection({
  value,
  onChange,
}: CollectorTypeSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className={`${headingM} text-[#FEF9FF]`}>
          What type of collector are you?
        </h3>

        <p className={`${bodyM} text-[#FEF9FF]/50`}>
          Choose the option that best describes you.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {collectorTypes.map((type) => (
          <Card
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`cursor-pointer border bg-[#FEF9FF]/[0.06] transition-all ${
              value === type.id
                ? "border-[#9C7CF7] ring-2 ring-[#9C7CF7]/30"
                : "border-white/10 hover:border-[#9C7CF7]/40"
            }`}
          >
            <CardContent className="p-5">
              <h4 className="font-semibold text-white">{type.title}</h4>

              <p className="mt-2 text-sm text-white/50">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
