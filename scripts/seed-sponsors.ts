/**
 * Seeds the `sponsors` table with the major trading-card industry companies.
 * Upserts on `slug` so it is safe to re-run (no duplicates, refreshes fields).
 *
 * Run: npx tsx scripts/seed-sponsors.ts
 */

import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";
import { config } from "dotenv";
import { resolve } from "path";

import type { Database } from "../src/types/database";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_KEY);

type SponsorCategory = "grading" | "marketplace" | "auction_house" | "manufacturer";

interface SeedSponsor {
  name: string;
  category: SponsorCategory;
  website: string;
  description: string;
}

const SPONSORS: SeedSponsor[] = [
  // Grading
  {
    name: "PSA",
    category: "grading",
    website: "https://www.psacard.com",
    description:
      "Professional Sports Authenticator — the industry's largest third-party grading and authentication service for trading cards and memorabilia.",
  },
  {
    name: "SGC",
    category: "grading",
    website: "https://www.gosgc.com",
    description:
      "Sportscard Guaranty Company, a long-running grading service known for fast turnaround and its distinctive tuxedo-black card holders.",
  },
  {
    name: "Beckett",
    category: "grading",
    website: "https://www.beckett.com",
    description:
      "Beckett Grading Services, a pioneer of the hobby's pricing guides and a major card grading and authentication company.",
  },
  {
    name: "JSA",
    category: "grading",
    website: "https://www.spenceloa.com",
    description:
      "James Spence Authentication — a leading authority on autograph authentication for sports and entertainment memorabilia.",
  },

  // Marketplaces
  {
    name: "eBay",
    category: "marketplace",
    website: "https://www.ebay.com",
    description:
      "The largest global online marketplace for trading cards, with dedicated tools for vaulting, grading submissions, and price research.",
  },
  {
    name: "COMC",
    category: "marketplace",
    website: "https://www.comc.com",
    description:
      "Check Out My Cards — a consignment marketplace that stores, scans, and ships individual cards on a seller's behalf.",
  },
  {
    name: "ALT",
    category: "marketplace",
    website: "https://www.alt.xyz",
    description:
      "A marketplace and vaulting platform treating trading cards as a tracked asset class, with instant offers and portfolio valuation.",
  },
  {
    name: "Arena Club",
    category: "marketplace",
    website: "https://www.arenaclub.com",
    description:
      "A digital card show and marketplace co-founded by Derek Jeter, offering grading, a vault, and a social showroom experience.",
  },

  // Auction Houses
  {
    name: "Heritage Auctions",
    category: "auction_house",
    website: "https://www.ha.com",
    description:
      "One of the world's largest collectibles auction houses, running marquee sports and trading card auctions throughout the year.",
  },
  {
    name: "Goldin",
    category: "auction_house",
    website: "https://www.goldin.co",
    description:
      "A premier auction house for high-end trading cards and memorabilia, known for record-setting sales of iconic cards.",
  },
  {
    name: "Pristine Auction",
    category: "auction_house",
    website: "https://www.pristineauction.com",
    description:
      "A daily auction platform for sports cards, memorabilia, and breaks with low starting bids and frequent closings.",
  },
  {
    name: "Fanatics Collect",
    category: "auction_house",
    website: "https://www.fanaticscollect.com",
    description:
      "Fanatics' auction and marketplace platform for trading cards and collectibles, integrating weekly premier and value auctions.",
  },

  // Manufacturers
  {
    name: "Fanatics",
    category: "manufacturer",
    website: "https://www.fanaticsinc.com",
    description:
      "The global sports platform that now holds the exclusive trading card licenses for the major U.S. sports leagues.",
  },
  {
    name: "Topps",
    category: "manufacturer",
    website: "https://www.topps.com",
    description:
      "The iconic trading card brand behind flagship baseball and multi-sport sets, now operating under the Fanatics umbrella.",
  },
  {
    name: "Panini",
    category: "manufacturer",
    website: "https://www.paniniamerica.net",
    description:
      "A leading manufacturer of trading cards and stickers, long-time producer of premium basketball and football card products.",
  },
  {
    name: "Upper Deck",
    category: "manufacturer",
    website: "https://www.upperdeckstore.com",
    description:
      "A trading card manufacturer renowned for its hockey products and exclusive athlete signings across multiple sports.",
  },
];

async function main() {
  console.info(`Seeding ${SPONSORS.length} sponsors…`);

  const rows = SPONSORS.map((s) => ({
    name: s.name,
    slug: slugify(s.name, { lower: true, strict: true }),
    category: s.category,
    website: s.website,
    description: s.description,
    status: "approved",
    verified: true,
  }));

  const { data, error } = await supabase
    .from("sponsors")
    .upsert(rows, { onConflict: "slug" })
    .select("id,name,slug");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.info(`Upserted ${data?.length ?? 0} sponsors:`);
  for (const row of data ?? []) console.info(`  • ${row.name} (${row.slug})`);
  console.info("Done.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
