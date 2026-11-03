import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

// Supabase delivers webhooks over HTTP with no retries we control, so the raw
// body must be read verbatim and its HMAC checked before anything is parsed.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Header carrying the hex HMAC-SHA256 of the raw body, signed with
// SUPABASE_WEBHOOK_SECRET. Configure this as a custom header on the Supabase
// webhook (or an edge function that signs the payload).
const SIGNATURE_HEADER = "x-supabase-signature";

/** Timing-safe comparison of two hex signature strings. */
function signaturesMatch(expectedHex: string, providedHex: string): boolean {
  const expected = Buffer.from(expectedHex, "hex");
  // A malformed header yields an empty/odd buffer; reject rather than throw.
  let provided: Buffer;
  try {
    provided = Buffer.from(providedHex, "hex");
  } catch {
    return false;
  }
  if (expected.length === 0 || expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

type SupabaseRecord = Record<string, unknown> & { id?: string; email?: string };

// Supabase database webhooks send { type: INSERT|UPDATE|DELETE, table, record,
// old_record, schema }. We also accept an explicit { type: "user.created" } shape
// in case the payload is produced by an auth hook or edge function.
interface WebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: SupabaseRecord | null;
  old_record?: SupabaseRecord | null;
}

/** Normalize the payload to a logical event name we dispatch on. */
function resolveEvent(payload: WebhookPayload): string | null {
  const type = payload.type;
  if (!type) return null;

  // Already a logical event name.
  if (type.includes(".")) return type;

  // Database webhook shape: map table + operation to a logical event.
  const isUserTable =
    payload.table === "users" || payload.table === "profiles";
  if (isUserTable && type === "INSERT") return "user.created";
  if (isUserTable && type === "UPDATE") return "user.updated";

  return `${payload.table ?? "unknown"}.${type.toLowerCase()}`;
}

export async function POST(request: Request) {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhooks/supabase] SUPABASE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook handler is not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER);
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Read the raw body exactly as sent so the HMAC matches byte for byte.
  const rawBody = await request.text();
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  if (!signaturesMatch(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const event = resolveEvent(payload);

  switch (event) {
    case "user.created":
      // TODO: wire up provisioning side effects (welcome email, defaults, etc.).
      // Kept as an acknowledged no-op so unverified business logic isn't invented.
      console.info("[webhooks/supabase] user.created", payload.record?.id);
      break;
    case "user.updated":
      console.info("[webhooks/supabase] user.updated", payload.record?.id);
      break;
    default:
      // Acknowledge unhandled events with 200 so Supabase does not retry them.
      console.info("[webhooks/supabase] unhandled event", event);
  }

  return NextResponse.json({ received: true, event });
}
