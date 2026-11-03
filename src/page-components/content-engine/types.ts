export type ContentEngineType =
  | "blog"
  | "linkedin"
  | "social"
  | "trend_report"
  | "event_recap";

export type ContentStatus = "draft" | "review" | "published" | "archived";

export interface ContentTypeOption {
  value: ContentEngineType;
  label: string;
  hint: string;
  /** Which related record the template needs. */
  needs: "event" | "sponsor" | "either" | "none";
}

export const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  { value: "blog", label: "Blog post", hint: "Event preview, sponsor spotlight, or a topic", needs: "either" },
  { value: "event_recap", label: "Event recap", hint: "Recap of a past event + reviews", needs: "event" },
  { value: "linkedin", label: "LinkedIn post", hint: "Professional insight from sponsor analytics", needs: "sponsor" },
  { value: "trend_report", label: "Trend report", hint: "Aggregated monthly hobby stats", needs: "none" },
  { value: "social", label: "Social post", hint: "Short Instagram / X copy", needs: "either" },
];

export const STATUS_META: Record<ContentStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-amber-50 text-amber-700" },
  review: { label: "Review", className: "bg-sky-50 text-sky-700" },
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-500" },
};

export interface ContentRow {
  id: string;
  title: string | null;
  slug: string | null;
  type: string;
  status: string | null;
  created_at: string | null;
  published_at: string | null;
  is_ai_generated: boolean;
}

export interface ContentStats {
  draft: number;
  review: number;
  published: number;
  archived: number;
  total: number;
}

export interface OptionRecord {
  id: string;
  name: string;
  detail?: string | null;
}

export interface EditableContent {
  id: string;
  title: string;
  slug: string | null;
  type: string;
  status: ContentStatus;
  body: string;
  excerpt: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  meta_description: string;
  is_ai_generated: boolean;
}

export function normalizeStatus(value: string | null | undefined): ContentStatus {
  return value === "review" || value === "published" || value === "archived" ? value : "draft";
}

export function typeLabel(type: string): string {
  return CONTENT_TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type;
}
