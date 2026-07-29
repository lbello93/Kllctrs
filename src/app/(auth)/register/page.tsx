"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Sparkles, Loader2, TriangleAlert } from "lucide-react";
import Image from "next/image";

function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      setLoading(false);
      return;
    }

    // Sign up — with email confirmation OFF in Supabase,
    // this immediately creates a session (JWT) and logs the user in
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        data: {
          full_name: fullName,
          username: username,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    console.log("Signup Result:", data);
    console.log("Signup Error:", signUpError);

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    return;
  };

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-xs font-medium text-[#4a3f6b]/60 block mb-1.5";

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-5 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-[#1a0a3d] tracking-tight mb-1">
          Create account
        </h1>
        <p className="text-sm text-[#4a3f6b]/60">
          Save shows, track shops, never miss an event
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="john_doe"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
          <p className="text-xs text-[#4a3f6b]/35 mt-1.5">
            At least 6 characters
          </p>
        </div>
        <div>
          <label className={labelClass}>Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center gap-2 text-sm text-red-600">
            <TriangleAlert className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-11 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 border-0 shadow-xl shadow-violet-500/25 disabled:opacity-50 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Sign up"
          )}
        </motion.button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      <Suspense>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm px-1 sm:px-0"
        >
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <Image
                src="/footer/Gem_Pink.png"
                alt="Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-black text-xl tracking-tighter text-[#1a0a3d]">
              KLLCTRS
            </span>
          </div>

          <RegisterForm />

          <p className="text-sm text-[#4a3f6b]/50 mt-5 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </Suspense>
    </div>
  );
}
