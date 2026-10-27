interface EbayListing {
  title: string;
  price: string;
  condition: string;
  url: string;
}

export function formatEbayListings(listings: EbayListing[]) {
  if (!listings || listings.length === 0) {
    return `
No recent eBay listings were found.
`;
  }

  return `
Recent eBay Listings

${listings
  .map(
    (listing, index) => `
Listing #${index + 1}

Title:
${listing.title}

Price:
${listing.price}

Condition:
${listing.condition}

URL:
${listing.url}
`
  )
  .join("\n")}
`;
}
