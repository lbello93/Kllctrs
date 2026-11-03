export type SponsorSort = "name" | "events" | "category";

export interface SponsorRow {
  sponsor_id: string;
  name: string | null;
  category: string | null;
  total_events_sponsored: number;
  events_this_year: number;
  states_present_in: string[] | null;
  top_tier_count: number;
}

export interface CategorySummary {
  category: string;
  count: number;
}

export interface SponsorListFiltersState {
  category: string;
  search: string;
  sortBy: SponsorSort;
  hasEventsThisYear: boolean;
}

export interface CompareEntry {
  id: string;
  name: string;
  category: string | null;
  website: string | null;
  slug: string;
  totalEvents: number;
  eventsThisYear: number;
  states: string[];
  tierDistribution: { title: number; gold: number; silver: number; exhibitor: number };
  eventIds: string[];
}

export interface SharedEvent {
  id: string;
  name: string;
  slug: string;
  sponsorCount: number;
}

export const TIER_LABELS: { key: "title" | "gold" | "silver" | "exhibitor"; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" },
  { key: "exhibitor", label: "Exhibitor" },
];
