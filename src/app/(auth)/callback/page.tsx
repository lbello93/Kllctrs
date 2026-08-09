"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function CallbackErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "Something went wrong.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <TriangleAlert className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-black text-[#1a0a3d] mb-2">
            Authentication Failed
          </h1>
          <p className="text-sm text-[#4a3f6b]/70 mb-6">{message}</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8]"
          >
            Back to Login →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
