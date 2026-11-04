/**
 * KLLCTRS brand constants, content types and themed copy used across every
 * Content Studio generator. KLLCTRS is a trading-card collector platform, so all
 * generated content is anchored to cards, collecting, events and the hobby.
 */

export const KLLCTRS_BRAND = {
  name: "KLLCTRS",
  tagline: "Collect. Trade. Connect.",
  url: "https://kllctrs.com",
  handle: "@kllctrs",
  colors: {
    navy: "#151E3C", // primary bg
    cream: "#FEF9FF", // light text / secondary bg
    amethyst: "#8B5CF6", // primary accent (purple)
    amethystLight: "#B39EF9", // lighter purple for hover/glow
    amethystDark: "#5B18BE", // deeper purple for pressed states
    tuscan: "#FCD279", // secondary accent (warm gold)
    tuscanLight: "#FDE2B4", // light gold for highlights
    bloom: "#EF8799", // tertiary accent (coral pink)
    bloomLight: "#F4BAC3", // light bloom for soft accents
    text: "#FEF9FF", // cream white text
    gray: "#8a8f98",
    cardBg: "rgba(254,249,255,0.04)", // cream-tinted glass
    border: "rgba(139,92,246,0.15)", // amethyst-tinted border
  },
  fonts: {
    heading: "Space Grotesk", // --font-space (bold headings)
    display: "Unica One", // --font-unica (logo/display)
    body: "Inter", // --font-inter (body text)
  },
} as const;

export const CONTENT_TYPES = [
  { id: "event-promo", name: "Event Promotion", icon: "📅", description: "Promote upcoming card shows, meetups, conventions" },
  { id: "card-drop", name: "Card Drop / New Release", icon: "🃏", description: "Announce new card releases, limited drops, exclusive sets" },
  { id: "collector-spotlight", name: "Collector Spotlight", icon: "🌟", description: "Feature a collector, their collection, or achievement" },
  { id: "platform-feature", name: "Platform Feature", icon: "⚡", description: "Highlight KLLCTRS features — maps, trading, events" },
  { id: "market-update", name: "Market / Hobby Update", icon: "📈", description: "Trading card market trends, prices, hobby news" },
  { id: "community", name: "Community / Engagement", icon: "🤝", description: "Polls, questions, collector tips, hobby culture" },
  { id: "behind-scenes", name: "Behind the Scenes", icon: "🎥", description: "Building KLLCTRS, dev updates, team stories" },
  { id: "educational", name: "Educational / Tips", icon: "📚", description: "Card grading, storage, investing, beginner guides" },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["id"];

export function contentTypeMeta(id: ContentType) {
  return CONTENT_TYPES.find((c) => c.id === id) ?? CONTENT_TYPES[0];
}

/** Example event data shape (mirrors Supabase `events`). */
export interface KllctrsEvent {
  name: string;
  date: string;
  location: string;
  description?: string;
  vendors?: number;
  expectedAttendance?: number;
}

/** A sensible default topic to pre-fill when a content type is chosen. */
export const DEFAULT_TOPIC: Record<ContentType, string> = {
  "event-promo": "Upcoming card show",
  "card-drop": "New limited card drop",
  "collector-spotlight": "Featured collector spotlight",
  "platform-feature": "The KLLCTRS event map",
  "market-update": "Trading card market update",
  community: "Collector community question",
  "behind-scenes": "Building KLLCTRS this week",
  educational: "Card grading for beginners",
};

/** Hooks per content type — tokens like {event} are filled from StudioInput. */
export const HOOKS: Record<ContentType, string[]> = {
  "event-promo": [
    "🔥 The biggest card show of the season is coming to {location}",
    "📅 Mark your calendar — {event} is almost here",
    "🃏 {vendors}+ vendors. Hundreds of collectors. One epic day.",
  ],
  "card-drop": [
    "🚨 NEW DROP ALERT — a limited release just hit KLLCTRS",
    "💎 Once they're gone, they're gone — {event} is live",
    "🃏 This drop is about to move the market. Here's why.",
  ],
  "collector-spotlight": [
    "🌟 Meet the collector building one of the hobby's best vaults",
    "💬 \"It started with one pack...\" — this collector's story is wild",
    "🏆 From starter pack to grail card — here's how they did it",
  ],
  "platform-feature": [
    "⚡ KLLCTRS just made collecting a whole lot easier",
    "🗺️ Find every card show near you — on one map",
    "📲 Your entire collection, organized in one place",
  ],
  "market-update": [
    "📈 The trading card market is heating up — here's what's moving",
    "🔥 These cards are gaining value fast this month",
    "💰 Card market update: what collectors need to know right now",
  ],
  community: [
    "🤝 Collectors — settle a debate for us 👇",
    "💬 What was the first card that got you hooked?",
    "🗳️ Raw or graded? There's only one right answer.",
  ],
  "behind-scenes": [
    "🎥 Building KLLCTRS: here's what we shipped this week",
    "🛠️ A peek behind the scenes at KLLCTRS",
    "🚀 From idea to app — the KLLCTRS story so far",
  ],
  educational: [
    "📚 New to card grading? Start here.",
    "🧠 The one storage mistake quietly ruining your cards",
    "💡 How to spot a fake before you buy",
  ],
};

/** Content-type-specific hashtag staples, prepended to generated tags. */
export const HOBBY_HASHTAGS: Record<ContentType, string[]> = {
  "event-promo": ["#cardshow", "#cardshowfinds", "#thehobby"],
  "card-drop": ["#carddrop", "#newrelease", "#limitededition"],
  "collector-spotlight": ["#whodoyoucollect", "#collection", "#pc"],
  "platform-feature": ["#collectingapp", "#cardcommunity"],
  "market-update": ["#cardmarket", "#cardinvesting", "#sportscardinvestor"],
  community: ["#cardcommunity", "#collectorsofinstagram"],
  "behind-scenes": ["#buildinpublic", "#startup"],
  educational: ["#cardgrading", "#cardtips", "#collecting101"],
};

/** Always-on KLLCTRS / trading-card hashtags. */
export const CORE_HASHTAGS = [
  "#KLLCTRS",
  "#tradingcards",
  "#cardcollector",
  "#thehobby",
  "#collecting",
];

/** CTAs per platform flavour. */
export const KLLCTRS_CTAS = {
  save: "Save this 🃏",
  follow: "Follow @kllctrs for drops",
  app: "Find events & drops on KLLCTRS",
};
