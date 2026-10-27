import { searchEbayListings } from "@/lib/ebay";

interface EbaySearchArgs {
  query: string;
}

export async function searchEbayPrices(args: EbaySearchArgs) {
  try {
    const query = args.query.trim().slice(0, 120);
    const items = await searchEbayListings(
      query,
      8
    );

    const listings = items.map((item) => ({
      title: item.title,
      price: `${item.price.currency} ${item.price.value}`,
      price_type: "active asking price",
      condition:
        item.condition ?? "Unknown",
      url: item.itemWebUrl,
      listed_or_ends_at: item.itemEndDate ?? null,
    }));

    return {
      listings,
      count: listings.length,
      checked_at: new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error("[chat] eBay listings lookup failed:", error);
    return {
      listings: [],
      count: 0,
      error: "Current eBay listings are temporarily unavailable.",
    };
  }
}
