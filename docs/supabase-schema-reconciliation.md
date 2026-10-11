# Supabase Schema Reconciliation

## Why this is needed

The repository has no tracked Supabase migrations. `src/types/database.ts` is the only checked-in database snapshot, but TypeScript errors show active application code querying tables, views, and columns that are absent from that snapshot. The codebase alone cannot establish whether those objects exist in the linked Supabase project.

Do not add guessed declarations to `src/types/database.ts` or create migrations from these names alone. First compare this inventory with the live project schema or its authoritative migration history, then regenerate types from that source.

## Objects referenced by application code but absent from the checked-in type snapshot

### Tables

- `event_reviews`: used by event detail pages and review submission.
- `analytics_locations`: used by analytics visit queries.

### Views

- `shop_favorite_counts`
- `event_save_counts`
- `state_engagement_summary`

These are used by the admin sponsorship insights endpoint.

### `events` fields

Event ingestion and scraping code references fields not present in the checked-in `events` type, including `dedupe_hash`, `source_event_id`, `import_provider`, `import_status`, and `import_version`. The TCDB import mapper also refers to `time_start`, `time_end`, `venue_id`, and `metadata`.

### `profiles` fields

Profile and onboarding flows reference fields not present in the checked-in type, including `country`, `collector_type`, `favorite_games`, `event_notifications`, `shop_notifications`, `community_notifications`, `marketing_notifications`, `profile_completed`, `terms_accepted`, and `terms_accepted_at`. The auth callback currently writes `display_name`, which matches the checked-in snapshot.

## Required next step

Obtain an authoritative schema snapshot for the linked `KLLCTRS` Supabase project (or its migration history). Compare each item above against that schema, decide which application references are stale and which database objects are missing, add versioned migrations only for the latter, then regenerate `src/types/database.ts` from the resulting schema.

After that, fix remaining typed query and update errors against the generated types. Keep the event scraper, event-review, analytics, and profile fields aligned with the actual database instead of suppressing errors with broad casts.

## Read-only access attempt (2026-10-11)

The user authorized fetching a read-only schema snapshot. The repo identifies project ref `ntowgijfpkkohenxipxf` in `supabase/.temp/linked-project.json`, but has no `supabase/config.toml` and no stored Supabase CLI login. The CLI's `db dump --linked` therefore stopped with `ProjectRefNotLinkedError`. A read-only request to the Supabase REST OpenAPI endpoint was also rejected by the environment's security layer because a secret API key cannot be used in this context. No schema data was obtained, no database write was attempted, and no key values were copied into this document or output.

To continue, provide a schema-only export or migration history, or establish a supported protected Supabase CLI connection for this project. Until then, keep declarations for the missing database objects out of `src/types/database.ts`.

## Phase 0 verification (2026-10-11)

- `npx supabase db dump --linked --schema public` could not run because the checkout is not linked in the Supabase CLI. The REST OpenAPI request was rejected by the environment security layer. No live schema was inferred from application code.
- `npx next typegen` completed successfully. Starting and stopping Next.js dev refreshed its stale `.next/dev` validator, which had contained a truncated `oute.ts` token.
- `tsc --noEmit` now reports 21 diagnostics across nine source files. They are confined to the database-dependent event ingestion, scraper log, sponsorship views, profile update, event review, and analytics queries inventoried above.
- ESLint reports zero errors and 37 warnings across `src` after replacing unsafe `any` annotations, correcting app data types, and fixing the detected effect and JSX lint errors.
- `git diff --check` passes. No tests or database writes were run.
- Four formerly empty API route files now export valid empty modules so Next's route type validation can import them. They still have no HTTP handlers and remain unimplemented product endpoints: `/api/alerts`, `/api/content/generate`, `/api/cron/scrape`, and `/api/webhooks/supabase`.

Phase 0's code-only cleanup is complete. Do not mark schema alignment or typecheck as complete until a live schema export or supported CLI connection confirms which referenced database objects exist and the generated types can be reconciled against that evidence.

## Phase 1 schema-safe implementation

