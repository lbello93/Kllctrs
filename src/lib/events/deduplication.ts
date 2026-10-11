import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { classifyEventIdentityMatch, type EventCandidate } from "./ingestion-contract";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function findEventIdentityMatch(
  supabase: SupabaseClient<Database>,
  candidate: EventCandidate,
) {
  const event = candidate.event;
  if (!event.dateStart || !event.name || !event.city || !event.state) return null;

  const { data: sameSource, error: sourceLookupError } = await supabase
    .from("events")
    .select("id,name,slug,date_start,city,state,venue_name,venue_address,social_links")
    .eq("source", candidate.source.provider)
    .filter("social_links->kllctrs_ingestion->source->>sourceId", "eq", candidate.source.sourceId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (sourceLookupError) throw sourceLookupError;
  if (sameSource?.length) {
    const sameContent = sameSource.find((stored) => {
      const links = isRecord(stored.social_links) ? stored.social_links : null;
      const ingestion = links && isRecord(links.kllctrs_ingestion) ? links.kllctrs_ingestion : null;
      const source = ingestion && isRecord(ingestion.source) ? ingestion.source : null;
      return source?.contentHash === candidate.source.contentHash;
    });
    return {
      event: sameContent ?? sameSource[0],
      match: sameContent ? "same_source" as const : "needs_review" as const,
    };
  }

  const { data, error } = await supabase
    .from("events")
    .select("id,name,slug,date_start,city,state,venue_name,venue_address")
    .eq("date_start", event.dateStart);
  if (error) throw error;

  const incoming = {
    name: event.name,
    dateStart: event.dateStart,
    city: event.city,
    state: event.state,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
  };
  const matches = (data ?? []).map((stored) => ({
    event: stored,
    match: classifyEventIdentityMatch(incoming, {
      name: stored.name,
      dateStart: stored.date_start,
      city: stored.city,
      state: stored.state,
      venueName: stored.venue_name,
      venueAddress: stored.venue_address,
    }),
  }));

  return matches.find(({ match }) => match === "exact")
    ?? matches.find(({ match }) => match === "needs_review")
    ?? null;
}
