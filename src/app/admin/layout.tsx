import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Store,
  Trophy,
  Users,
  FileText,
  Shield,
  Upload,
  BarChart3,
  Sparkles,
} from "lucide-react";

const NAV = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },

  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },

  {
    href: "/admin/events",
    label: "Events",
    icon: CalendarDays,
  },

  {
    href: "/admin/events/import",
    label: "Import Events",
    icon: Upload,
  },

  {
    href: "/admin/shop",
    label: "Shops",
    icon: Store,
  },

  {
    href: "/admin/sponsors",
    label: "Sponsors",
    icon: Trophy,
  },

  {
    href: "/admin/content-studio",
    label: "Content Studio",
    icon: Sparkles,
  },

  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
  },

  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },

  {
    href: "/admin/shop-manager",
    label: "Shop Manager",
    icon: Store,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb]">
      {/* Ambient blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Admin secondary nav band */}
      <div className="fixed top-0 left-0 right-0 z-[39] bg-white border-b border-violet-100 shadow-sm">
        <div className="h-[80px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {/* Admin badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5f2eea]/8 border border-[#5f2eea]/20 shrink-0 mr-3">
              <Shield className="w-3.5 h-3.5 text-[#5f2eea]" />
              <span className="text-xs font-black text-[#5f2eea] uppercase tracking-wider">
                Admin
              </span>
            </div>

            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                  label === "Scraper"
                    ? "text-[#5f2eea] bg-[#5f2eea]/8 border border-[#5f2eea]/20 hover:bg-[#5f2eea]/15 font-bold"
                    : "text-[#4a3f6b]/50 hover:text-[#1a0a3d] hover:bg-violet-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="relative z-10 pt-[140px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
