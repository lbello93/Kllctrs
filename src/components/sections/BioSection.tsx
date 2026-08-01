"use client";

import FieldGroup from "../profile/shared/FieldGroup";

interface BioSectionProps {
  bio?: string;
  onChange: (value: string) => void;
}

export default function BioSection({ bio = "", onChange }: BioSectionProps) {
  return (
    <FieldGroup label="About">
      <textarea
        rows={5}
        value={bio}
        placeholder="Tell the community about yourself and what you collect..."
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-[#1E1240]
          p-4
          text-sm
          leading-relaxed
          text-white
          outline-none
          transition
          placeholder:text-white/40
          focus:border-[#E8B85C]/40
          focus:ring-2
          focus:ring-[#E8B85C]/20
        "
      />

      <div className="text-right text-xs text-white/40">{bio.length}/200</div>
    </FieldGroup>
  );
}
