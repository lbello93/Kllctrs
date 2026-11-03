import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, Globe, MapPin, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getSponsorDetail } from "@/lib/sponsors/intel";
import SponsorEventsList from "@/page-components/sponsor-intel/SponsorEventsList";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return {};
  const supabase = await createClient();
  const { data } = await supabase.from("sponsors").select("name").eq("id", id).maybeSingle();
  return { title: data?.name ? `${data.name} — Sponsor Intelligence` : "Sponsor" };
}

export default async function SponsorDetailPage({ params }: Params) {
  const { id } = await params;

  // Legacy slug URLs (/sponsors/<slug>) still redirect to the brand profile;
  // the intelligence detail is keyed by sponsor UUID.
  if (!UUID_RE.test(id)) redirect(`/brands/${id}`);

  const supabase = await createClient();
  const detail = await getSponsorDetail(supabase, id);
  if (!detail) notFound();

  const { sponsor, analytics, events } = detail;

  const years = [...new Set(events.map((e) => Number(e.date_start.slice(0, 4))))].filter(Boolean);
  const yearsActive =
    years.length > 0
      ? Math.max(...years) - Math.min(...years) + 1
      : sponsor.founded_year
        ? new Date().getFullYear() - sponsor.founded_year
        : 0;

  // Geographic breakdown: events per state.
  const stateCounts = new Map<string, number>();
  for (const e of events) if (e.state) stateCounts.set(e.state, (stateCounts.get(e.state) ?? 0) + 1);
  const statesByCount = [...stateCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxStateCount = statesByCount[0]?.[1] ?? 1;

  // Similar sponsors: same category.
  const { data: similar } = await supabase
    .from("sponsor_analytics")
    .select("sponsor_id,name,category,total_events_sponsored")
    .eq("category", sponsor.category)
    .neq("sponsor_id", id)
    .order("total_events_sponsored", { ascending: false })
    .limit(6);

  const stats = [
    { label: "Total events", value: analytics?.total_events_sponsored ?? events.length, icon: CalendarDays },
    { label: "States active", value: analytics?.states_present_in?.length ?? stateCounts.size, icon: MapPin },
    { label: "Title / Gold", value: analytics?.top_tier_count ?? 0, icon: Trophy },
    { label: "Years active", value: yearsActive, icon: CalendarDays },
  ];

  return (
    <main className="min-h-screen bg-[#faf9ff] pt-[96px]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/sponsors" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B18BE] hover:text-violet-900">
          <span aria-hidden>←</span> All sponsors
        </Link>

        {/* Header */}
        <div className="mb-5 rounded-2xl border border-violet-100 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1a0a3d]">{sponsor.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {sponsor.category && (
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    {sponsor.category}
                  </span>
                )}
                {sponsor.headquarters && (
                  <span className="text-sm text-[#4a3f6b]/60">{sponsor.headquarters}</span>
                )}
              </div>
              {sponsor.tagline && <p className="mt-2 max-w-xl text-sm text-[#4a3f6b]/70">{sponsor.tagline}</p>}
            </div>
            {sponsor.website && (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-[#5B18BE] hover:bg-violet-50"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-violet-100 bg-white p-4">
              <s.icon className="mb-2 h-4 w-4 text-[#5f2eea]/40" />
              <div className="text-2xl font-black text-[#5f2eea]">{s.value}</div>
              <div className="text-xs text-[#4a3f6b]/50">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <SponsorEventsList events={events} />

          <div className="space-y-5">
            {/* Geographic breakdown */}
            <section className="rounded-2xl border border-violet-100 bg-white p-5">
              <h2 className="mb-3 text-lg font-black text-[#1a0a3d]">Geographic reach</h2>
              {statesByCount.length === 0 ? (
                <p className="text-sm text-[#4a3f6b]/50">No location data yet.</p>
              ) : (
                <ul className="space-y-2">
                  {statesByCount.map(([state, count]) => (
                    <li key={state} className="flex items-center gap-3">
                      <span className="w-8 shrink-0 text-sm font-bold text-[#1a0a3d]">{state}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-violet-50">
                        <span
                          className="block h-full rounded-full bg-[#5f2eea]"
                          style={{ width: `${(count / maxStateCount) * 100}%` }}
                        />
                      </span>
                      <span className="w-6 shrink-0 text-right text-xs text-[#4a3f6b]/50">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Similar sponsors */}
            <section className="rounded-2xl border border-violet-100 bg-white p-5">
              <h2 className="mb-3 text-lg font-black text-[#1a0a3d]">Similar sponsors</h2>
              {!similar || similar.length === 0 ? (
                <p className="text-sm text-[#4a3f6b]/50">None in this category.</p>
              ) : (
                <ul className="space-y-1.5">
                  {similar.map((s) => (
                    <li key={s.sponsor_id}>
                      <Link
                        href={`/sponsors/${s.sponsor_id}`}
                        className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm hover:bg-violet-50"
                      >
                        <span className="truncate text-[#1a0a3d]">{s.name}</span>
                        <span className="shrink-0 text-xs text-[#4a3f6b]/50">{s.total_events_sponsored} events</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
