import { FEW_SHOT_EXAMPLES } from "./examples";
import { GRADING_EXAMPLES } from "./examples/grading";
import { EVENTS_EXAMPLES } from "./examples/events";
import { SHOPS_EXAMPLES } from "./examples/shops";
import { PRICING_EXAMPLES } from "./examples/pricing";
import { POKEMON_EXAMPLES } from "./examples/pokemon";
import { TERMINOLOGY_EXAMPLES } from "./examples/terminology";

export function getRelevantExamples(message: string) {
  const text = message.toLowerCase();

  let prompt = FEW_SHOT_EXAMPLES;

  //--------------------------------------------------
  // Events
  //--------------------------------------------------

  if (
    text.includes("event") ||
    text.includes("show") ||
    text.includes("convention") ||
    text.includes("expo")
  ) {
    prompt += EVENTS_EXAMPLES;
  }

  //--------------------------------------------------
  // Shops
  //--------------------------------------------------

  if (
    text.includes("shop") ||
    text.includes("store") ||
    text.includes("dealer")
  ) {
    prompt += SHOPS_EXAMPLES;
  }

  //--------------------------------------------------
  // Pricing
  //--------------------------------------------------

  if (
    text.includes("price") ||
    text.includes("worth") ||
    text.includes("value") ||
    text.includes("sell")
  ) {
    prompt += PRICING_EXAMPLES;
  }

  //--------------------------------------------------
  // Grading
  //--------------------------------------------------

  if (
    text.includes("psa") ||
    text.includes("bgs") ||
    text.includes("sgc") ||
    text.includes("grade")
  ) {
    prompt += GRADING_EXAMPLES;
  }

  //--------------------------------------------------
  // Pokemon
  //--------------------------------------------------

  if (
    text.includes("pokemon") ||
    text.includes("charizard") ||
    text.includes("pikachu")
  ) {
    prompt += POKEMON_EXAMPLES;
  }

  //--------------------------------------------------
  // Terminology
  //--------------------------------------------------

  if (
    text.includes("ssp") ||
    text.includes("refractor") ||
    text.includes("parallel") ||
    text.includes("rookie")
  ) {
    prompt += TERMINOLOGY_EXAMPLES;
  }

  return prompt;
}