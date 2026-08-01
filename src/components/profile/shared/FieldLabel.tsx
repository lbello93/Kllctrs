"use client";

interface FieldLabelProps {
  children: React.ReactNode;
}

export default function FieldLabel({ children }: FieldLabelProps) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-zinc-600">
      {children}
    </label>
  );
}
