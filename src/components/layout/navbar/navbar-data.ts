import {
  Trophy,
  MessageSquare,
  User,
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
  { path: "/brands", label: "Brands", icon: Trophy },
  { path: "/blog", label: "Content", icon: MessageSquare },
];

export const buildNavLinks = (user: SupabaseUser | null): NavLink[] => [
  ...publicLinks,
  ...(user ? [{ path: "/profile", label: "Profile", icon: User }] : []),
];
