"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { requestPasswordReset } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await requestPasswordReset(email);
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-amethyst-500/20 bg-white/[0.03] p-8 shadow-xl">
        <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-cream/60 hover:text-cream">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>

        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-4 size-10 text-amethyst-400" />
            <h1 className="font-space-grotesk text-xl font-bold text-cream">Check your email</h1>
            <p className="mt-2 text-sm text-cream/60">
              If an account exists for <span className="text-cream">{email}</span>, we&apos;ve sent a link to
              reset your password. The link opens the page where you set a new one.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-space-grotesk text-2xl font-bold text-cream">Reset your password</h1>
            <p className="mt-1 text-sm text-cream/60">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label className="mb-1.5 text-cream/70">Email</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="text-cream"
                />
              </div>
              {error && <p className="text-sm text-bloom-400">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                style={{ background: "#8B5CF6", color: "#FEF9FF" }}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Send reset link
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
