"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, Lock, Heart, ArrowRight } from "lucide-react";
import { unica, inter } from "@/lib/fonts";
import { useMemo } from "react";
import type { User } from "@supabase/supabase-js";
const FREE_FEATURES = [
  "Shows & Shops Map (unlimited)",
  "Sponsor directory browsing",
  "Content Hub reading",
  "3 card appraisals per day",
  "Save up to 5 shows or shops",
  "Basic search & filters",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited card appraisals",
  "Full valuation history",
  "Save unlimited shows & shops",
  "Morning & night hobby brief",
  "Breaking brand news alerts",
  "New shows in watched areas",
  "New shops in watched areas",
  "Portfolio value change alerts",
  "Wishlist price drop alerts",
  "Early access to new features",
  "No ads, ever",
];

export default function PricingPage() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [supportAmount, setSupportAmount] = useState("4.99");
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsPro(user?.user_metadata?.subscription_tier === "pro_beta");
    });
  }, []);

  const activateProBeta = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    setActivating(true);
    const amount = parseFloat(supportAmount);
    await supabase.auth.updateUser({
      data: {
        subscription_tier: "pro_beta",
        subscription_since: new Date().toISOString().split("T")[0],
        intended_monthly_support: isNaN(amount) ? 4.99 : Math.max(4.99, amount),
      },
    });
    setIsPro(true);
    setActivated(true);
    setActivating(false);
  };

  const amountNum = parseFloat(supportAmount);
  const amountInvalid =
    supportAmount !== "" && (isNaN(amountNum) || amountNum < 4.99);

  return (
    <div className="min-h-screen bg-[#f4f3fb]">
      <section className="relative w-full h-[240px] sm:h-[300px] md:h-[370px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/pricing/image.png')" }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0" />

        <div className="absolute left-1/2 -top-translate-x-1/2 -translate-x-1/2 top-[90px] sm:top-[130px] md:top-[187px] flex flex-col items-center text-center gap-3 sm:gap-5 w-[90vw] max-w-[589px] ">
          {/* Title — Unica One 48px / 50px lh / -0.04em ls / #FEF9FF */}
          <h1
            className={unica.className}
            style={{
              fontWeight: 400,
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: "50px",
              letterSpacing: "-0.04em",
              color: "#FEF9FF",
              margin: 0,
            }}
          >
            Support the Hobby.
          </h1>

          {/* Subtitle — Inter 16px / 18px lh / centered / #FEF9FF */}
          <p
            className={inter.className}
            style={{
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "18px",
              textAlign: "center",
              color: "#FEF9FF",
              margin: 0,
              width: "100%",
            }}
          >
            KLLCTRS is free at its core, and always will be. Pro is for the
            collectors who want the full experience. During our beta, it is
            yours to try at no cost.
          </p>
        </div>
      </section>

      <section id="plans" className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Free Plan ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
            style={{
              background: "#FFFFFF",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
              borderRadius: 12,
              padding: "2rem",
              minHeight: 555,
            }}
          >
            <div className="mb-6">
              <span
                className="uppercase tracking-widest"
                style={{ fontSize: 11, fontWeight: 900, color: "#7c3aed" }}
              >
                Free — Always
              </span>
              <div
                className="mt-2"
                style={{ fontSize: 36, fontWeight: 900, color: "#1a0a3d" }}
              >
                $0
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "rgba(74,63,107,0.5)",
                  }}
                >
                  /mo
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(74,63,107,0.6)",
                  marginTop: 4,
                }}
              >
                Core tools, no credit card needed.
              </p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5"
                  style={{ fontSize: 14, color: "#4a3f6b" }}
                >
                  <Check
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "#7c3aed" }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            {isPro ? (
              <Link href="/maps">
                <button
                  className="w-full rounded-xl font-bold transition-colors"
                  style={{
                    height: 44,
                    fontSize: 14,
                    color: "#5f2eea",
                    background: "#f5f3ff",
                    border: "1px solid #ddd6fe",
                  }}
                >
                  Explore the Map
                </button>
              </Link>
            ) : (
              <div
                className="rounded-2xl text-center font-semibold"
                style={{
                  padding: "12px 16px",
                  fontSize: 14,
                  background: "#f5f3ff",
                  border: "1px solid #ede9fe",
                  color: "#7c3aed",
                }}
              >
                Your current plan
              </div>
            )}
          </motion.div>

          {/* ── Pro Beta Plan ── */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col relative overflow-hidden"
            style={{
              background:
                "linear-gradient(347.14deg, #9C7CF7 -14.62%, #5B18BE 33.33%, #000000 90.37%)",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
              borderRadius: 12,
              padding: "2rem",
              minHeight: 555,
            }}
          >
            {/* Subtle ambient glow — top-right */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -20,
                right: -20,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(156,124,247,0.25)",
                filter: "blur(50px)",
              }}
            />

            <div className="relative flex flex-col flex-1">
              {/* Header row */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="uppercase tracking-widest"
                  style={{ fontSize: 11, fontWeight: 900, color: "#fde047" }}
                >
                  Pro — Beta
                </span>
                <span
                  className="rounded-full font-black"
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    background: "rgba(253,224,71,0.2)",
                    color: "#fde047",
                  }}
                >
                  FREE DURING BETA
                </span>
              </div>

              <AnimatePresence mode="wait">
                {isPro ? (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      style={{
                        fontSize: 34,
                        fontWeight: 900,
                        color: "#fff",
                        marginTop: 8,
                        marginBottom: 4,
                      }}
                    >
                      Active ✦
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 24,
                      }}
                    >
                      You&apos;re on Pro Beta. Enjoy the full experience.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      style={{
                        fontSize: 34,
                        fontWeight: 900,
                        color: "#fff",
                        marginTop: 8,
                      }}
                    >
                      Free now
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        marginTop: 4,
                        marginBottom: 24,
                      }}
                    >
                       Pay what you think it&apos;s worth when we launch — min
                      $4.99/mo.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feature list */}
              <ul className="flex-1 space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5"
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.82)" }}
                  >
                    <Star
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: "#fde047" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA block */}
              {!isPro ? (
                <div className="space-y-3">
                  {/* Support input */}
                  <div
                    className="rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: 16,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4" style={{ color: "#f9a8d4" }} />
                      <span
                        className="uppercase tracking-widest"
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        Support the Hobby
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.38)",
                        marginBottom: 12,
                      }}
                    >
                       When we launch, pay what you think it&apos;s worth. Min
                      $4.99/mo.
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        $
                      </span>
                      <input
                        type="number"
                        min="4.99"
                        step="0.01"
                        value={supportAmount}
                        onChange={(e) => setSupportAmount(e.target.value)}
                        placeholder="4.99"
                        className="flex-1 outline-none transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: 10,
                          padding: "8px 12px",
                          color: "#fff",
                          fontSize: 14,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.38)",
                        }}
                      >
                        /mo
                      </span>
                    </div>
                    {amountInvalid && (
                      <p
                        style={{ fontSize: 12, color: "#f87171", marginTop: 6 }}
                      >
                        Minimum is $4.99/mo
                      </p>
                    )}
                  </div>

                  <motion.button
                    onClick={activateProBeta}
                    disabled={activating || amountInvalid}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-2xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-0"
                    style={{
                      height: 56,
                      fontSize: 15,
                      background:
                        "linear-gradient(135deg, #7c3aed, #a855f7, #d946ef)",
                      boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
                    }}
                  >
                    {activating ? (
                      "Activating…"
                    ) : (
                      <>
                        <Zap className="w-5 h-5" /> Try Pro Beta Free
                      </>
                    )}
                  </motion.button>

                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.28)",
                      textAlign: "center",
                    }}
                  >
                     No credit card required. Beta access is free. You&apos;ll be
                    notified before any charges.
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl text-center"
                  style={{
                    background: "rgba(253,224,71,0.1)",
                    border: "1px solid rgba(253,224,71,0.3)",
                    padding: "16px 16px",
                  }}
                >
                  <p
                    style={{ color: "#fde047", fontWeight: 900, fontSize: 14 }}
                  >
                     You&apos;re a Pro Beta member ✦
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.38)",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                     We&apos;ll notify you before the subscription model goes live.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Beta Promise ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl text-center"
          style={{
            background: "#f5f3ff",
            border: "1px solid #ede9fe",
            padding: 24,
          }}
        >
          <Lock className="w-5 h-5 mx-auto mb-2" style={{ color: "#7c3aed" }} />
          <p style={{ fontSize: 14, fontWeight: 900, color: "#1a0a3d" }}>
            Beta Promise
          </p>
          <p
            className="max-w-lg mx-auto"
            style={{
              fontSize: 12,
              color: "rgba(74,63,107,0.6)",
              marginTop: 4,
              lineHeight: 1.6,
            }}
          >
            Everyone who activates Pro Beta gets free access for the entire beta
             period. When we launch a paid subscription, we&apos;ll give you plenty of
            notice and a special rate as a thank-you for being early.
          </p>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <div className="rounded-2xl overflow-hidden relative">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(347.14deg, #9C7CF7 -14.62%, #5B18BE 33.33%, #000000 90.37%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              right: 0,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(156,124,247,0.2)",
              filter: "blur(70px)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 0,
              left: 0,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(217,70,239,0.2)",
              filter: "blur(55px)",
            }}
          />
          <div className="relative px-8 py-10 text-center">
            <h3
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Still not sure?
            </h3>
            <p
              className="max-w-sm mx-auto"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 24,
              }}
            >
              Start with the free plan. No credit card required. Upgrade
               whenever you&apos;re ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {!user ? (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl font-black cursor-pointer border-0"
                    style={{
                      height: 44,
                      padding: "0 32px",
                      fontSize: 14,
                      color: "#1a0a3d",
                      background: "linear-gradient(135deg, #f5c518, #c9a84c)",
                      boxShadow: "0 4px 16px rgba(245,197,24,0.35)",
                    }}
                  >
                    Start for Free
                  </motion.button>
                </Link>
              ) : (
                <Link href="/maps">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl font-black cursor-pointer border-0"
                    style={{
                      height: 44,
                      padding: "0 32px",
                      fontSize: 14,
                      color: "#1a0a3d",
                      background: "linear-gradient(135deg, #f5c518, #c9a84c)",
                      boxShadow: "0 4px 16px rgba(245,197,24,0.35)",
                    }}
                  >
                    Explore Events
                  </motion.button>
                </Link>
              )}
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl font-black text-white transition-colors cursor-pointer"
                  style={{
                    height: 44,
                    padding: "0 32px",
                    fontSize: 14,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Explore Content Hub{" "}
                  <ArrowRight className="w-4 h-4 inline ml-1" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
