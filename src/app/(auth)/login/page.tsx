"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2, TriangleAlert } from "lucide-react";
import Image from "next/image";
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Default redirect is /profile instead of /dashboard
  const redirect = searchParams.get("redirect") || "/profile";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-xs font-medium text-[#4a3f6b]/60 block mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-sm px-1 sm:px-0"
    >
      <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
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

      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#1a0a3d] tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-[#4a3f6b]/60">
            Sign in to your KLLCTRS account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>
      </div>

      <p className="text-sm text-[#4a3f6b]/50 mt-5 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-violet-200/40 rounded-full blur-[80px] sm:blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-fuchsia-200/30 rounded-full blur-[60px] sm:blur-[120px]" />
      </div>
      <Suspense
        fallback={
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-violet-100 bg-white/80 p-8 animate-pulse">
            <div className="h-8 bg-violet-100 rounded-xl w-3/4 mb-4" />
            <div className="h-11 bg-violet-100 rounded-xl mb-3" />
            <div className="h-11 bg-violet-100 rounded-xl mb-3" />
            <div className="h-11 bg-violet-100 rounded-xl" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
