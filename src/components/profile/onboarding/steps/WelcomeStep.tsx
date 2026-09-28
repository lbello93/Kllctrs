"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Sparkles, Store, Users } from "lucide-react";
import { bodyM } from "@/components/profile/onboarding/shared/onboardingStyles";

type Tone = "purple" | "gold" | "pink";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  tone: Tone;
}

const TONES: Record<Tone, string> = {
  purple: "bg-amethyst-400/15 text-amethyst-300",
  gold: "bg-tuscan-700/15 text-tuscan-700",
  pink: "bg-bloom-700/15 text-bloom-400",
};

const FEATURES: Feature[] = [
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Discover Local Events",
    description: "Find card shows and meetups happening near you.",
    tone: "gold",
  },
  {
    icon: <Store className="h-5 w-5" />,
    title: "Favorite Shops",
    description: "Keep all your local game stores in one place.",
    tone: "purple",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Personalized Recommendations",
    description: "Get suggestions based on what you collect.",
    tone: "pink",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Join the Community",
    description: "Connect with collectors in your area.",
    tone: "purple",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

interface WelcomeStepProps {
  user?: {
    email?: string | null;
    user_metadata?: { full_name?: string | null } | null;
  } | null;
  profile?: { display_name?: string | null } | null;
}

export default function WelcomeStep({ user, profile }: WelcomeStepProps) {
  const reduceMotion = useReducedMotion();

  const fullName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "";

  const firstName = fullName.trim().split(/\s+/)[0];

  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-5">
      {firstName && (
        <p
          className={`${bodyM} shrink-0 text-[#FEF9FF]/70 [@media(max-height:680px)]:hidden`}
        >
          Hi {firstName}, here is what your profile unlocks.
        </p>
      )}

      <motion.ul
        variants={container}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="grid min-h-0 max-h-[420px] flex-1 grid-cols-2 grid-rows-2 gap-3 sm:gap-4"
      >
        {FEATURES.map((feature) => (
          <motion.li
            key={feature.title}
            variants={item}
            className="flex min-h-0 flex-col justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#FEF9FF]/[0.06] p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONES[feature.tone]}`}
            >
              {feature.icon}
            </span>

            <div className="min-w-0">
              <h3 className="font-space-grotesk text-[16px] leading-5 tracking-[-0.01em] text-[#FEF9FF] sm:text-[20px] sm:leading-[26px]">
                {feature.title}
              </h3>
              <p className="mt-1 line-clamp-2 hidden font-inter text-[14px] leading-5 text-[#FEF9FF]/60 sm:block [@media(max-height:700px)]:!hidden">
                {feature.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
