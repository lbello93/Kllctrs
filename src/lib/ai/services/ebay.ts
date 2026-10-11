import { searchEbaySoldListings } from "@/lib/ebay";

interface EbaySearchArgs {
  query: string;
}

export async function searchEbayPrices(args: EbaySearchArgs) {
  try {
    const items = await searchEbaySoldListings(
      args.query,
      8
    );

    const listings = items.map((item) => ({
      title: item.title,
      price: `${item.price.currency} ${item.price.value}`,
      condition:
        item.condition ?? "Unknown",
      url: item.itemWebUrl,
    }));

    return {
      listings,
      count: listings.length,
    };
  } catch (error: unknown) {
    return {
      listings: [],
      count: 0,
      error: error instanceof Error ? error.message : "eBay search failed",
    };
  }
}
