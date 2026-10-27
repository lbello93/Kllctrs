"use client";

import { RefreshCw, CalendarDays, BarChart3 } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#5f2eea]" />
            <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
              Analytics Dashboard
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4a3f6b]/60">
            Real-time visitor insights across KLLCTRS
          </p>
        </div>

        <div className="flex gap-2">
          <button className="h-10 px-4 rounded-xl border border-violet-200 text-sm font-bold text-[#4a3f6b]/60 flex items-center gap-2 hover:bg-violet-50 transition-colors cursor-pointer">
            <CalendarDays size={16} />
            Last 30 Days
          </button>

          <button
            className="h-10 px-4 rounded-xl text-sm font-black text-white flex items-center gap-2 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
