const SPONSOR_LOGOS: Record<string, string> = {
  "Beckett": "Beckett.webp",
  "eBay": "ebay.webp",
  "Fanatics": "fanatics.webp",
  "Goldin": "Goldin.webp",
  "Heritage Auctions": "He.webp",
  "Panini": "panini.webp",
  "PSA": "PSA.webp",
  "SGC": "SGC.webp",
  "Topps": "Topps.webp",
  "Upper Deck": "Upperdeck.webp",
};

export function getSponsorLogo(name: string): string | null {
  const file = SPONSOR_LOGOS[name];
  return file ? `/Brand-artifact/${file}` : null;
}