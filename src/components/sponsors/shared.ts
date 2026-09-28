import type { Sponsor } from "@/types";

export type SponsorRow = Sponsor & { tier?: string | null };

export interface SponsorShow {
  id: string;
  name: string;
  slug: string;
  date_start: string;
  city: string | null;
  state: string | null;
}

export interface SponsorStats {
  upcoming: SponsorShow[];
  left: number;
  total: number;
}

export interface SponsorsSummary {
  brands: number;
  shows: number;
  states: number;
}

export const CATEGORY_LABELS: Record<string, string> = {
  grading: "Grading",
  grading_company: "Grading",
  auction: "Auctions",
  manufacturer: "Manufacturer",
  card_manufacturer: "Manufacturer",
  marketplace: "Marketplace",
  breaker: "Breakers",
  shop: "Shop",
  software: "Software",
  media: "Media",
  other: "Other",
};

export const TIER_STYLES: Record<string, string> = {
  bronze: "border-orange-200 bg-orange-50 text-orange-700",
  silver: "border-gray-300 bg-gray-100 text-gray-700",
  gold: "border-amber-200 bg-amber-50 text-amber-700",
  platinum: "border-slate-300 bg-slate-100 text-slate-700",
};

const TIER_RANK: Record<string, number> = {
  platinum: 4,
  gold: 3,
  silver: 2,
  bronze: 1,
};

export function tierRank(tier?: string | null): number {
  return TIER_RANK[(tier ?? "").toLowerCase()] ?? 0;
}

export function tierKey(tier?: string | null): string | null {
  const key = (tier ?? "").toLowerCase();
  return key in TIER_STYLES ? key : null;
}

export function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export const primaryLinkClass =
  "flex h-10 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(94.43deg,#5B18BE_35.73%,#9C7CF7_100%)] px-[14px] font-inter text-[14px] leading-[17px] tracking-[-0.01em] text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90";