/**
 * Lightweight client-side analytics. Events are sent to the server route, which
 * hashes the IP (for unique-visitor counting) and attaches the session user.
 * Fire-and-forget: tracking never blocks or throws into the UI.
 */
"use client";

export type AnalyticsEvent =
  | "page_view"
  | "login"
  | "signup"
  | "event_view"
  | "card_view"
  | "search"
  | "trade_request"
  | "chatbot_query"
  | "content_studio_use";

export function trackEvent(eventType: AnalyticsEvent, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    eventType,
    pagePath: window.location.pathname,
    metadata: metadata ?? {},
  });
  try {
    // sendBeacon survives page navigation; fall back to fetch.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* never surface analytics failures */
  }
}
