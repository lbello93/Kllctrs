"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, MapPin, Trophy, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPEWRITER_WORDS = [
  "Collectors.",
  "Dealers.",
  "Investors.",
  "Hobbyists.",
];

const SUGGESTIONS = [
  "Best PSA graded cards to invest in",
  "When and where is National in 2026",
  "Top rookies to invest in 2026",
];

const STATS = [
  { icon: MapPin, value: "210+", label: "Card shops across the US" },
  { icon: Trophy, value: "10+", label: "Industry sponsors tracked" },
  { icon: Zap, value: "Live", label: "Card show alerts by state" },
  { icon: Brain, value: "AI", label: "Powered by Gemini + eBay data" },
];

const TICKER_ITEMS = [
  "Baseball",
  "Basketball",
  "Pokemon",
  "PSA Grading",
  "BGS",
  "Hockey",
  "Magic: The Gathering",
  "Football",
  "Yu-Gi-Oh",
  "Soccer",
  "SGC",
  "Vintage Cards",
  "Rookie Cards",
  "Investment Grade",
];

function TypeWriter() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPEWRITER_WORDS[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(
        () => setDisplayed(word.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % TYPEWRITER_WORDS.length);
      }, 80);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="text-[#5f2eea]">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function HeroSection() {
  const [query, setQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    window.dispatchEvent(
      new CustomEvent("kllctbls:chat", { detail: { message: query.trim() } }),
    );
    setQuery("");
  };

  const handleSuggestion = (s: string) => {
    window.dispatchEvent(
      new CustomEvent("kllctbls:chat", { detail: { message: s } }),
    );
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image — full visibility, minimal overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.webp"
            alt="Sports card collection background"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          {/* Very light fade only on the far left where text sits */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4f3fb]/95 via-[#f4f3fb]/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 w-full">
          <div className="max-w-xl">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-black text-5xl sm:text-6xl lg:text-7xl text-[#1a0a3d] leading-[0.95] tracking-tight mb-6"
            >
              Built for
              <br />
              <TypeWriter />
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#4a3f6b] leading-relaxed mb-10"
            >
              Discover shows, find hobby shops, track brands, and appraise
              cards!
              <br />
              The only platform the modern collector needs.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link href="/events">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    className="bg-[#f5c518] hover:bg-[#e6b800] text-[#1a0a3d] font-bold shadow-xl shadow-yellow-300/50 px-10 py-6 text-base rounded-2xl border-0"
                  >
                    Explore Map
                  </Button>
                </motion.div>
              </Link>
              <Link href="/valuation">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    className="bg-[#1a0a3d] hover:bg-[#2d1170] text-white font-bold shadow-xl shadow-black/30 px-10 py-6 text-base rounded-2xl border-0"
                  >
                    Appraise a Card
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Free tier nudge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="flex items-center gap-1.5 text-xs text-[#4a3f6b]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                3 free appraisals/day
              </div>
              <span className="text-[#4a3f6b]/25">·</span>
              <Link
                href="/pricing"
                className="text-xs font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors inline-flex items-center gap-1"
              >
                Unlimited with Pro
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="flex items-center bg-white/90 backdrop-blur-sm border-2 border-violet-200 group-focus-within:border-violet-500 rounded-2xl shadow-lg shadow-violet-200/40 overflow-hidden transition-all duration-300">
                  <div className="flex items-center pl-5 shrink-0">
                    <Search className="w-4 h-4 text-violet-400" />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Ask anything about cards, shows, shops..."
                    className="flex-1 bg-transparent py-4 px-3 text-[#1a0a3d] placeholder-violet-300 text-sm outline-none"
                  />
                  <motion.button
                    type="submit"
                    disabled={!query.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="m-2 px-5 py-2.5 rounded-xl bg-[#5f2eea] hover:bg-[#4e24c8] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-30 transition-colors shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:block">Search</span>
                  </motion.button>
                </div>
              </form>

              <div className="flex flex-wrap gap-2 mt-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs text-violet-600 hover:text-violet-800 border border-violet-200 hover:border-violet-400 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-violet-50 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#1a0a3d] overflow-hidden py-3 border-y border-violet-900">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(2)].map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-6 pr-6 text-sm font-bold tracking-widest text-white/60 uppercase"
            >
              {TICKER_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-6">
                  <span>{item}</span>
                  <span className="text-[#f5c518]">·</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <section className="bg-white border-y border-violet-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-500" />
                </div>
                <p className="font-black text-2xl text-[#1a0a3d]">{value}</p>
                <p className="text-xs text-[#4a3f6b] tracking-wide">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
