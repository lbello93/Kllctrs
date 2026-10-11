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
  | "experience"
  | "games"
  | "notifications"
  | "finish";

import type { User } from "@supabase/supabase-js";
import type { Event, Shop } from "@/types";
import type { Tables } from "@/types/database";

export type Profile = Tables<"profiles"> & {
  username?: string | null;
  country?: string | null;
  timezone?: string | null;
  collector_type?: CollectorType | null;
  favorite_games?: string[];
  event_notifications?: boolean;
  shop_notifications?: boolean;
  community_notifications?: boolean;
  marketing_notifications?: boolean;
  terms_accepted?: boolean;
  terms_accepted_at?: string | null;
  profile_completed?: boolean;
  completed_at?: string | null;
};

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
  user: User;
  profile: Profile | null;
  savedShops: Shop[];
  savedEvents: Event[];
}
