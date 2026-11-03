import { z } from "zod";

export const CONTENT_TYPES = [
  "instagram_pack",
  "trending_news",
  "brand_spotlight",
  "event_promo",
  "market_intel",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const AUDIENCES = ["collectors", "brands"] as const;
export type Audience = (typeof AUDIENCES)[number];

export type BlogCategory =
  | "card"
  | "brands"
  | "editorial"
  | "community"
  | "market_intel";

type Needs = "brief" | "event" | "brand" | "none";

export const CONTENT_TYPE_META: Record<
  ContentType,
  { label: string; description: string; category: BlogCategory; needs: Needs }
> = {
  instagram_pack: {
    label: "Instagram post",
    description: "Carousel slides, caption, hashtags, and a visual brief.",
    category: "card",
    needs: "brief",
  },
  trending_news: {
    label: "Trending news",
    description: "The top hobby stories from the last two weeks, sourced.",
    category: "editorial",
    needs: "none",
  },
  brand_spotlight: {
    label: "Brand spotlight",
    description: "A brand profile plus a share kit the brand can repost.",
    category: "brands",
    needs: "brand",
  },
  event_promo: {
    label: "Event promo",
    description: "Promote a card show with verified details only.",
    category: "community",
    needs: "event",
  },
  market_intel: {
    label: "Market intel",
    description: "A verified sale, release, or market move explained.",
    category: "market_intel",
    needs: "brief",
  },
};

export const generateRequestSchema = z
  .object({
    type: z.enum(CONTENT_TYPES),
    brief: z.string().trim().max(800).default(""),
    eventId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    audience: z.enum(AUDIENCES).default("collectors"),
  })
  .superRefine((value, ctx) => {
    const needs = CONTENT_TYPE_META[value.type].needs;
    const hasBrief = value.brief.length >= 5;

    if (needs === "brief" && !hasBrief) {
      ctx.addIssue({
        code: "custom",
        path: ["brief"],
        message: "Add a short brief (at least 5 characters).",
      });
    }
    if (needs === "event" && !value.eventId && !hasBrief) {
      ctx.addIssue({
        code: "custom",
        path: ["eventId"],
        message: "Pick an event or describe one in the brief.",
      });
    }
    if (needs === "brand" && !value.brandId && !hasBrief) {
      ctx.addIssue({
        code: "custom",
        path: ["brandId"],
        message: "Pick a brand or describe one in the brief.",
      });
    }
  });

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const studioOutputSchema = z.object({
  title: z.string().min(5).max(160),
  meta_description: z.string().max(400).default(""),
  article_markdown: z.string().min(50),
  instagram: z.object({
    caption: z.string().min(10).max(2200),
    carousel_slides: z.array(z.string()).max(12).default([]),
    hashtags: z.array(z.string()).max(20).default([]),
    visual_brief: z.string().default(""),
  }),
  linkedin: z.object({
    post: z.string().max(3000).default(""),
    hashtags: z.array(z.string()).max(12).default([]),
  }),
  brand_kit: z
    .object({
      headline: z.string(),
      share_copy: z.string(),
      talking_points: z.array(z.string()).default([]),
    })
    .nullable()
    .optional(),
  sources: z
    .array(z.object({ title: z.string(), url: z.string() }))
    .default([]),
  review_flags: z.array(z.string()).default([]),
});

export type StudioOutput = z.infer<typeof studioOutputSchema>;

export interface SourceLink {
  title: string;
  url: string;
  checked_at: string;
}

export interface StudioResult {
  draft: { id: string; title: string; slug: string; category: string };
  output: StudioOutput;
  sources: SourceLink[];
  reviewFlags: string[];
  usage: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    webSearches: number;
  };
}