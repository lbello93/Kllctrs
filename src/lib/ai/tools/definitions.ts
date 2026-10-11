import { Type, type Tool } from "@google/genai";
export const tools: Tool[] = [{
  functionDeclarations: [
    {
      name: 'search_events',
      description: 'Search for upcoming sports card shows / events. Use when user asks about card shows, conventions, expos, or trade events.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          state:    { type: Type.STRING, description: '2-letter US state code, e.g. TX, CA, NY' },
          city:     { type: Type.STRING, description: 'City name' },
          keyword:  { type: Type.STRING, description: 'Search keyword for event name or venue' },
          dateFrom: { type: Type.STRING, description: 'Start date YYYY-MM-DD (inclusive)' },
          dateTo:   { type: Type.STRING, description: 'End date YYYY-MM-DD (inclusive)' },
        },
      },
    },
    {
      name: 'search_shops',
      description: 'Search for card shops / trading card stores. Use when user asks where to buy/sell cards locally.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          state:     { type: Type.STRING, description: '2-letter US state code' },
          city:      { type: Type.STRING, description: 'City name' },
          specialty: { type: Type.STRING, enum: ['sports', 'pokemon', 'both'], description: 'sports for sports cards, pokemon for TCG, both for shops carrying both' },
          keyword:   { type: Type.STRING, description: 'Shop name search' },
        },
      },
    },
    {
      name: 'search_sponsors',
      description: 'Search for industry sponsors and services like grading companies (PSA, Beckett, SGC), auction houses (Heritage, Goldin), manufacturers (Topps, Panini), or marketplaces. Use when user asks about grading, auctions, breaks, or specific company names.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: 'e.g. grading, auction, manufacturer, marketplace, breaks' },
          keyword:  { type: Type.STRING, description: 'Company name search' },
        },
      },
    },
    {
      name: 'search_ebay_prices',
      description: 'Search recent eBay listings to find current market prices for trading cards or sports memorabilia. Use when users ask about card values, prices, or what something is selling for.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query: {
            type:Type.STRING,
            description: 'Specific search query for eBay, e.g. "2018 Patrick Mahomes Donruss Optic Rated Rookie", "Charizard 1st Edition Holo PSA 9", "Topps Chrome Update 2023"',
          },
        },
        required: ['query'],
      },
    },
  ],
}]
