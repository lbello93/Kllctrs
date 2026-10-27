"use client";

function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-violet-100/70 ${className}`} />
  );
}

export default function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-violet-100 bg-white/80 p-5"
          >
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white/80 p-6">
        <div className="mb-5 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-[360px] w-full" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-violet-100 bg-white/80 p-6"
          >
            <div className="mb-5 space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-[360px] w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
