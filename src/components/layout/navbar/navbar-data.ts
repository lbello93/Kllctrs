import {
  Trophy,
  Newspaper,
  MessageSquare,
  User,
  Gem,
  Map,
  type LucideIcon,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface NavLink {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const publicLinks: NavLink[] = [
  { path: "/maps", label: "Maps", icon: Map },
  { path: "/sponsors", label: "Brands", icon: Trophy },
  { path: "/blog", label: "Content", icon: MessageSquare },
  // { path: "/tools/valuate", label: "Valuate", icon: Gem },
];

export const buildNavLinks = (user: SupabaseUser | null): NavLink[] => [
  ...publicLinks,
  ...(user ? [{ path: "/profile", label: "Profile", icon: User }] : []),
];
