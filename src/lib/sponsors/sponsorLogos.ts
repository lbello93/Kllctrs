const SPONSOR_LOGOS: Record<string, string> = {
  "Beckett": "Beckett.png",
  "eBay": "ebay.png",
  "Fanatics": "fanatics.png",
  "Goldin": "Goldin.png",
  "Heritage Auctions": "He.png",
  "Panini": "panini.png",
  "PSA": "PSA.png",
  "SGC": "SGC.png",
  "Topps": "Topps.png",
  "Upper Deck": "Upperdeck.png",
};

export function getSponsorLogo(name: string): string | null {
  const file = SPONSOR_LOGOS[name];
  return file ? `/sponsors/${file}` : null;
}