- The shared event candidate contract now carries provider, source ID/URL, observation time, content hash, normalized event identity, quality warnings, sponsor claims, and a pending-review state.
- The CardShowHub payload normalizer follows the shared contract, but its scraper and sponsor-scan endpoints are disabled because the site's terms prohibit automated collection without written permission.
- TCDB, Sports Collector Digest, and authenticated organizer submissions now share one candidate-to-row mapper whose insert type is derived from the checked-in `events` schema. The same normalized identity matcher is used across these paths. Rows remain `pending` for admin approval. Exact matches are skipped; uncertain matches become pending review rows linked to the possible existing event, so a reviewer can reject or approve the proposed record without overwriting the existing one.
- The shared mapper stores source provider/ID/URL, observation time, content hash, normalized fingerprint, categories, quality warnings, and unverified sponsor claims in the namespaced `social_links.kllctrs_ingestion` JSON object. The checked-in schema types `social_links` as `Json`, and repository search found no application reader that assumes it contains only flat social URLs. The admin pending-event list displays this evidence.
- Unverified sponsor claims are stored only as evidence in that JSON object. The shared mapper leaves the event's canonical `sponsors` field empty so approving an event cannot silently promote a scraped claim into a verified sponsor relationship.
- Geocoding is optional enrichment: failures no longer block source ingestion, and missing coordinates are returned as a review warning in the candidate/report.
- Existing third-party source ingestion is now gated by provider-specific written-permission flags: `TCDB_WRITTEN_PERMISSION_CONFIRMED`, `SCD_WRITTEN_PERMISSION_CONFIRMED`, and `CARDSHOWHUB_WRITTEN_PERMISSION_CONFIRMED`. Set a flag to `true` only after written permission covers Kllctrs' commercial use, automated retrieval, storage, and public display as applicable.
- A reusable permission request and enablement checklist is in [`docs/event-source-permission-request.md`](./event-source-permission-request.md). No permission request has been sent from this task.
- TCDB's [Terms of Use](https://www.tcdb.com/TermsOfUse.cfm) prohibit robots and screen scraping and limit the site license to personal, non-commercial use; commercial use requires express written consent. Both the TCDB file import and any future automated discovery therefore remain disabled until written permission is documented.
- CardShowHub's [Terms of Service](https://cardshowhub.com/terms) prohibit automated collection and systematic retrieval without prior written permission. CardShowHub scraping endpoints remain disabled and unscheduled until written permission or a licensed feed is secured.
- Sports Collector Digest's source access terms have not been verified. Its admin-triggered fetch and cron handler require written permission to be documented before either can ingest; the cron additionally requires `SCD_AUTOMATION_ENABLED=true`. No schedule is configured.
- No scheduler configuration is active yet. Vercel documents daily schedule behavior on Hobby and no automatic retry after a failed invocation; choose deployment frequency only after source access and runtime limits are confirmed. See [Vercel Cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs).
- The TCDB calendar upload/import is gated pending written permission. The Sports Collector Digest admin fetch and protected cron handler also require source permission; cron additionally requires its automation flag. Neither source is scheduled or enabled in this checkout.
- Candidate evidence is durably attached using the supported JSON column, though it is not yet a dedicated typed table. Sponsor claims remain unverified and incoming records stay pending until approval. The admin pending queue displays both source evidence and a link to any possible duplicate. Repeated records with the same provider/source ID and content hash are idempotently skipped.
- Sponsor-claim updates on already-existing approved events, ingestion run history, last-verified timestamps, durable ingestion-failure tracking, and coverage metrics require confirmed database objects or migrations. The former `scrape_log` endpoint is disabled and reports that run history is unavailable; no ingestion path writes to an unconfirmed log table.
- The live schema remains unavailable for this task (see read-only access attempt above). Do not add guessed columns or claim freshness metrics, run-history dashboards, or DB-level uniqueness until the authoritative schema is obtained.
- `npx tsc --noEmit` now reports 12 remaining diagnostics, all in schema-dependent sponsorship views, profile fields, event reviews, and analytics queries; none are in the shared ingestion adapters, normalized event mapper, or the updated event submit/scraper endpoints. The unsupported scrape-log endpoint now returns a guarded `503` instead of querying an unconfirmed table. `git diff --check` passes. No tests were run.
