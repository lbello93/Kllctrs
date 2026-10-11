import type { EventProvider } from "./ingestion-contract";

const PERMISSION_ENV: Partial<Record<EventProvider, string>> = {
  tcdb: "TCDB_WRITTEN_PERMISSION_CONFIRMED",
  sportscollectorsdigest: "SCD_WRITTEN_PERMISSION_CONFIRMED",
  cardshowhub: "CARDSHOWHUB_WRITTEN_PERMISSION_CONFIRMED",
};

/**
 * Existing third-party event sources are disabled unless an operator has
 * obtained and documented written permission for the intended use.
 */
export function hasWrittenSourcePermission(provider: EventProvider): boolean {
  const envName = PERMISSION_ENV[provider];
  return provider === "organizer_submission" || Boolean(
    envName && process.env[envName] === "true",
  );
}
