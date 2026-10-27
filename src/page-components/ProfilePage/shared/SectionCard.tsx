import type { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function SectionCard({
  children,
  className = "",
  title,
}: SectionCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-[#ECE8F5]
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
        ${className}
      `}
    >
      {title && (
        <div className="border-b border-[#F3F0FA] px-6 py-5">
          <h2 className="text-lg font-bold text-[#231942]">{title}</h2>
        </div>
      )}

      {children}
    </div>
  );
}
