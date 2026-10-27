import type { Content } from "@google/genai";

export function buildConversation(
  message: string,
  history: Array<{ role: string; content: string }> = [],
): Content[] {
  return [
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];
}
