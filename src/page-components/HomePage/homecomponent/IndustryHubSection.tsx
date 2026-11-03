import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, MessageCircle, Store, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import HubSearch from "./HubSearch";

function fmtDate(value: string | null): string {
  if (!value) return "TBA";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "TBA"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function IndustryHubSection() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    eventsRes,
    sponsorsRes,
    blogRes,
    eventCount,
    sponsorCount,
    shopCount,
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id,name,slug,date_start,city,state")
      .eq("status", "approved")
      .gte("date_start", today)
      .order("date_start", { ascending: true })
      .limit(6),
    supabase
      .from("sponsor_analytics")
      .select("sponsor_id,name,category,events_this_year,total_events_sponsored")
      .order("total_events_sponsored", { ascending: false })
      .limit(6),
    supabase
      .from("content")
      .select("id,title,slug,excerpt,meta_description,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("sponsors").select("id", { count: "exact", head: true }),
    supabase.from("shops").select("id", { count: "exact", head: true }).eq("status", "approved"),
  ]);

  const events = eventsRes.data ?? [];
  const sponsors = sponsorsRes.data ?? [];
  const posts = blogRes.data ?? [];

  const stats = [
    { label: "Events", value: eventCount.count ?? 0, href: "/events", icon: CalendarDays },
    { label: "Sponsors", value: sponsorCount.count ?? 0, href: "/sponsors", icon: Trophy },
    { label: "Shops tracked", value: shopCount.count ?? 0, href: "/shops", icon: Store },
  ];

  return (
    <section className="bg-[#faf9ff] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero + search */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black tracking-tight text-[#1a0a3d] sm:text-4xl">
            The AI-Powered Trading Card Industry Hub
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#4a3f6b]/70 sm:text-base">
            Card shows, hobby shops, sponsor brands, and insights — all in one place.
          </p>
          <div className="mt-6">
            <HubSearch />
          </div>
        </div>

        {/* Stats bar */}
        <div className="mb-12 grid grid-cols-3 gap-3">
          {stats.map(({ label, value, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="rounded-2xl border border-violet-100 bg-white p-4 text-center transition-colors hover:border-violet-300 sm:p-5"
            >
              <Icon className="mx-auto mb-1 h-5 w-5 text-[#5f2eea]" />
              <div className="text-2xl font-black text-[#1a0a3d] sm:text-3xl">{value.toLocaleString()}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[#4a3f6b]/60">{label}</div>
            </Link>
          ))}
        </div>

        {/* Upcoming events */}
        {events.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#1a0a3d]">Upcoming Events</h3>
              <Link href="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5B18BE] hover:underline">
                All events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((ev) => (
                <Link
                  key={ev.id}
                  href={ev.slug ? `/maps/events/${ev.slug}` : "/events"}
                  className="rounded-2xl border border-violet-100 bg-white p-4 transition-colors hover:border-violet-300"
                >
                  <div className="text-xs font-bold text-[#5f2eea]">{fmtDate(ev.date_start)}</div>
                  <h4 className="mt-1 line-clamp-2 font-black text-[#1a0a3d]">{ev.name}</h4>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#4a3f6b]/60">
                    <MapPin className="h-3.5 w-3.5" /> {ev.city}, {ev.state}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top sponsors */}
        {sponsors.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#1a0a3d]">Top Sponsors</h3>
              <Link href="/sponsors" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5B18BE] hover:underline">
                All sponsors <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {sponsors.map((s) => (
                <Link
                  key={s.sponsor_id}
                  href={`/sponsors/${s.sponsor_id}`}
                  className="rounded-2xl border border-violet-100 bg-white p-4 text-center transition-colors hover:border-violet-300"
                >
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-lg font-black text-[#5f2eea]">
                    {(s.name ?? "?").charAt(0)}
                  </div>
                  <div className="line-clamp-1 text-sm font-bold text-[#1a0a3d]">{s.name}</div>
                  <div className="text-xs text-[#4a3f6b]/60">{s.total_events_sponsored} events</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Shops CTA */}
        <div className="mb-12 flex flex-col items-center gap-3 rounded-2xl border border-violet-100 bg-white p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-black text-[#1a0a3d]">
              <Store className="h-5 w-5 text-[#5f2eea]" /> Find Shops Near You
            </h3>
            <p className="mt-1 text-sm text-[#4a3f6b]/70">
              Discover card and hobby shops by city, category, and rating.
            </p>
          </div>
          <Link
            href="/shops"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
          >
            Browse shops <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Latest from the blog */}
        {posts.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#1a0a3d]">Latest from the Blog</h3>
              <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5B18BE] hover:underline">
                All posts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={p.slug ? `/blog/${p.slug}` : "/blog"}
                  className="rounded-2xl border border-violet-100 bg-white p-4 transition-colors hover:border-violet-300"
                >
                  <h4 className="line-clamp-2 font-black text-[#1a0a3d]">{p.title}</h4>
                  <p className="mt-1 line-clamp-3 text-sm text-[#4a3f6b]/60">
                    {p.excerpt || p.meta_description || ""}
                  </p>
                  <span className="mt-2 block text-xs text-[#4a3f6b]/50">{fmtDate(p.published_at)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Chat CTA */}
        <div
          className="flex flex-col items-center gap-3 rounded-2xl p-8 text-center text-white sm:flex-row sm:justify-between sm:text-left"
          style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
        >
          <div>
            <h3 className="flex items-center gap-2 text-xl font-black">
              <MessageCircle className="h-5 w-5" /> Ask our AI assistant
            </h3>
            <p className="mt-1 text-sm text-white/80">
              Ask anything about the trading card industry — events, shops, sponsors, and trends.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#5f2eea]"
          >
            Explore the hub <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
