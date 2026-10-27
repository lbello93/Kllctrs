import { Suspense } from "react";
import AuthScreen from "./AuthScreen";

export default function AuthPage() {
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
