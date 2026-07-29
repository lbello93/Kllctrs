"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { motion } from "framer-motion";
import {
  Map,
  Store,
  Trophy,
  Newspaper,
  MessageSquare,
  Mail,
} from "lucide-react";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="relative border-t border-purple-500/20 bg-gradient-to-b from-[#050008] via-[#0b0014] to-[#020004] text-purple-200 overflow-hidden">
      {/* 🔥 Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-700/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-700/20 blur-[120px] rounded-full" />
      </div>

      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
          {/* 💎 Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="relative w-10 h-10 rounded-xl overflow-hidden "
              >
                <Image
                  src="/footer/Gem_Pink.png"
                  alt="KLLCTRS AI"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </motion.div>

              <span className="font-black text-lg text-white tracking-wide drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                KLLCTRS
              </span>
            </div>

            <p className="text-sm text-purple-300/60 leading-relaxed">
              The operating system for collectors. Discover shows, track shops,
              analyze sponsors, and get real-time insights powered by AI.
            </p>
          </div>

          {/* 🧭 Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase text-purple-300/80">
              Platform
            </h4>

            <div className="flex flex-col gap-2 text-sm">
              <FooterLink href="/events" icon={Map} label="Event Calendar" />
              <FooterLink href="/shops" icon={Store} label="Card Shops" />
              <FooterLink href="/sponsors" icon={Trophy} label="Sponsors" />
              <FooterLink href="/blog" icon={Newspaper} label="Blog" />
              <FooterLink href="/forum" icon={MessageSquare} label="Forum" />
            </div>
          </div>

          {/* 📦 Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase text-purple-300/80">
              Resources
            </h4>

            <div className="flex flex-col gap-2 text-sm">
              <span className="text-purple-400/40 hover:text-purple-300 transition cursor-default">
                AI Chatbot (eBay Data)
              </span>
              <span className="text-purple-400/40 hover:text-purple-300 transition cursor-default">
                Email Alerts
              </span>
              <span className="text-purple-400/40 hover:text-purple-300 transition cursor-default">
                Monthly Newsletter
              </span>
              <span className="text-purple-400/40 hover:text-purple-300 transition cursor-default">
                Admin Dashboard
              </span>
            </div>
          </div>

          {/* 📡 Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase text-purple-300/80">
              Connect
            </h4>

            <div className="flex items-center gap-3 mb-4">
              <IconBtn icon={Mail} />
            </div>

            <p className="text-sm text-purple-400/50">
              Built for collectors. Designed for scale.
            </p>
          </div>
        </div>

        {/* ⚖️ Bottom */}
        <div className="border-t border-purple-500/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-purple-400/50">
          <span>© 2026 KLLCTBLS. All rights reserved.</span>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-purple-200 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-purple-200 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ---------- Components ---------- */

function FooterLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-purple-300/60 hover:text-purple-200 transition duration-300 hover:translate-x-1"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function IconBtn({ icon: Icon }: { icon: any }) {
  return (
    <motion.div whileHover={{ scale: 1.2 }}>
      <div className="w-10 h-10 rounded-lg bg-purple-500/10 backdrop-blur-md border border-purple-500/20 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition cursor-pointer flex items-center justify-center">
        <Icon className="w-4 h-4 text-purple-200" />
      </div>
    </motion.div>
  );
}
