"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { motion } from "framer-motion";
import { Sparkles, Loader2, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      try {
        const code = searchParams.get("code");
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        // ===========================
        // OAuth / PKCE Flow
        // ===========================
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            setError(error.message);
            return;
          }
        }

        // ===========================
        // Email Verification Flow
        // ===========================
        else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as
              | "signup"
              | "invite"
              | "magiclink"
              | "recovery"
              | "email_change"
              | "email",
          });

          if (error) {
            setError(error.message);
            return;
          }
        }

        // ===========================
        // Invalid Callback
        // ===========================
        else {
          setError("Invalid verification link.");
          return;
        }

        // ===========================
        // Get Authenticated User
        // ===========================
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Unable to fetch authenticated user.");
          return;
        }

        // ===========================
        // Check if profile exists
        // ===========================
        const { data: existingProfile, error: profileLookupError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

        if (profileLookupError) {
          setError(profileLookupError.message);
          return;
        }

        // ===========================
        // Create Profile
        // ===========================
        if (!existingProfile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata.full_name ?? "",
              username:
                user.user_metadata.username ?? user.email?.split("@")[0] ?? "",
            });

          if (insertError) {
            setError(insertError.message);
            return;
          }
        }

        // ===========================
        // Success
        // ===========================
        router.replace("/dashboard");
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Something went wrong during authentication.");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5f2eea] to-[#4a1fa8] flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <span className="font-black text-xl tracking-tighter text-[#1a0a3d]">
            KLLCTRS
          </span>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-8 text-center">
          {error ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                <TriangleAlert className="w-7 h-7 text-red-500" />
              </div>

              <h1 className="text-xl font-black text-[#1a0a3d] mb-2">
                Authentication Failed
              </h1>

              <p className="text-sm text-[#4a3f6b]/70 mb-6">{error}</p>

              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8]"
              >
                Back to Login →
              </Link>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-7 h-7 text-[#5f2eea] animate-spin" />
              </div>

              <h1 className="text-xl font-black text-[#1a0a3d] mb-2">
                Completing Sign In
              </h1>

              <p className="text-sm text-[#4a3f6b]/60">
                Please wait while we verify your account...
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
