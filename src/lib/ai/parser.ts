import type { GenerateContentResponse } from "@google/genai";

export function extractText(response: GenerateContentResponse): string {
  let text = response.text;

  if (!text) {
    const parts =
      response.candidates?.[0]?.content?.parts ??
      [];

    text = parts
      .map((part) => part.text ?? "")
      .join("\n")
      .trim();
  }

  return (
    text ||
    "I couldn't generate a response."
  );
}
