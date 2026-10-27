"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import {
  BellRing,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Building2,
  CalendarPlus,
  CircleAlert,
  Compass,
  Crown,
  EyeOff,
  Heart,
  History,
  Infinity as InfinityIcon,
  Layers,
  LoaderCircle,
  MapPin,
  Newspaper,
  Rocket,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  TrendingDown,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { unica, inter } from "@/lib/fonts";

type Feature = { label: string; icon: LucideIcon };

const FREE_FEATURES: Feature[] = [
  { label: "Shows & Shops Map (unlimited)", icon: MapPin },
  { label: "Sponsor directory browsing", icon: Building2 },
  { label: "Content Hub reading", icon: BookOpen },
  { label: "3 card appraisals per day", icon: ScanSearch },
  { label: "Save up to 5 shows or shops", icon: Bookmark },
  { label: "Basic search & filters", icon: SlidersHorizontal },
];

const PRO_FEATURES: Feature[] = [
  { label: "Everything in Free", icon: Layers },
  { label: "Unlimited card appraisals", icon: InfinityIcon },
  { label: "Full valuation history", icon: History },
  { label: "Save unlimited shows & shops", icon: BookmarkCheck },
  { label: "Morning & night hobby brief", icon: Newspaper },
  { label: "Breaking brand news alerts", icon: BellRing },
  { label: "New shows in watched areas", icon: CalendarPlus },
  { label: "New shops in watched areas", icon: Store },
  { label: "Portfolio value change alerts", icon: TrendingUp },
  { label: "Wishlist price drop alerts", icon: TrendingDown },
  { label: "Early access to new features", icon: Rocket },
  { label: "No ads, ever", icon: EyeOff },
];

const QUICK_AMOUNTS = ["4.99", "9.99", "14.99", "24.99"];
const MIN_AMOUNT = 4.99;

const PRO_GRADIENT =
  "linear-gradient(347.14deg, #9C7CF7 -14.62%, #5B18BE 33.33%, #000000 90.37%)";

