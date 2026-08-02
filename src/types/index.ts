// Event, Shop, Sponsor, User, Content interfaces


export interface Event {
  id: string
  name: string
  slug: string
  date_start: string
  date_end?: string | null
  city: string
  state: string
  venue_name?: string | null
  venue_address?: string | null
  zip_code?: string | null
  lat?: number | null
  lng?: number | null
  website?: string | null
  venue_website?: string | null
  vendor_tables?: number | null
  contact_name?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  autograph_guests?: string | null
  social_links?: Record<string, string>
  sponsors?: string[]
  source?: string
  status?: string
  created_at?: string
}

export interface Shop {
  id: string
  name: string
  slug: string
  address?: string | null
  city: string
  state: string
  zip_code?: string | null
  lat?: number | null
  lng?: number | null
  phone?: string | null
  website?: string | null
  google_place_id?: string | null
  specialty?: 'sports' | 'pokemon' | 'both'
  hours?: Record<string, string>
  status?: string
  created_at?: string
}

export interface Sponsor {
  id: string
  name: string
  slug: string
  category: 'grading' | 'auction' | 'manufacturer' | 'marketplace' | 'breaker' | 'shop' | 'software'
  website?: string | null
  logo_url?: string | null
  description?: string | null
  profile_views?: number
  website_clicks?: number
  created_at?: string
}

export interface Profile {
  id: string
  email?: string | null
  role?: 'user' | 'admin'
  saved_events?: string[]
  saved_shops?: string[]
  alert_states?: string[]
  topic_prefs?: string[]
  created_at?: string
}

export interface Content {
  id: string;

  type: "blog" | "linkedin" | "newsletter";

  title?: string | null;

  slug?: string | null;

  body: string;

  meta_description?: string | null;

  author?: string | null;

  category?: string | null;

  status: "draft" | "approved" | "published";

  event_id?: string | null;

  published_at?: string | null;

  created_at?: string;
}

export interface EventFilters {
  state?: string
  city?: string
  dateFrom?: string
  dateTo?: string
  keyword?: string
}

export interface EventReview {
  id: string;
  event_id: string;
  user_id: string;
  reviewer_name: string;
  reviewer_avatar_url: string | null;
  rating: number;
  comment: string;
  created_at: string;
}