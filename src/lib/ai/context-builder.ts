import { normalizeState } from "./utils/state";
import type { ChatContext } from "./context";

const STATE_NAMES = [
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware",
  "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky",
  "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri",
  "montana", "nebraska", "nevada", "new hampshire", "new jersey", "new mexico", "new york", "north carolina",
  "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota",
  "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming",
];

export function buildContext(history: Array<{ role?: string; content: string }>): ChatContext {
  const context: ChatContext = {};

  for (const message of history) {
    if (message.role && message.role !== "user") continue;
    const original = message.content;
    const text = original.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (/\bpokemon\b|\btcg\b/.test(text)) context.specialty = "pokemon";
    if (/\bsports? cards?\b/.test(text)) context.specialty = "sports";

    const stateMentions: Array<{ index: number; code: string }> = [];
    for (const stateName of STATE_NAMES) {
      for (const match of text.matchAll(new RegExp(`\\b${stateName}\\b`, "g"))) {
        stateMentions.push({ index: match.index ?? 0, code: normalizeState(stateName) ?? "" });
      }
    }

    // Only recognize postal abbreviations when explicitly typed in uppercase;
    // codes such as IN, OR, and ME are common English words in lowercase.
    for (const match of original.matchAll(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/g)) {
      stateMentions.push({ index: match.index ?? 0, code: match[1] });
    }
    stateMentions.sort((a, b) => a.index - b.index);
    if (stateMentions.length > 0) context.state = stateMentions[stateMentions.length - 1].code;
  }

  return context;
}
