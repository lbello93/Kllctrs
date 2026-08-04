import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";

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
  "description": string (150-250 words, engaging, collector-audience tone)
}

If a field isn't present on the page, use null. Do not fabricate data.`;

function extractStaticMapCoords(html: string): { lat: number; lng: number } | null {
  const match = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

async function scrapeEvent(url: string) {
  console.log(`Fetching: ${url}`);

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const coords = extractStaticMapCoords(html);

  console.log("Sending to Claude for extraction...");

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${SCHEMA_PROMPT}\n\nPage content:\n${pageText.slice(0, 8000)}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  const extracted = JSON.parse(cleaned);

  const result = {
    ...extracted,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    source_url: url,
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
}

// Run: npx tsx scripts/scrape-event.ts <url>
const url = process.argv[2];
if (!url) {
  console.error("Usage: npx tsx scripts/scrape-event.ts <event-url>");
  process.exit(1);
}

scrapeEvent(url).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});