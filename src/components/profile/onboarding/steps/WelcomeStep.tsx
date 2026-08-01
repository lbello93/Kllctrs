"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Store, Sparkles, Users } from "lucide-react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Discover Local Events",
    description: "Find card shows and meetups happening near you.",
  },
  {
    icon: <Store className="h-5 w-5" />,
    title: "Favorite Shops",
    description: "Keep all your local game stores in one place.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Personalized Recommendations",
    description: "Get suggestions based on what you collect.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Join the Community",
    description: "Connect with collectors in your area.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

interface WelcomeStepProps {
  user?: unknown;
  profile?: unknown;
}

export default function WelcomeStep({ user, profile }: WelcomeStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {FEATURES.map((feature) => (
          <motion.li
            key={feature.title}
            variants={item}
            className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#1E1240] p-5 transition-colors hover:border-[#E8B85C]/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8B85C]/10 text-[#E8B85C]">
              {feature.icon}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {feature.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <div className="flex items-center gap-2 text-xs text-white/40">
        <Clock className="h-3.5 w-3.5" />
        <span>Estimated time · About 2 minutes</span>
      </div>
    </div>
  );
}
