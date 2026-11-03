"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";

interface CsvResult {
  imported: number;
  parsed: number;
  skipped: number;
  errors: string[];
  results: { name: string; city: string; state: string }[];
}

const TEMPLATE =
  "name,date_start,date_end,city,state,venue_name,venue_address,zip_code,website,event_type,lat,lng,source_url";

export default function CsvImportCard() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CsvResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/events/import-csv", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Import failed.");
        if (Array.isArray(data.errors) && data.errors.length) {
          setResult({ imported: 0, parsed: data.parsed ?? 0, skipped: 0, errors: data.errors, results: [] });
        }
        return;
      }
      setResult(data as CsvResult);
    } catch {
      setError("Something went wrong uploading the file.");
    } finally {
      setRunning(false);
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      void upload(file);
    }
  };

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 p-6 backdrop-blur-sm">
      <h2 className="mb-2 text-sm font-black uppercase tracking-wider text-[#5f2eea]">
        Bulk CSV Import
      </h2>
      <p className="mb-4 text-xs text-[#4a3f6b]/60">
        Upload a CSV of events. Rows upsert on a generated slug (re-importing refreshes
        instead of duplicating). New events are added as <strong>pending review</strong>.
      </p>

      <div className="mb-4 overflow-x-auto rounded-lg border border-violet-50 bg-[#faf9ff] p-3">
        <code className="whitespace-pre text-[11px] text-[#4a3f6b]/70">{TEMPLATE}</code>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={onPick}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={running}
        className="flex items-center gap-2 rounded-lg bg-[#5f2eea] px-5 py-3 text-sm font-bold text-white hover:bg-[#4a1fa8] disabled:opacity-50"
      >
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {running ? "Importing…" : fileName ? `Re-upload (${fileName})` : "Choose CSV file"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap gap-6 text-sm">
            <span>
              <strong className="text-[#1a0a3d]">{result.imported}</strong>{" "}
              <span className="text-[#4a3f6b]/60">imported</span>
            </span>
            <span>
              <strong className="text-[#1a0a3d]">{result.parsed}</strong>{" "}
              <span className="text-[#4a3f6b]/60">rows read</span>
            </span>
            {result.skipped > 0 && (
              <span>
                <strong className="text-amber-600">{result.skipped}</strong>{" "}
                <span className="text-[#4a3f6b]/60">skipped</span>
              </span>
            )}
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-500">
              {result.errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}

          {result.results.length > 0 && (
            <div className="max-h-64 space-y-1.5 overflow-y-auto">
              {result.results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-violet-50 p-2.5 text-sm"
                >
                  <span className="font-medium text-[#1a0a3d]">{r.name}</span>
                  <span className="text-[#4a3f6b]/50">{r.city}, {r.state}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
