export interface ShopItem {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  category: string | null;
  specialty: string | null;
  description: string | null;
  lat: number | null;
  lng: number | null;
  hours: unknown;
  is_verified: boolean | null;
  rating: number | null;
  reviewCount: number;
  distanceMiles: number | null;
}

export interface ShopFilters {
  lat: number | null;
  lng: number | null;
  radius: number;
  category: string;
  minRating: number;
  search: string;
  state: string;
  city: string;
}

export const SHOP_CATEGORIES: { value: string; label: string }[] = [
  { value: "sports_cards", label: "Sports Cards" },
  { value: "pokemon", label: "Pokémon" },
  { value: "magic_tcg", label: "Magic: The Gathering" },
  { value: "yugioh", label: "Yu-Gi-Oh!" },
  { value: "comics", label: "Comics" },
  { value: "memorabilia", label: "Memorabilia" },
  { value: "multi", label: "Multi-category" },
];

export const SHOP_CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  SHOP_CATEGORIES.map((c) => [c.value, c.label]),
);

export const RADIUS_OPTIONS = [5, 10, 25, 50];
