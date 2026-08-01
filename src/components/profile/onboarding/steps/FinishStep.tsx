"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

import type { OnboardingData } from "@/hooks/useOnboarding";

interface FinishStepProps {
  data: OnboardingData;
  loading?: boolean;
  error?: string | null;
  termsAccepted?: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export default function FinishStep({
  data,
  loading = false,
  error = null,
  termsAccepted = false,
  onTermsChange,
}: FinishStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8B85C]/10 text-[#E8B85C]">
        <CheckCircle2 className="h-7 w-7" />
      </span>

      <div className="w-full rounded-xl border border-white/10 bg-[#1E1240] p-6 text-left">
        <div className="flex flex-col gap-4">
          <SummaryRow label="Display Name" value={data.display_name} />
          <SummaryRow label="Username" value={data.username} />
          <SummaryRow
            label="Location"
            value={[data.city, data.state].filter(Boolean).join(", ")}
          />
          <SummaryRow label="Collector Type" value={data.collector_type} />
          <SummaryRow
            label="Favorite Games"
            value={data.favorite_games?.join(", ")}
          />
        </div>
      </div>

      <label className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-[#1E1240] p-4 text-left">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-transparent accent-[#E8B85C]"
        />
        <span className="text-sm text-white/70">
          I agree to the{" "}
          <Link
            href="/terms"
            target="_blank"
            className="text-[#E8B85C] underline underline-offset-2 hover:text-[#E8B85C]/80"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="text-[#E8B85C] underline underline-offset-2 hover:text-[#E8B85C]/80"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {error && (
        <div className="flex w-full items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-none last:pb-0">
      <span className="text-sm font-medium text-white">{label}</span>
      <span className="text-sm text-white/50">{value || "—"}</span>
    </div>
  );
}
