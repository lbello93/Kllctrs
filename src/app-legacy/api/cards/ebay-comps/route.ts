// app/api/cards/ebay-comps/route.ts
import { NextRequest, NextResponse } from "next/server";

interface EbayItem {
  title: string;
  price: { value: string; currency: string };
  condition: string;
  itemEndDate?: string;
  itemCreationDate?: string;
  image?: { imageUrl: string };
  itemWebUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const { cardName, player, year, brand, sport, grade } = await req.json();

    if (!cardName) {
      return NextResponse.json({ error: "cardName required" }, { status: 400 });
    }

    // Build search query from card details
    const parts = [year, brand, player, cardName, grade !== "raw" ? grade : ""]
      .filter(Boolean);
    const query = parts.join(" ");

    const token = await getEbayToken();

    // Search sold/completed items via Browse API
    const searchUrl = new URL("https://api.ebay.com/buy/browse/v1/item_summary/search");
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("category_ids", getCategoryId(sport));
    searchUrl.searchParams.set("filter", "buyingOptions:{FIXED_PRICE|AUCTION},conditions:{NEW|LIKE_NEW|VERY_GOOD}");
    searchUrl.searchParams.set("sort", "-price");
    searchUrl.searchParams.set("limit", "10");

    const res = await fetch(searchUrl.toString(), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("eBay API error:", errText);
      return NextResponse.json({ comps: [], error: "eBay search failed" });
    }

    const data: { itemSummaries?: EbayItem[] } = await res.json();

    const comps = (data.itemSummaries ?? []).slice(0, 6).map((item) => ({
      title: item.title,
      price: parseFloat(item.price?.value ?? "0"),
      currency: item.price?.currency ?? "USD",
      condition: item.condition ?? "Unknown",
      date: item.itemEndDate ?? item.itemCreationDate ?? null,
      image: item.image?.imageUrl ?? null,
      url: item.itemWebUrl,
    }));

    return NextResponse.json({ comps, query });
  } catch (err) {
    console.error("eBay comps error:", err);
    return NextResponse.json({ comps: [], error: "Internal error" }, { status: 500 });
  }
}

// OAuth client credentials flow for eBay
async function getEbayToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID!;
  const clientSecret = process.env.EBAY_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });

  const data = await res.json();
  return data.access_token;
}

function getCategoryId(sport: string): string {
  const map: Record<string, string> = {
    baseball: "213",
    basketball: "214",
    football: "215",
    hockey: "216",
    soccer: "218",
    pokemon: "183454",
    yugioh: "183454",
    magic: "183454",
    other: "212",
  };
  return map[sport?.toLowerCase()] ?? "212";
}
