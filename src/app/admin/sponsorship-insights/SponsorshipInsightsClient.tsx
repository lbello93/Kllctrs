"use client";

import { useEffect, useState } from "react";
import { Users, Store, CalendarCheck, MousePointerClick } from "lucide-react";

import StatCard from "@/components/admin/analytics/StatCard";

interface ShopFavoriteRow {
  shop_id: string;
  name: string;
  city: string | null;
  state: string | null;
  favorite_count: number;
}

interface EventSaveRow {
  event_id: string;
  name: string;
  city: string | null;
  state: string | null;
  save_count: number;
}

interface SponsorClickRow {
  id: string;
  name: string;
  website_clicks: number | null;
}

interface StateEngagementRow {
  state: string | null;
  total_shop_favorites: number;
  total_event_saves: number;
}

interface InsightsResponse {
  collectorCount: number;
  topShops: ShopFavoriteRow[];
  topEvents: EventSaveRow[];
  sponsorClicks: SponsorClickRow[];
  stateEngagement: StateEngagementRow[];
  error?: string;
}

function RankedList<T>({
  rows,
  renderLabel,
  renderRegion,
  renderCount,
  emptyText,
}: {
  rows: T[];
  renderLabel: (row: T) => string;
  renderRegion: (row: T) => string;
  renderCount: (row: T) => number;
  emptyText: string;
}) {
  if (!rows.length) {
    return <p className="text-sm text-slate-500 py-4">{emptyText}</p>;
  }
  const max = Math.max(...rows.map(renderCount), 1);
  return (
    <ol className="space-y-3">
      {rows.map((row, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="w-5 text-sm font-medium text-slate-400">
            {i + 1}
          </span>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-900">
                {renderLabel(row)}
              </span>
              <span className="text-sm text-slate-500">
                {renderRegion(row)}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-slate-900"
                style={{
                  width: `${Math.max((renderCount(row) / max) * 100, 4)}%`,
                }}
              />
            </div>
          </div>
          <span className="w-10 text-right text-sm font-semibold text-slate-900">
            {renderCount(row)}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function SponsorshipInsightsClient() {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/sponsorship-insights");
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error ?? "Failed to load insights.");
        }
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading insights…</p>;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white px-6 py-5">
        <p className="text-sm font-medium text-red-600">
          Couldn&apos;t load sponsorship insights: {error}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Most likely cause: the SQL views (shop_favorite_counts,
          event_save_counts, state_engagement_summary) haven&apos;t been run
          yet. See supabase/migrations/sponsorship_insights_views.sql.
        </p>
      </div>
    );
  }

  const totalFavorites = data.topShops.reduce(
    (sum, s) => sum + s.favorite_count,
    0,
  );
  const totalSaves = data.topEvents.reduce((sum, e) => sum + e.save_count, 0);
  const totalClicks = data.sponsorClicks.reduce(
    (sum, s) => sum + (s.website_clicks ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Collectors"
          value={data.collectorCount}
          subtitle="Registered profiles"
          icon={<Users size={28} />}
        />
        <StatCard
          title="Shop favorites"
          value={totalFavorites}
          subtitle="Across top 10 shops"
          icon={<Store size={28} />}
        />
        <StatCard
          title="Event saves"
          value={totalSaves}
          subtitle="Across top 10 events"
          icon={<CalendarCheck size={28} />}
        />
        <StatCard
          title="Sponsor clicks"
          value={totalClicks}
          subtitle="Across top 10 sponsors"
          icon={<MousePointerClick size={28} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Most-favorited shops
          </h2>
          <RankedList
            rows={data.topShops}
            renderLabel={(r) => r.name}
            renderRegion={(r) => [r.city, r.state].filter(Boolean).join(", ")}
            renderCount={(r) => r.favorite_count}
            emptyText="No shop favorites recorded yet."
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Most-saved events
          </h2>
          <RankedList
            rows={data.topEvents}
            renderLabel={(r) => r.name}
            renderRegion={(r) => [r.city, r.state].filter(Boolean).join(", ")}
            renderCount={(r) => r.save_count}
            emptyText="No event saves recorded yet."
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Sponsor click-through
          </h2>
          <RankedList
            rows={data.sponsorClicks}
            renderLabel={(r) => r.name}
            renderRegion={() => ""}
            renderCount={(r) => r.website_clicks ?? 0}
            emptyText="No sponsor clicks recorded yet."
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Engagement by state
          </h2>
          <RankedList
            rows={data.stateEngagement}
            renderLabel={(r) => r.state ?? "Unknown"}
            renderRegion={() => ""}
            renderCount={(r) => r.total_shop_favorites + r.total_event_saves}
            emptyText="No regional data yet."
          />
        </div>
      </div>
    </div>
  );
}
