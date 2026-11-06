import {
  Map,
  Tag,
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

// Maps surfaces events + shops on the map itself; no sub-menus.
export const publicLinks: NavLink[] = [
  { path: "/maps", label: "Maps", icon: Map },
  { path: "/brands", label: "Brands", icon: Tag },
  { path: "/blog", label: "Blog", icon: FileText },
];

export const buildNavLinks = (user: SupabaseUser | null): NavLink[] => [
  ...publicLinks,
  ...(user ? [{ path: "/profile", label: "Profile", icon: User }] : []),
];
