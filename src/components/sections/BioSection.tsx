"use client";

import { BIO_RULES } from "@/lib/profile/constants";
import FieldGroup from "../profile/shared/FieldGroup";

interface BioSectionProps {
  bio?: string;
  onChange: (value: string) => void;
}

export default function BioSection({ bio = "", onChange }: BioSectionProps) {
  const remaining = BIO_RULES.MAX_LENGTH - bio.length;

  return (
    <FieldGroup label="About">
      <div className="relative">
        <textarea
          rows={4}
          maxLength={BIO_RULES.MAX_LENGTH}
          value={bio}
          placeholder="Tell the community about yourself and what you collect..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-2xl border border-white/10 bg-[#FEF9FF]/[0.06] p-4 pb-8 font-inter text-[14px] leading-6 text-[#FEF9FF] outline-none transition placeholder:text-[#FEF9FF]/40 focus:border-[#9C7CF7] focus:ring-2 focus:ring-[#9C7CF7]/20"
        />
        <span
          className={`pointer-events-none absolute bottom-3 right-4 font-inter text-[12px] leading-[15px] ${remaining <= 20 ? "text-tuscan-700" : "text-[#FEF9FF]/40"}`}
        >
          {bio.length}/{BIO_RULES.MAX_LENGTH}
        </span>
      </div>
    </FieldGroup>
  );
}
