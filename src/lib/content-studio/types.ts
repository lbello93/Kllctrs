/**
 * Shared types for the Content Studio prompt engine.
 *
 * Content Studio is a client-side prompt engine: it researches a topic (the only
 * networked step), then generates platform-optimized social posts, HTML/CSS
 * image templates, and self-contained Claude motion-graphics video prompts — all
 * locally in the browser.
 */

import type { ContentType } from "./kllctrs-context";

export type Audience =
  | "tech"
  | "founders"
  | "general"
  | "creators"
  | "marketers"
  | "students";

export type Tone =
  | "educational"
  | "promotional"
  | "trending"
  | "storytelling"
  | "tutorial"
  | "engagement";

export interface Stat {
  label: string;
  value: string;
  unit?: string;
}

/** Everything the generators need. Collected across the Research tab. */
export interface StudioInput {
  topic: string;
  contentType: ContentType;
  audience: Audience;
  tone: Tone;
  keyPoints: string[];
  stats: Stat[];
  hashtags: string[];
  /** KLLCTRS event / drop context (optional, fills hook + image tokens). */
  eventName?: string;
  location?: string;
  date?: string;
  vendorCount?: string;
  cardSet?: string;
  /** Branding, defaults to KLLCTRS. */
  brand?: string;
  tagline?: string;
  website?: string;
  cta?: string;
  /** Hex colors; default to the KLLCTRS theme (amethyst on navy). */
  accent?: string;
  bg?: string;
}

/** Primary accent + background default to the KLLCTRS brand palette. */
export const DEFAULT_ACCENT = "#8B5CF6"; // amethyst
export const DEFAULT_BG = "#151E3C"; // navy

/** Result of researching a topic (Perplexity / Claude / offline fallback). */
export interface ContentResearch {
  trending: { title: string; snippet: string; url: string; source: string }[];
  stats: Stat[];
  keyPoints: string[];
  hashtags: string[];
  relatedTopics: string[];
  /** How the research was produced, for UI labelling. */
  source: "perplexity" | "claude" | "offline";
}

export type PlatformId =
  | "instagram"
  | "x"
  | "linkedin"
  | "youtube"
  | "threads"
  | "tiktok";

export interface PlatformPost {
  platform: PlatformId;
  label: string;
  /** Full, copy-paste-ready content. */
  text: string;
  /** Short preview (feed cut-off / first tweet). */
  preview: string;
  /** Human meta, e.g. "642 chars · 25 hashtags" or "6 tweets". */
  meta: string;
  /** Optional discrete segments (e.g. individual tweets, overlay lines). */
  segments?: string[];
}

export type AspectRatio = "16:9" | "9:16" | "1:1";
export type RenderMethod = "Canvas + GSAP" | "Python + Pillow" | "Three.js";

export interface VideoStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Duration label, e.g. "15-20s". */
  duration: string;
  bestFor: string[];
  renderMethod: RenderMethod;
  /** Aspect ratios this style is designed for (first = default). */
  aspects: AspectRatio[];
  /** Builds the complete, paste-into-Claude prompt. */
  build: (input: StudioInput, aspect: AspectRatio) => string;
}

export interface ImageTemplate {
  id: string;
  name: string;
  aspect: string;
  width: number;
  height: number;
  /** Returns a complete, self-contained HTML document. */
  render: (input: StudioInput) => string;
}
