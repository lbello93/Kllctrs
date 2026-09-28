import { Suspense } from "react";
import type { Metadata } from "next";
import AuthScreen from "@/components/auth/AuthScreen";

export const metadata: Metadata = {
  title: "Sign in | KLLCTRS",
  description: "Sign in or create your KLLCTRS account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FEF9FF] px-4 py-12">
      <Suspense
        fallback={
          <div className="h-[420px] w-full max-w-[420px] animate-pulse rounded-2xl bg-white" />
        }
      >
        <AuthScreen />
      </Suspense>
    </div>
  );
}
