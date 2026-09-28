"use client";

import { useEffect, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MailCheck, TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { safeRedirect } from "@/lib/auth/safeRedirect";
import {
  bodyM,
  headingM,
  primaryButtonClass,
} from "@/components/profile/onboarding/shared/onboardingStyles";
import AuthLogo from "./AuthLogo";

type Mode = "signin" | "signup";

/* ---------- small building blocks ---------- */

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

function Field({ label, hint, id, ...props }: FieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block font-inter text-[12px] font-medium leading-[15px] text-[#151E3C]/70"
      >
        {label}
      </label>
      <input
        id={fieldId}
        {...props}
        className="h-11 w-full rounded-[10px] border border-[#151E3C]/15 bg-white px-4 font-inter text-[14px] text-[#151E3C] outline-none transition placeholder:text-[#151E3C]/35 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
      />
      {hint && (
        <p className="mt-1.5 font-inter text-[12px] leading-[15px] text-[#151E3C]/50">
          {hint}
        </p>
      )}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 font-inter text-[14px] leading-5 text-red-700"
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/* ---------- sign in ---------- */

function SignInForm({
  redirectTo,
  onNeedsVerification,
}: {
  redirectTo: string;
  onNeedsVerification: (email: string) => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);

      // Account exists but the email link was never clicked.
      if (signInError.message.toLowerCase().includes("email not confirmed")) {
        onNeedsVerification(email.trim());
        return;
      }

      setError(signInError.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
      />

      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
      />

      {error && <ErrorBanner message={error} />}

      <button
        type="submit"
        disabled={loading}
        className={`${primaryButtonClass} flex w-full items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

/* ---------- sign up ---------- */

function SignUpForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return "Username can only contain letters, numbers, and underscores";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    const cleanEmail = email.trim();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        data: {
          full_name: fullName.trim(),
          username: username.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // For an email that is already registered, Supabase returns no error
    // and no email is sent. The user comes back with an empty identities list.
    if (data.user && data.user.identities?.length === 0) {
      setError(
        "An account with this email already exists. Try signing in instead.",
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess(cleanEmail);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Full name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="John Doe"
      />

      <Field
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="john_doe"
        hint="Letters, numbers and underscores only"
      />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
      />

      <Field
        label="Password"
        name="new-password"
        type="password"
        autoComplete="new-password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        hint="At least 6 characters"
      />

      <Field
        label="Confirm password"
        name="confirm-password"
        type="password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repeat your password"
      />

      {error && <ErrorBanner message={error} />}

      <button
        type="submit"
        disabled={loading}
        className={`${primaryButtonClass} flex w-full items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}

/* ---------- check your email ---------- */

function CheckEmailPanel({
  email,
  onChangeEmail,
}: {
  email: string;
  onChangeEmail: () => void;
}) {
  const supabase = createClient();

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function handleResend() {
    setSending(true);
    setError("");
    setMessage("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/callback` },
    });

    setSending(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setMessage("Sent again. Check your inbox and your spam folder.");
    setSecondsLeft(60);
  }

  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
        <MailCheck className="h-6 w-6" />
      </div>

      <div className="space-y-2">
        <h1 className={`${headingM} text-[#151E3C]`}>Check your email</h1>
        <p className={`${bodyM} text-[#151E3C]/60`}>We sent a link to</p>
        <p className="break-all font-inter text-[14px] font-medium leading-[17px] text-[#151E3C]">
          {email}
        </p>
        <p className={`${bodyM} text-[#151E3C]/60`}>
          Click it to activate your account.
        </p>
      </div>

      {message && (
        <p className="font-inter text-[14px] leading-5 text-emerald-700">
          {message}
        </p>
      )}
      {error && <ErrorBanner message={error} />}

      <button
        type="button"
        onClick={handleResend}
        disabled={sending || secondsLeft > 0}
        className="h-10 w-full rounded-[10px] border border-[#8B5CF6]/40 bg-white font-inter text-[14px] leading-[17px] text-[#5B18BE] transition hover:bg-[#8B5CF6]/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending
          ? "Sending…"
          : secondsLeft > 0
            ? `Resend email in ${secondsLeft}s`
            : "Resend email"}
      </button>

      <button
        type="button"
        onClick={onChangeEmail}
        className="font-inter text-[14px] leading-[17px] text-[#151E3C]/60 underline-offset-4 transition hover:text-[#151E3C] hover:underline"
      >
        Use a different email
      </button>
    </div>
  );
}

/* ---------- the screen ---------- */

export default function AuthScreen() {
  const searchParams = useSearchParams();

  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const callbackError = searchParams.get("error");

  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-[420px]"
    >
      <div className="rounded-2xl border border-[#151E3C]/10 bg-white p-6 shadow-[0_8px_30px_rgba(21,30,60,0.06)] sm:p-8">
        {pendingEmail ? (
          <CheckEmailPanel
            email={pendingEmail}
            onChangeEmail={() => setPendingEmail(null)}
          />
        ) : (
          <>
            <div
              role="tablist"
              className="mb-6 grid grid-cols-2 rounded-[10px] bg-[#151E3C]/5 p-1"
            >
              {(["signin", "signup"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => setMode(value)}
                  className={`h-9 rounded-[8px] font-inter text-[14px] leading-[17px] transition ${mode === value ? "bg-white text-[#151E3C] shadow-sm" : "text-[#151E3C]/55 hover:text-[#151E3C]"}`}
                >
                  {value === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <div className="mb-6 space-y-1">
              <h1 className={`${headingM} text-[#151E3C]`}>
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className={`${bodyM} text-[#151E3C]/60`}>
                {mode === "signin"
                  ? "Sign in to see your saved shops and events."
                  : "Save shows, track shops, never miss an event."}
              </p>
            </div>

            {callbackError && (
              <div className="mb-4">
                <ErrorBanner message={callbackError} />
              </div>
            )}

            {mode === "signin" ? (
              <SignInForm
                redirectTo={redirectTo}
                onNeedsVerification={setPendingEmail}
              />
            ) : (
              <SignUpForm onSuccess={setPendingEmail} />
            )}
          </>
        )}
      </div>

      <AuthLogo size={36} className="mt-8" />
    </motion.div>
  );
}
