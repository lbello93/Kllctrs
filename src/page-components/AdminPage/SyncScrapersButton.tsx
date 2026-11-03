"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

export default function SyncScrapersButton() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "info" | "err"; text: string } | null>(null);

  const sync = async () => {
    setRunning(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/events/scrape", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const added = typeof data.inserted === "number" ? ` ${data.inserted} added.` : "";
        setMessage({ kind: "ok", text: `Scrape triggered.${added}` });
      } else if (res.status === 503) {
        // Automated retrieval is gated pending written source permission.
        setMessage({ kind: "info", text: data.error ?? "Automated scraping is currently disabled." });
      } else {
        setMessage({ kind: "err", text: data.error ?? "Could not trigger a scrape." });
      }
    } catch {
      setMessage({ kind: "err", text: "Request failed. Try again." });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <button
        onClick={sync}
        disabled={running}
        className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2 text-xs font-bold text-[#5f2eea] transition hover:bg-violet-50 disabled:opacity-50"
      >
        {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        {running ? "Syncing…" : "Sync Scrapers"}
      </button>
      {message && (
        <p
          className={`mt-2 text-xs ${
            message.kind === "ok"
              ? "text-emerald-600"
              : message.kind === "info"
                ? "text-[#4a3f6b]/60"
                : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
