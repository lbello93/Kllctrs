import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";
import crypto from "crypto";

export const maxDuration = 300;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

const SCHEMA_PROMPT = `Extract structured event data from this trading card show page. Return ONLY valid JSON matching this exact shape, no markdown fences, no preamble:

{
  "name": string,
  "date_start": "YYYY-MM-DD" | null,
  "date_end": "YYYY-MM-DD" | null,
  "city": string | null,
  "state": string | null (2-letter abbreviation),
  "venue_name": string | null,
  "venue_address": string | null (full street address only, no city/state/zip),
  "zip_code": string | null,
  "website": string | null (official show website, not cardshowhub.com),
  "categories": string[] (e.g. "Sports Cards", "Pokemon", "Magic: The Gathering"),
  "sponsor_brands": string[] (any of these EXACT brand names mentioned as a sponsor, partner, or grading service on the page: "PSA", "Beckett", "SGC", "Topps", "Panini", "Upper Deck", "Goldin", "Heritage Auctions", "eBay", "Fanatics". Only include a brand if it is explicitly named on the page as a sponsor/partner/official grading service of THIS show. Do not include a brand just because a card of that brand is mentioned as being sold. Empty array if none found.),
  "description": string (150-250 words, engaging, collector-audience tone)
}

If a field isn''t present on the page, use null \u2014 except "description", which must always be filled in using only verified extracted fields. Do not fabricate names, dates, or addresses.`;

function extractStaticMapCoords(html: string) {
  const match = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

function generateDedupeHash(name: string, dateStart: string | null, city: string | null) {
  const key = `${name.toLowerCase().trim()}|${dateStart ?? ""}|${(city ?? "").toLowerCase().trim()}`;
  return crypto.createHash("sha256").update(key).digest("hex");
}

function slugify(name: string, dateStart: string | null) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return dateStart ? `${base}-${dateStart}` : base;
}

async function discoverEventUrls(page: number): Promise<string[]> {
  const res = await fetch(`https://cardshowhub.com/events?page=${page}`, { headers: HEADERS });
  if (!res.ok) return [];

  const html = await res.text();
  const $ = cheerio.load(html);
  const urls = new Set<string>();

  $("a[href^='/events/']").each((_, el) => {
    const href = $(el).attr("href");
    if (href) urls.add(`https://cardshowhub.com${href}`);
  });

  return Array.from(urls);
}

async function extractEvent(url: string) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;

  const html = await res.text();
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const coords = extractStaticMapCoords(html);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: `${SCHEMA_PROMPT}\n\nPage content:\n${pageText.slice(0, 8000)}` }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  try {
    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const extracted = JSON.parse(cleaned);
    return { ...extracted, lat: coords?.lat ?? null, lng: coords?.lng ?? null, source_url: url };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { startPage, pageCount } = (await req.json()) as {
    startPage: number;
    pageCount: number;
  };

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let sponsorsFound = 0;
  const results: { name: string; city: string; state: string; sponsors: string[] }[] = [];
  const errors: string[] = [];

  for (let page = startPage; page < startPage + pageCount; page++) {
    try {
      const eventUrls = await discoverEventUrls(page);
      if (eventUrls.length === 0) break;

      for (const url of eventUrls) {
        const extracted = await extractEvent(url);
        if (!extracted || !extracted.date_start || !extracted.city) continue;

        const dedupeHash = generateDedupeHash(extracted.name, extracted.date_start, extracted.city);
        const { data: existing } = await supabaseAdmin
          .from("events")
          .select("id, sponsors")
          .eq("dedupe_hash", dedupeHash)
          .maybeSingle();

        const brands: string[] = extracted.sponsor_brands ?? [];

        if (existing) {
          const currentSponsors: string[] = existing.sponsors ?? [];
          const newBrands = brands.filter((b) => !currentSponsors.includes(b));

          if (newBrands.length > 0) {
            await supabaseAdmin
              .from("events")
              .update({ sponsors: [...currentSponsors, ...newBrands] })
              .eq("id", existing.id);
            updated++;
            sponsorsFound += newBrands.length;
            results.push({
              name: extracted.name,
              city: extracted.city,
              state: extracted.state,
              sponsors: newBrands,
            });
          } else {
            skipped++;
          }
          continue;
        }

        await supabaseAdmin.from("events").insert({
          name: extracted.name,
          slug: slugify(extracted.name, extracted.date_start),
          date_start: extracted.date_start,
          date_end: extracted.date_end ?? extracted.date_start,
          city: extracted.city,
          state: extracted.state,
          zip_code: extracted.zip_code,
          venue_name: extracted.venue_name,
          venue_address: extracted.venue_address,
          lat: extracted.lat,
          lng: extracted.lng,
          website: extracted.website,
          sponsors: [...(extracted.categories ?? []), ...brands],
          autograph_guests: extracted.description,
          source: "scraper_sponsor_scan",
          source_event_id: url.split("/").pop(),
          dedupe_hash: dedupeHash,
          import_provider: "cardshowhub",
          import_status: "active",
          import_version: "2.0",
          status: "pending",
          submitted_by: user.id,
        });

        inserted++;
        if (brands.length > 0) sponsorsFound += brands.length;
        results.push({ name: extracted.name, city: extracted.city, state: extracted.state, sponsors: brands });
      }
    } catch (err) {
      errors.push(`page ${page}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return NextResponse.json({ inserted, updated, skipped, sponsorsFound, results, errors });
}