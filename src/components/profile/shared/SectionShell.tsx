import Link from "next/link";
import type { ReactNode } from "react";
import { primaryButtonClass } from "@/components/profile/onboarding/shared/onboardingStyles";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  count: number;
}

export function SectionHeader({ title, subtitle, count }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-space-grotesk text-[24px] leading-[30px] tracking-[-0.01em] text-[#151E3C]">
          {title}
        </h2>
        <p className="mt-1 font-inter text-[14px] leading-[17px] text-[#151E3C]/60">
          {subtitle}
        </p>
      </div>

      {count > 0 && (
        <span className="shrink-0 rounded-full bg-[#8B5CF6]/10 px-3 py-1 font-inter text-[12px] font-medium leading-[15px] text-[#5B18BE]">
          {count} saved
        </span>
      )}
    </div>
  );
}

interface EmptyPanelProps {
  icon: ReactNode;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export function EmptyPanel({
  icon,
  title,
  text,
  ctaLabel,
  ctaHref,
}: EmptyPanelProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#CBBEFB] bg-white px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
        {icon}
      </div>

      <h3 className="font-space-grotesk text-[20px] leading-[26px] tracking-[-0.01em] text-[#151E3C]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm font-inter text-[14px] leading-5 text-[#151E3C]/60">
        {text}
      </p>

      <Link
        href={ctaHref}
        className={`${primaryButtonClass} mt-6 inline-flex items-center justify-center`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
