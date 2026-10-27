import { searchEvents } from "../services/events";
import { searchShops } from "../services/shops";
import { searchSponsors } from "../services/sponsors";
import { searchEbayPrices } from "../services/ebay";
import { searchContent } from "../services/content";


interface ToolCall {
  name: string;
  args?: unknown;
}

interface ExecutedToolResult {
  result: Record<string, unknown>;
  count: number;
}

function getArgs(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function getString(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" ? value : undefined;
}

export async function executeTool(call: ToolCall): Promise<ExecutedToolResult> {
  const args = getArgs(call.args);
  switch (call.name) {
    case "search_events":
      {
        const result = await searchEvents({
          state: getString(args, "state"),
          city: getString(args, "city"),
          keyword: getString(args, "keyword"),
          dateFrom: getString(args, "dateFrom"),
          dateTo: getString(args, "dateTo"),
        });
        return { result, count: result.total };
      }

    case "search_shops":
      {
        const specialty = getString(args, "specialty");
        const result = await searchShops({
          state: getString(args, "state"),
          city: getString(args, "city"),
          specialty:
            specialty === "sports" || specialty === "pokemon" || specialty === "both"
              ? specialty
              : undefined,
          keyword: getString(args, "keyword"),
        });
        return { result, count: result.total };
      }

    case "search_sponsors":
      {
        const result = await searchSponsors({
          category: getString(args, "category"),
          keyword: getString(args, "keyword"),
        });
        return { result, count: result.total };
      }

    case "search_content":
      {
        const keyword = getString(args, "keyword");
        if (!keyword) return { result: { found: false, total: 0, articles: [] }, count: 0 };
        const result = await searchContent({
          keyword,
          category: getString(args, "category"),
        });
        return { result, count: result.total };
      }

    case "search_ebay_prices":
      {
        const query = getString(args, "query");
        if (!query) {
          return {
            result: { listings: [], count: 0, error: "A search query is required." },
            count: 0,
          };
        }
        const result = await searchEbayPrices({ query });
        return { result, count: result.count };
      }

    default:
      return { result: { error: "Unknown tool" }, count: 0 };
  }
}
