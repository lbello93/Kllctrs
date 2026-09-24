"use client";

import { BarChart3 } from "lucide-react";

export default function EmptyDashboard() {
  return (
    <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-white/80">
      <div className="max-w-md text-center px-6">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100">
          <BarChart3 className="h-8 w-8 text-[#5f2eea]/50" />
        </div>
        <h2 className="text-xl font-black text-[#1a0a3d]">No analytics yet</h2>
        <p className="mt-2 text-sm text-[#4a3f6b]/50">
          Once visitors start using your platform, you'll see page views,
          countries, cities, and visitor trends here.
        </p>
      </div>
    </div>
  );
}
