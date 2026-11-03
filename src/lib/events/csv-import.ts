import "server-only";

import slugify from "slugify";
import type { TablesInsert } from "@/types/database";

/**
 * Bulk CSV event import.
 *
 * Expected header row (order-independent, case-insensitive). Required columns:
 * name, date_start, city, state. All others are optional:
 *
 *   name, date_start, date_end, city, state, venue_name, venue_address,
 *   zip_code, website, event_type, lat, lng, source_url
 *
 * date_start / date_end accept YYYY-MM-DD.
 */

export interface CsvParseResult {
  rows: TablesInsert<"events">[];
  errors: string[];
  parsed: number;
}

const REQUIRED = ["name", "date_start", "city", "state"] as const;

/** Minimal RFC-4180-ish CSV line splitter (handles quotes and escaped quotes). */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(field);
      field = "";
    } else {
      field += ch;
    }
  }
  out.push(field);
  return out.map((f) => f.trim());
}

function toRows(text: string): Record<string, string>[] {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const records: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h] = cells[idx] ?? "";
    });
    records.push(record);
  }
  return records;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseNum(value: string): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseEventsCsv(text: string): CsvParseResult {
  const records = toRows(text);
  if (records.length === 0) {
    return { rows: [], errors: ["No data rows found. Include a header row and at least one event."], parsed: 0 };
  }

  const rows: TablesInsert<"events">[] = [];
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  records.forEach((rec, idx) => {
    const line = idx + 2; // account for header + 1-indexing
    const missing = REQUIRED.filter((key) => !rec[key]);
    if (missing.length) {
      errors.push(`Row ${line}: missing required ${missing.join(", ")}.`);
      return;
    }
    if (!DATE_RE.test(rec.date_start)) {
      errors.push(`Row ${line} ("${rec.name}"): date_start must be YYYY-MM-DD.`);
      return;
    }
    if (rec.date_end && !DATE_RE.test(rec.date_end)) {
      errors.push(`Row ${line} ("${rec.name}"): date_end must be YYYY-MM-DD.`);
      return;
    }

    const state = rec.state.toUpperCase().slice(0, 2);
    const baseSlug =
      slugify(`${rec.name}-${rec.city}-${rec.date_start}`, { lower: true, strict: true }).slice(0, 80) ||
      `event-${line}`;
    let slug = baseSlug;
    let dedup = 2;
    while (seenSlugs.has(slug)) slug = `${baseSlug}-${dedup++}`;
    seenSlugs.add(slug);

    rows.push({
      name: rec.name,
      slug,
      date_start: rec.date_start,
      date_end: rec.date_end || null,
      city: rec.city,
      state,
      venue_name: rec.venue_name || null,
      venue_address: rec.venue_address || null,
      zip_code: rec.zip_code || null,
      website: rec.website || null,
      event_type: rec.event_type || null,
      lat: parseNum(rec.lat),
      lng: parseNum(rec.lng),
      source_url: rec.source_url || null,
      source: "csv_import",
      status: "pending",
    });
  });

  return { rows, errors, parsed: records.length };
}
