import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PeriodStats, ReportData } from "@/lib/report-generator";

import { ReportDownloadButton } from "./ReportDownloadButton";

export const metadata = { title: "Admin · Reports | KLLCTRS" };

// RPC names aren't in the generated Database types yet; use a thin typed escape.
type Rpc = (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
const rpc = (supabaseAdmin.rpc as unknown as Rpc).bind(supabaseAdmin);

const EMPTY: PeriodStats = {
  total_page_views: 0, unique_visitors: 0, total_logins: 0, new_signups: 0,
  event_views: 0, card_views: 0, searches: 0, trade_requests: 0,
  chatbot_queries: 0, active_users: 0,
};

const CARDS: { key: keyof PeriodStats; label: string; color: string }[] = [
  { key: "total_page_views", label: "Page views", color: "#FCD279" },
  { key: "unique_visitors", label: "Unique visitors", color: "#8B5CF6" },
  { key: "new_signups", label: "New signups", color: "#EF8799" },
  { key: "active_users", label: "Active users", color: "#FCD279" },
  { key: "total_logins", label: "Logins", color: "#B39EF9" },
  { key: "event_views", label: "Event views", color: "#8B5CF6" },
  { key: "card_views", label: "Card views", color: "#FCD279" },
  { key: "searches", label: "Searches", color: "#B39EF9" },
  { key: "trade_requests", label: "Trade requests", color: "#EF8799" },
  { key: "chatbot_queries", label: "Chatbot queries", color: "#FCD279" },
];

export default async function AdminReportsPage() {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 86_400_000);
  const dateRange = `${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;

  let stats: PeriodStats = EMPTY;
  let topPages: { page_path: string; views: number }[] = [];
  let tableMissing = false;

  const [{ data: statRows, error: statErr }, { data: pageRows }] = await Promise.all([
    rpc("get_period_stats", { start_ts: start.toISOString(), end_ts: end.toISOString() }),
    rpc("get_top_pages", { start_ts: start.toISOString(), end_ts: end.toISOString(), lim: 10 }),
  ]);

  if (statErr) tableMissing = true;
  if (Array.isArray(statRows) && statRows[0]) stats = { ...EMPTY, ...(statRows[0] as PeriodStats) };
  if (Array.isArray(pageRows)) topPages = pageRows as { page_path: string; views: number }[];

  const reportData: ReportData = { dateRange, stats, topPages };
  const maxViews = Math.max(1, ...topPages.map((p) => p.views));

  return (
    <div className="rounded-2xl border border-white/10 p-4 shadow-xl sm:p-6" style={{ background: "#151E3C" }}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-space-grotesk text-xl font-bold text-[#FEF9FF]">Platform Reports</h1>
            <p className="text-xs text-white/50">Last 7 days · {dateRange}</p>
          </div>
          <ReportDownloadButton data={reportData} />
        </header>

        {tableMissing && (
          <div className="mb-5 rounded-lg border border-[#EF8799]/40 bg-[#EF8799]/10 p-3 text-sm text-[#F4BAC3]">
            Analytics tables not found. Run the migration{" "}
            <code className="font-mono">supabase/migrations/20261104000001_analytics_events.sql</code> in Supabase.
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CARDS.map((c) => (
            <div key={c.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-2xl font-extrabold tabular-nums" style={{ color: c.color }}>
                {(stats[c.key] ?? 0).toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-white/50">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Top pages */}
        <h2 className="mb-3 mt-8 font-space-grotesk text-lg font-bold text-[#FEF9FF]">Top pages</h2>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          {topPages.length === 0 ? (
            <p className="text-sm text-white/40">No page views recorded in this period yet.</p>
          ) : (
            <ul className="space-y-2">
              {topPages.map((p) => (
                <li key={p.page_path} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 truncate text-sm text-white/80">{p.page_path}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span className="block h-full rounded-full bg-[#8B5CF6]" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                  </span>
                  <span className="w-12 shrink-0 text-right text-sm font-semibold text-[#FCD279] tabular-nums">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-xs text-white/40">
          The weekly email report can be triggered at{" "}
          <code className="font-mono">/api/reports/weekly</code> (wire it to a cron / Vercel schedule).
        </p>
      </div>
    </div>
  );
}
