import { ChatContext } from "./context";

export function buildContext(history: Array<{ content: string }>): ChatContext {
  const context: ChatContext = {};

  for (const message of history) {
    const text = message.content.toLowerCase();

    if (text.includes("pokemon")) {
      context.specialty = "pokemon";
    }

    if (text.includes("sports")) {
      context.specialty = "sports";
    }

    //------------------------------------------------

    const states = [
      "texas",
      "california",
      "florida",
      "alaska",
      "new york",
    ];

    for (const state of states) {
      if (text.includes(state)) {
        context.state = state;
      }
    }
  }

  return context;
}
