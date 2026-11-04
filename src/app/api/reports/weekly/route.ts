import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateFullReport, type PeriodStats, type ReportData } from "@/lib/report-generator";

export const runtime = "nodejs";
export const maxDuration = 60;

type Rpc = (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
const rpc = (supabaseAdmin.rpc as unknown as Rpc).bind(supabaseAdmin);

const EMPTY: PeriodStats = {
  total_page_views: 0, unique_visitors: 0, total_logins: 0, new_signups: 0,
  event_views: 0, card_views: 0, searches: 0, trade_requests: 0,
  chatbot_queries: 0, active_users: 0,
};

async function authorize(request: Request): Promise<boolean> {
  // Cron path: ?secret=<CRON_SECRET>. Manual path: logged-in admin.
  const secret = new URL(request.url).searchParams.get("secret");
  if (process.env.CRON_SECRET && secret === process.env.CRON_SECRET) return true;
  const auth = await getAdminApiContext();
  return auth.ok;
}

/** Try to email the report via SMTP (nodemailer), if configured. Never throws. */
async function tryEmail(subject: string, html: string): Promise<boolean> {
  const to = process.env.REPORT_EMAIL; // TODO: set Leo's email
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!to || !host || !user || !pass) return false;
  try {
    // Indirect specifier + any: optional dependency, never breaks the build when
    // nodemailer isn't installed. Install `nodemailer` to enable email delivery.
    const specifier = "nodemailer";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import(/* webpackIgnore: true */ specifier).catch(() => null);
    if (!mod?.createTransport) return false;
    const transport = mod.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user, pass },
    });
    await transport.sendMail({ from: process.env.SMTP_FROM || user, to, subject, html });
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const end = new Date();
  const start = new Date(end.getTime() - 7 * 86_400_000);
  const dateRange = `${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;

  const [{ data: statRows }, { data: pageRows }] = await Promise.all([
    rpc("get_weekly_stats"),
    rpc("get_top_pages", { start_ts: start.toISOString(), end_ts: end.toISOString(), lim: 10 }),
  ]);

  const stats: PeriodStats = Array.isArray(statRows) && statRows[0]
    ? { ...EMPTY, ...(statRows[0] as PeriodStats) }
    : EMPTY;
  const topPages = Array.isArray(pageRows) ? (pageRows as { page_path: string; views: number }[]) : [];

  const data: ReportData = { dateRange, stats, topPages };
  const html = generateFullReport(data);
  const subject = `KLLCTRS Weekly Report — ${dateRange}`;

  const sent = await tryEmail(subject, html);

  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  return NextResponse.json({
    ok: true,
    emailed: sent,
    note: sent
      ? "Weekly report emailed."
      : "Report generated. To email it, set REPORT_EMAIL + SMTP_HOST/USER/PASS and install nodemailer.",
    data,
  });
}
