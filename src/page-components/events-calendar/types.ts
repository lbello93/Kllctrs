export interface EventListItem {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  date_start: string;
  date_end: string | null;
  venue_name: string | null;
  event_type: string | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  sponsorCount: number;
}

export interface EventFilters {
  state: string;
  city: string;
  startDate: string;
  endDate: string;
  type: string;
  search: string;
  hasSponsors: boolean;
}

export type EventView = "calendar" | "list";

export const EVENT_TYPES: { value: string; label: string }[] = [
  { value: "card_show", label: "Card Show" },
  { value: "convention", label: "Convention" },
  { value: "auction", label: "Auction" },
  { value: "meetup", label: "Meetup" },
  { value: "online", label: "Online" },
];

export const EVENT_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  EVENT_TYPES.map((t) => [t.value, t.label]),
);

// Colored dot per event type for the calendar grid.
export const EVENT_TYPE_COLOR: Record<string, string> = {
  card_show: "#5f2eea",
  convention: "#e0699f",
  auction: "#f0a000",
  meetup: "#2ea86f",
  online: "#2e8fea",
  default: "#8b7fb5",
};

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "Washington, D.C." },
];
