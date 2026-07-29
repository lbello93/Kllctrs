"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md rounded-xl border p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>

        <p>We've sent a verification email to</p>

        <p className="font-semibold mt-2">{email}</p>

        <p className="mt-6 text-sm text-gray-500">
          Click the verification link in your inbox to activate your account.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
