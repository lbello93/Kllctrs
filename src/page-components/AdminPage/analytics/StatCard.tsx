"use client";

import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase">
            {title}
          </p>
          <h3 className="mt-1 text-3xl font-black tracking-tight text-[#5f2eea]">
            {value}
          </h3>
          {subtitle && <p className="text-sm text-[#4a3f6b]/50">{subtitle}</p>}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-[#5f2eea] transition-colors duration-300 group-hover:bg-[#5f2eea] group-hover:text-white">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              trend.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend.value}
          </span>
          <span className="text-xs text-[#4a3f6b]/40">vs last period</span>
        </div>
      )}
    </div>
  );
}
