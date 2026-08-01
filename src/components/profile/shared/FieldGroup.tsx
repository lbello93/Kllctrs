"use client";

interface FieldGroupProps {
  label: string;
  children: React.ReactNode;
}

export default function FieldGroup({ label, children }: FieldGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f2eea]">
        {label}
      </h3>

      {children}
    </div>
  );
}
