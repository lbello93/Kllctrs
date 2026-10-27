"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Handshake,
  LayoutDashboard,
  Shield,
  Sparkles,
  Store,
  Trophy,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/events/import", label: "Find Events", icon: Upload },
  { href: "/admin/shop", label: "Shops", icon: Store },
  { href: "/admin/sponsors", label: "Sponsors", icon: Trophy },
  { href: "/admin/sponsorship-insights", label: "Insights", icon: Handshake },
  { href: "/admin/content-studio", label: "Content Studio", icon: Sparkles },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
];

// The longest matching link wins, so /admin/events/import
// does not also highlight /admin/events.
function getActiveHref(pathname: string): string | null {
  const matches = NAV.filter(({ href }) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`),
  );
  if (!matches.length) return null;
  return matches.reduce((a, b) => (b.href.length > a.href.length ? b : a))
    .href;
}

export default function AdminNav() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <nav
      aria-label="Admin"
      className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="mr-3 flex shrink-0 items-center gap-1.5 rounded-lg border border-[#5f2eea]/20 bg-[#5f2eea]/[0.08] px-3 py-1.5">
        <Shield className="h-3.5 w-3.5 text-[#5f2eea]" aria-hidden />
        <span className="text-xs font-black uppercase tracking-wider text-[#5f2eea]">
          Admin
        </span>
      </div>

      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5f2eea]/40 ${
              active
                ? "border border-[#5f2eea]/20 bg-[#5f2eea]/10 font-bold text-[#5f2eea]"
                : "font-medium text-[#4a3f6b]/60 hover:bg-violet-50 hover:text-[#1a0a3d]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}