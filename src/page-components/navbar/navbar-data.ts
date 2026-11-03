import {
  CalendarDays,
  Trophy,
  Store,
  FileText,
  User,
  type LucideIcon,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface NavLink {
  path: string;
  label: string;
  icon: LucideIcon;
}

// The five pillars of the app. Chat is the floating widget in the root layout.
export const publicLinks: NavLink[] = [
  { path: "/events", label: "Events", icon: CalendarDays },
  { path: "/sponsors", label: "Sponsors", icon: Trophy },
  { path: "/shops", label: "Shops", icon: Store },
  { path: "/blog", label: "Blog", icon: FileText },
];

export const buildNavLinks = (user: SupabaseUser | null): NavLink[] => [
  ...publicLinks,
  ...(user ? [{ path: "/profile", label: "Profile", icon: User }] : []),
];
