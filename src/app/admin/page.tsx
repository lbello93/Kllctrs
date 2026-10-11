import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  Store,
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MousePointerClick,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export const metadata = { title: "Admin Dashboard | KLLCTRS" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,email")
    .eq("id", user.id)
    .single();

  // if (profile?.role !== "admin") {
  //   redirect("/");
  // }
  const [
    eventsApproved,
    eventsPending,
    shopsApproved,
    shopsPending,
    users,
    sponsors,
  ] = await Promise.all([
    supabaseAdmin
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabaseAdmin
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin
      .from("shops")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabaseAdmin
      .from("shops")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("sponsors").select("*", { count: "exact", head: true }),
  ]);

  const { data: topSponsors } = await supabaseAdmin
    .from("sponsors")
    .select("name, slug, profile_views, website_clicks")
    .order("profile_views", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await supabaseAdmin
    .from("profiles")
    .select("email, created_at, role")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: pendingEvents } = await supabaseAdmin
    .from("events")
    .select("id, name, city, state, date_start, source")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: pendingShops } = await supabaseAdmin
    .from("shops")
    .select("id, name, city, state")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  const pendingCount = (eventsPending.count ?? 0) + (shopsPending.count ?? 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          Platform stats and pending actions
        </p>
      </div>

      {/* Urgent alert */}
      {pendingCount > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 font-medium">
            <span className="font-black">
              {pendingCount} item{pendingCount !== 1 ? "s" : ""}
            </span>{" "}
            waiting for your review
          </p>
          <div className="flex items-center gap-2 ml-auto">
            {(eventsPending.count ?? 0) > 0 && (
              <Link
                href="/admin/events?status=pending"
                className="text-xs font-black text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
              >
                {eventsPending.count} Events
              </Link>
            )}
            {(shopsPending.count ?? 0) > 0 && (
              <Link
                href="/admin/shop?status=pending"
                className="text-xs font-black text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
              >
                {shopsPending.count} Shops
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Approved Events",
            value: eventsApproved.count ?? 0,
            icon: CalendarDays,
            href: "/admin/events",
            sub: "live on map",
          },
          {
            label: "Pending Events",
            value: eventsPending.count ?? 0,
            icon: Clock,
            href: "/admin/events?status=pending",
            urgent: (eventsPending.count ?? 0) > 0,
          },
          {
            label: "Approved Shops",
            value: shopsApproved.count ?? 0,
            icon: Store,
            href: "/admin/shop",
            sub: "live on map",
          },
          {
            label: "Pending Shops",
            value: shopsPending.count ?? 0,
            icon: Clock,
            href: "/admin/shop?status=pending",
            urgent: (shopsPending.count ?? 0) > 0,
          },
          {
            label: "Total Users",
            value: users.count ?? 0,
            icon: Users,
            href: "/admin/users",
            sub: "registered",
          },
          {
            label: "Sponsors",
            value: sponsors.count ?? 0,
            icon: Trophy,
            href: "/admin/sponsors",
            sub: "tracked",
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-2xl border p-5 hover:scale-[1.01] transition-all block shadow-sm ${
              s.urgent
                ? "border-amber-200 bg-amber-50 hover:border-amber-300"
                : "border-violet-100 bg-white/80 backdrop-blur-sm hover:border-[#5f2eea]/30 hover:shadow-violet-200/40 shadow-violet-100/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#4a3f6b]/40 uppercase">
                {s.label}
              </span>
              <s.icon
                className={`w-4 h-4 ${s.urgent ? "text-amber-400" : "text-[#5f2eea]/30"}`}
              />
            </div>
            <div
              className={`text-3xl font-black ${s.urgent ? "text-amber-600" : "text-[#5f2eea]"}`}
            >
              {s.value}
            </div>
            {s.sub && <p className="text-xs text-[#4a3f6b]/40 mt-1">{s.sub}</p>}
            {s.urgent && s.value > 0 && (
              <p className="text-xs text-amber-500 font-bold mt-1">
                Needs review →
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Pending queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending events */}
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
              Pending Events
            </h2>
            <Link
              href="/admin/events?status=pending"
              className="text-xs text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
            >
              View all →
            </Link>
          </div>
          {pendingEvents && pendingEvents.length > 0 ? (
            <div className="space-y-2">
              {pendingEvents.map((e) => (
                <Link
                  key={e.id}
                  href="/admin/events"
                  className="flex items-center justify-between p-3 rounded-xl border border-violet-50 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a0a3d] group-hover:text-[#5f2eea] transition-colors line-clamp-1">
                      {e.name}
                    </p>
                    <p className="text-xs text-[#4a3f6b]/40 mt-0.5">
                      {e.city}, {e.state}
                      {e.date_start &&
                        ` · ${format(new Date(e.date_start), "MMM d")}`}
                    </p>
                  </div>
                  {e.source === "scraper" && (
                    <span className="text-[10px] font-black text-[#5f2eea] bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      Scraper
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#4a3f6b]/30 py-4 justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              All caught up
            </div>
          )}
        </div>

        {/* Pending shops */}
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
              Pending Shops
            </h2>
            <Link
              href="/admin/shop?status=pending"
              className="text-xs text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
            >
              View all →
            </Link>
          </div>
          {pendingShops && pendingShops.length > 0 ? (
            <div className="space-y-2">
              {pendingShops.map((s) => (
                <Link
                  key={s.id}
                  href="/admin/shop"
                  className="flex items-center justify-between p-3 rounded-xl border border-violet-50 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a0a3d] group-hover:text-[#5f2eea] transition-colors">
                      {s.name}
                    </p>
                    <p className="text-xs text-[#4a3f6b]/40 mt-0.5">
                      {s.city}, {s.state}
                    </p>
                  </div>
                  <Store className="w-3.5 h-3.5 text-[#5f2eea]/20 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#4a3f6b]/30 py-4 justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              All caught up
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top sponsors */}
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
              Top Sponsors by Views
            </h2>
            <Link
              href="/admin/sponsors"
              className="text-xs text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
            >
              Manage →
            </Link>
          </div>
          {topSponsors && topSponsors.length > 0 ? (
            <div className="space-y-3">
              {topSponsors.map((s) => (
                <div
                  key={s.slug}
                  className="flex items-center justify-between py-2 border-b border-violet-50 last:border-0"
                >
                  <span className="text-sm text-[#1a0a3d] font-medium truncate mr-3">
                    {s.name}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#4a3f6b]/40 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {s.profile_views ?? 0}
                    </span>
                    <span className="text-xs text-[#4a3f6b]/40 flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />{" "}
                      {s.website_clicks ?? 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4a3f6b]/30 py-4 text-center">
              No sponsor activity yet
            </p>
          )}
        </div>

        {/* Recent signups */}
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
              Recent Signups
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
            >
              All users →
            </Link>
          </div>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div
                  key={u.email}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f3fb] border border-violet-100"
                >
                  <span className="text-sm text-[#1a0a3d] truncate mr-3 font-medium">
                    {u.email}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === "admin"
                          ? "bg-[#5f2eea]/10 text-[#5f2eea]"
                          : "bg-violet-50 text-[#4a3f6b]/40"
                      }`}
                    >
                      {u.role ?? "user"}
                    </span>
                    {u.created_at && (
                      <span className="text-[10px] text-[#4a3f6b]/30">
                        {format(new Date(u.created_at), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4a3f6b]/30 py-4 text-center">
              No users yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
