export type CollectorType =
  | "collector"
  | "store_owner"
  | "vendor"
  | "breaker"
  | "content_creator"
  | "investor";

export type OnboardingStep =
  | "welcome"
  | "basic"
  | "location"
  | "collector"
  | "games"
  | "notifications"
  | "finish";

export interface Profile {
  id: string;

  display_name: string | null;

  avatar_url: string | null;

  city: string | null;

  state: string | null;

  favorite_categories: string[];

  grading_preference?: string | null;

  years_collecting?: number | null;

  saved_events?: any[];

  saved_shops?: any[];

  // ---------- NEW FIELDS ----------

  username?: string | null;

  bio?: string | null;

  country?: string | null;

  timezone?: string | null;

  collector_type?: CollectorType | null;

  favorite_games?: string[];

  notifications?: string[];

  profile_completed?: boolean;

  completed_at?: string | null;
}

export interface OnboardingData {
  avatar_url?: string;

  display_name: string;

  username: string;

  bio: string;

  country: string;

  state: string;

  city: string;

  timezone: string;

  collector_type?: CollectorType;

  favorite_games: string[];

  favorite_categories: string[];

  notifications: string[];
}

export interface ProfileClientProps {
  user: any;
  profile: Profile | null;
  savedShops: any[];
  savedEvents: any[];
}