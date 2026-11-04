"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { trackEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Existing geo/location analytics.
    fetch("/api/analytics/location", {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});

    // Handover: page_view into analytics_events (powers the weekly report).
    // Admin traffic is excluded so reports reflect real users.
    if (pathname && !pathname.startsWith("/admin")) {
      trackEvent("page_view");
    }
  }, [pathname]);

  return null;
}
