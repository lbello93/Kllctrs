"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function DashboardSection({
  title,
  description,
  children,
  action,
}: DashboardSectionProps) {
  return (
    <section className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-[#5f2eea]" />
            <h2 className="text-lg font-black text-[#1a0a3d]">{title}</h2>
          </div>
          {description && (
            <p className="mt-1 text-sm text-[#4a3f6b]/50">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center">{action}</div>}
      </div>
      <div className="min-h-[300px]">{children}</div>
    </section>
  );
}