export default function PricingPage() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [supportAmount, setSupportAmount] = useState("4.99");
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsPro(user?.user_metadata?.subscription_tier === "pro_beta");
    });
  }, [supabase]);

  const amountNum = parseFloat(supportAmount);
  const amountInvalid =
    supportAmount === "" || isNaN(amountNum) || amountNum < MIN_AMOUNT;

  const activateProBeta = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    if (amountInvalid) return;

    setActivating(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        subscription_tier: "pro_beta",
        subscription_since: new Date().toISOString().split("T")[0],
        intended_monthly_support: Math.max(MIN_AMOUNT, amountNum),
      },
    });

    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      setIsPro(true);
    }
    setActivating(false);
  };

  return (
    <div
      className={`${inter.className} flex min-h-[100svh] flex-col bg-[#f4f3fb]`}
    >
      {/* ───────── Hero (compact) ───────── */}
      <section className="relative isolate shrink-0 overflow-hidden px-4 pb-7 pt-[104px] sm:pt-[110px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/pricing/image.webp')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/55 to-[#2a0f5c]/75" />

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2.5 text-center">
          <h1
            className={`${unica.className} text-[#FEF9FF]`}
            style={{
              fontWeight: 400,
              fontSize: "clamp(30px, 4.5vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Support the Hobby.
          </h1>

          <p className="max-w-2xl text-[13px] leading-relaxed text-[#FEF9FF]/85 sm:text-sm">
            KLLCTRS is free at its core, and always will be. Pro is for the
            collectors who want the full experience. During our beta, it is
            yours to try at no cost.
          </p>
        </div>
      </section>

      {/* ───────── Plans ───────── */}
      <main
        id="plans"
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-3 px-4 py-4 sm:py-5"
      >
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[2fr_3fr]">
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(26,10,61,0.12)] ring-1 ring-[#ede9fe]"
          >
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#7c3aed]">
                Free forever
              </span>
              <div className="mt-1 flex items-baseline gap-1 text-3xl font-black text-[#1a0a3d]">
                $0
                <span className="text-sm font-normal text-[#4a3f6b]/60">
                  /mo
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#4a3f6b]/70">
                Core tools, no credit card needed.
              </p>
            </div>

            <div className="mb-4 h-px w-full bg-[#ede9fe]" />

            <ul className="mb-4 flex flex-1 flex-col justify-evenly gap-2.5">
              {FREE_FEATURES.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-[13px] text-[#4a3f6b]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#f5f3ff] text-[#7c3aed]">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {isPro ? (
              <Link
                href="/maps"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] text-sm font-bold text-[#5f2eea] transition-colors hover:bg-[#ede9fe]"
              >
                <Compass className="h-4 w-4" aria-hidden />
                Explore the Map
              </Link>
            ) : (
              <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#ede9fe] bg-[#f5f3ff] text-sm font-semibold text-[#7c3aed]">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Your current plan
              </div>
            )}
          </motion.div>

          {/* Pro Beta plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative flex flex-col overflow-hidden rounded-2xl p-5 shadow-[0_8px_24px_rgba(91,24,190,0.35)] ring-1 ring-white/10"
            style={{ background: PRO_GRADIENT }}
          >
            <div
              className="pointer-events-none absolute -right-5 -top-5 h-40 w-40 rounded-full"
              style={{
                background: "rgba(156,124,247,0.25)",
                filter: "blur(50px)",
              }}
            />

            <div className="relative flex flex-1 flex-col">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#fde047]">
                  <Crown className="h-3.5 w-3.5" aria-hidden />
                  Pro Beta
                </span>
                <span className="rounded-full bg-[#fde047]/20 px-2 py-0.5 text-[9px] font-black text-[#fde047]">
                  FREE DURING BETA
                </span>
              </div>

              <AnimatePresence mode="wait">
                {isPro ? (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-3xl font-black text-white">Active</div>
                    <p className="mt-0.5 text-xs text-white/70">
                      You&apos;re on Pro Beta. Enjoy the full experience.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-3xl font-black text-white">
                      Free now
                    </div>
                    <p className="mt-0.5 text-xs text-white/70">
                      Pay what you think it&apos;s worth when we launch. Min
                      $4.99/mo.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="my-4 h-px w-full bg-white/15" />

              <ul className="mb-4 grid flex-1 grid-cols-1 content-between gap-x-4 gap-y-2.5 sm:grid-cols-2">
                {PRO_FEATURES.map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 text-[13px] leading-tight text-white/90"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fde047]/15 text-[#fde047]">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>

              {!isPro ? (
                <div className="space-y-2.5">
                  <div className="rounded-xl border border-white/15 bg-white/[0.07] p-3 backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/85">
                        <Heart
                          className="h-3.5 w-3.5 text-[#f9a8d4]"
                          aria-hidden
                        />
                        Support the Hobby
                      </span>
                      <span className="text-[11px] text-white/55">
                        Min $4.99/mo
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {QUICK_AMOUNTS.map((amt) => {
                        const selected = supportAmount === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setSupportAmount(amt)}
                            aria-pressed={selected}
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              selected
                                ? "border-[#fde047] bg-[#fde047] text-[#1a0a3d]"
                                : "border-white/20 bg-white/5 text-white/80 hover:bg-white/15"
                            }`}
                          >
                            ${amt}
                          </button>
                        );
                      })}

                      <label htmlFor="support-amount" className="sr-only">
                        Monthly support amount in US dollars
                      </label>
                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white/70">
                          $
                        </span>
                        <input
                          id="support-amount"
                          type="number"
                          inputMode="decimal"
                          min="4.99"
                          step="0.01"
                          value={supportAmount}
                          onChange={(e) => setSupportAmount(e.target.value)}
                          placeholder="4.99"
                          aria-invalid={amountInvalid}
                          className="h-8 w-20 rounded-lg border border-white/20 bg-white/10 px-2 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#fde047] focus:ring-2 focus:ring-[#fde047]/30"
                        />
                        <span className="text-[11px] text-white/55">/mo</span>
                      </div>
                    </div>

                    {amountInvalid && (
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#fca5a5]">
                        <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                        Minimum is $4.99/mo
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    onClick={activateProBeta}
                    disabled={activating || amountInvalid}
                    whileHover={{
                      scale: activating || amountInvalid ? 1 : 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed, #a855f7, #d946ef)",
                      boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
                    }}
                  >
                    {activating ? (
                      <>
                        <LoaderCircle
                          className="h-4 w-4 animate-spin"
                          aria-hidden
                        />
                        Activating
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" aria-hidden />
                        Try Pro Beta Free
                      </>
                    )}
                  </motion.button>

                  {error && (
                    <p
                      role="alert"
                      className="flex items-center justify-center gap-1.5 text-[11px] text-[#fca5a5]"
                    >
                      <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                      {error}
                    </p>
                  )}

                  <p className="text-center text-[10px] text-white/50">
                    No credit card required. Beta access is free. You&apos;ll be
                    notified before any charges.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#fde047]/30 bg-[#fde047]/10 p-3 text-center">
                  <p className="flex items-center justify-center gap-2 text-sm font-black text-[#fde047]">
                    <Crown className="h-4 w-4" aria-hidden />
                    You&apos;re a Pro Beta member
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">
                    We&apos;ll notify you before the subscription model goes
                    live.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Beta Promise (slim strip) */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-[#ede9fe] bg-[#f5f3ff] px-4 py-2.5 text-center text-xs text-[#4a3f6b]/80">
          <ShieldCheck
            className="h-4 w-4 shrink-0 text-[#7c3aed]"
            aria-hidden
          />
          <p>
            <span className="font-black text-[#1a0a3d]">Beta Promise:</span>{" "}
            free access for the whole beta, plenty of notice, and a special rate
            when paid plans launch.
          </p>
        </div>
      </main>
    </div>
  );
}
