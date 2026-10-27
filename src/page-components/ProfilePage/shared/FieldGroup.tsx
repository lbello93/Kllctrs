"use client";

interface FieldGroupProps {
  label: string;
  children: React.ReactNode;
}

export default function FieldGroup({ label, children }: FieldGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-inter text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-[#9C7CF7]">
        {label}
      </h3>

      {children}
    </div>
  );
}
