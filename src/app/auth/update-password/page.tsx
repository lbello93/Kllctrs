"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import { getSession, updatePassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The reset link (via /callback) establishes a recovery session.
  useEffect(() => {
    getSession().then((s) => setReady(Boolean(s)));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) return setError(error.message);
    setDone(true);
    setTimeout(() => router.push("/profile"), 1500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-amethyst-500/20 bg-white/[0.03] p-8 shadow-xl">
        <h1 className="font-space-grotesk text-2xl font-bold text-cream">Set a new password</h1>

        {done ? (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-amethyst-300">
            <ShieldCheck className="size-4" /> Password updated. Redirecting…
          </p>
        ) : !ready ? (
          <p className="mt-4 text-sm text-cream/60">
            Open this page from the reset link in your email. If you got here another way,
            request a new link from the sign-in screen.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="mb-1.5 text-cream/70">New password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="text-cream" />
            </div>
            <div>
              <Label className="mb-1.5 text-cream/70">Confirm password</Label>
              <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="text-cream" />
            </div>
            {error && <p className="text-sm text-bloom-400">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" style={{ background: "#8B5CF6", color: "#FEF9FF" }}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Update password
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
