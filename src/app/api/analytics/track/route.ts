import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const VALID = new Set([
  "page_view", "login", "signup", "event_view", "card_view",
  "search", "trade_request", "chatbot_query", "content_studio_use",
]);

/** Hash the IP with a rotating daily salt so raw IPs are never stored. */
function hashIp(ip: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${day}|kllctrs`).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  let body: { eventType?: unknown; pagePath?: unknown; metadata?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventType = typeof body.eventType === "string" ? body.eventType : "";
  if (!VALID.has(eventType)) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // analytics_events is not in the generated DB types yet; use a typed escape.
  type Insertable = { from: (t: string) => { insert: (rows: Record<string, unknown>) => Promise<{ error: unknown }> } };
  const db = supabase as unknown as Insertable;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "0.0.0.0";

  await db.from("analytics_events").insert({
    event_type: eventType,
    user_id: user?.id ?? null,
    page_path: typeof body.pagePath === "string" ? body.pagePath.slice(0, 512) : null,
    metadata: (body.metadata && typeof body.metadata === "object" ? body.metadata : {}) as Record<string, unknown>,
    ip_hash: hashIp(ip),
    user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
  });

  return NextResponse.json({ ok: true });
}
