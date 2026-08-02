import type { CollectorType, OnboardingStep } from "./types";

/* ============================================================
   Existing Profile Constants
============================================================ */

export const CATEGORIES = [
  "Baseball",
  "Basketball",
  "Football",
  "Hockey",
  "Soccer",
  "Pokemon",
  "Yu-Gi-Oh",
  "Magic: The Gathering",
  "Vintage",
  "Rookie Cards",
] as const;

export const GRADING_COMPANIES = [
  "PSA",
  "BGS",
  "CGC",
  "SGC",
  "None",
] as const;

export const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

export const QUICK_LINKS = [
  {
    title: "Browse Shops",
    href: "/shops",
    icon: "🏪",
  },
  {
    title: "Card Shows",
    href: "/shows",
    icon: "📍",
  },
  {
    title: "Content Hub",
    href: "/content",
    icon: "📚",
  },
  {
    title: "AI Appraisal",
    href: "/appraise",
    icon: "✨",
  },
] as const;

/* ============================================================
   Onboarding
============================================================ */

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "welcome",
  "basic",
  "location",
  "collector",
  "experience",
  "games",
  "notifications",
  "finish",
];

export const ONBOARDING_STEP_INFO = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Let's personalize your KLLCTRS experience.",
  },
  {
    id: "basic",
    title: "Basic Information",
    description: "Tell the community about yourself.",
  },
  {
    id: "location",
    title: "Location",
    description: "Find shops, shows, and collectors near you.",
  },
  {
    id: "collector",
    title: "Collector Type",
    description: "Help us tailor your experience.",
  },
{
    id: "experience",
    title: "Collecting Experience",
    description: "How long have you been collecting?",
  },
  {
    id: "games",
    title: "Favorite Games",
    description: "Choose what you collect.",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Choose how you'd like to stay updated.",
  },
  {
    id: "finish",
    title: "You're Ready!",
    description: "Let's explore KLLCTRS.",
  },
] as const;

export const TRADING_CARD_GAMES = [
  "Pokemon",
  "Magic: The Gathering",
  "One Piece",
  "Yu-Gi-Oh!",
  "Lorcana",
  "Sports Cards",
] as const;

export const CARD_CATEGORIES = [
  "Singles",
  "Sealed",
  "Graded",
  "Vintage",
  "Accessories",
] as const;

export const COLLECTOR_TYPES: {
  id: CollectorType;
  title: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "collector",
    title: "Collector",
    emoji: "📦",
    description: "I collect trading cards.",
  },
  {
    id: "store_owner",
    title: "Store Owner",
    emoji: "🏪",
    description: "I own or manage a card shop.",
  },
  {
    id: "vendor",
    title: "Vendor",
    emoji: "🛒",
    description: "I sell at conventions and events.",
  },
  {
    id: "breaker",
    title: "Breaker",
    emoji: "🎥",
    description: "I host live box breaks.",
  },
  {
    id: "content_creator",
    title: "Content Creator",
    emoji: "🎬",
    description: "I create videos, streams, or hobby content.",
  },
  {
    id: "investor",
    title: "Investor",
    emoji: "📈",
    description: "I collect as a long-term investment.",
  },
] as const;

export const NOTIFICATION_OPTIONS = [
  {
    id: "events",
    title: "Nearby Events",
  },
  {
    id: "new_shops",
    title: "New Card Shops",
  },
  {
    id: "market_updates",
    title: "Market Updates",
  },
  {
    id: "community_news",
    title: "Community News",
  },
] as const;

export const USERNAME_RULES = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
  REGEX: /^[a-zA-Z0-9_]+$/,
} as const;

export const BIO_RULES = {
  MAX_LENGTH: 200,
} as const;