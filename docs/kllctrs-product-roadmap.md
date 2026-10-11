# Kllctrs Product and Engineering Roadmap

## Product direction

Kllctrs helps collectors discover trustworthy events, shops, brands, and hobby information. Its data system should keep those records current; its assistant should answer from those records; its content system should turn verified information into channel-appropriate drafts.

Initial scope assumption: US trading-card events, with data structures that can expand to other collectible categories.

## Existing foundation and constraints

- Next.js App Router, TypeScript, Supabase, admin pages, and a collector-facing website are already present.
- Event import and scraping code exists, but it is split across source-specific routes and scripts. There is no tracked Supabase migration directory in the current checkout.
- Event intake, sponsor scanning, and blog generation exist in partial form. Some API routes are empty, and the existing type definitions disagree with code that queries the database.
- The chat route already uses Gemini function calling for event, shop, sponsor, and eBay searches. It has an in-memory rate limit, basic history context, and stores tool-source metadata.
- The current blog generator creates one event-focused draft. There is no multi-channel editorial calendar or social publishing workflow.

These constraints make a durable schema and reliable data provenance the first dependency. New features should not add more assumptions to the existing database types.

## Shared information foundation

Every user-facing event, brand, sponsor, and generated claim should be traceable to evidence.

Recommended records:

- `events`: canonical event fields, category, status, last verified time, and stable identity.
- `event_sources`: provider, source URL, source record ID, retrieval time, raw snapshot reference, and extraction version.
- `event_evidence`: field-level evidence such as source text, URL, observed time, and confidence; sponsor claims need explicit evidence.
- `brands`: canonical company identity, aliases, categories, official links, and verification status.
- `event_brand_relationships`: event, brand, relationship type (sponsor, exhibitor, guest, or mentioned), evidence, confidence, and review status.
- `ingestion_runs`: source, start/end time, counts, errors, and run status for operations and coverage reporting.
- `content_drafts`: channel, format, source records, claims, generated text, asset brief, review status, scheduled time, and published post ID.

Use Supabase migrations as the source of truth and regenerate TypeScript database types from those migrations. Preserve raw source snapshots or normalized excerpts so an admin can resolve extraction mistakes.

## Event and sponsor automation

1. Add source adapters behind one interface: discover records, fetch details, and return normalized candidates with provenance.
2. Run discovery, retrieval, extraction, normalization, validation, deduplication, and queueing as scheduled jobs without a person operating each run. Keep a person only for reviewing/approving new records, conflicts, and uncertain evidence before public visibility.
3. Store observations before publishing them. Do not let extraction overwrite an approved field without comparison and review rules.
4. Normalize dates, state codes, venue addresses, categories, and organizer identities.
5. Deduplicate first by provider ID, then by normalized name/date/location, with a review queue for uncertain matches.
6. Validate required facts and mark incomplete records; geocode only after address checks.
7. Recheck upcoming events on a schedule and detect cancellations, date/location changes, and stale pages.
8. Keep sponsor relationships distinct from product categories and incidental mentions. Require evidence for sponsor claims.
9. Provide an admin queue for new, conflicting, low-confidence, stale, and failed records, with approve/reject actions. Editing should be limited to resolving a reviewed item.
10. Show source coverage, field completeness, duplicate rate, stale-event rate, review backlog, and ingestion failures by state and provider.

Start with a small set of dependable sources and measure geographic coverage before increasing source count. Respect source terms, rate limits, and robots/access requirements; prefer official calendars, organizer submissions, and licensed feeds where possible.

## Content engine

### Inputs and outputs

Start generation from an approved event, verified brand profile, source-backed trend, or editorial brief. Produce separate drafts for:

- LinkedIn: organizer and sponsor partnerships, business/community impact, market or hobby insights, platform milestones, and event recaps.
- Instagram: event spotlights, collector tips, short captions, carousel outlines, story sequences, and visual briefs.
- Website: SEO event guides, local roundups, interviews, and evergreen collector education.
- Later channels: newsletter, short-form video scripts, and other platforms after their workflows and audience goals are defined.

Each draft should carry its source records and factual claims, channel, audience, objective, voice, CTA, required image/video brief, alt text, hashtags where appropriate, and review status. The generator should mark unsupported details as unknown rather than fill gaps creatively.

### Editorial workflow

`idea -> brief -> generated draft -> human edit/approval -> scheduled -> published -> performance review`

Keep generation separate from publishing. Start with drafts and copy/export. Add platform connections only after account ownership, OAuth, app permissions, and publishing requirements are confirmed. Keep a human approval step before publishing.

### Quality checks

- Check all factual claims against approved records and evidence.
- Flag stale event dates, missing links, unverifiable sponsor mentions, unsupported superlatives, and duplicate copy.
- Validate channel-specific length, CTA, link, accessibility, and brand-voice requirements.
- Track edit distance, approval/rejection reason, time-to-approve, and performance by format and objective.

## Collector chatbot

The assistant should be a reliable guide into Kllctrs data, not only a general hobby chatbot.

- Add intent-aware tools for event search, event details, nearby events, shops, sponsor/brand profiles, saved items, and alerts. Keep valuation tools clearly separated and label their data freshness.
- Define typed input/output schemas and validate tool arguments/results. Return source URLs, freshness timestamps, and result counts with factual answers.
- Improve event filters: date range, category, distance, virtual/in-person, approved status, and location inferred only when available from the user or profile.
- Answer from approved database records for live facts. Say when data is missing or stale; never infer a sponsor relationship from a brand mention.
- Add session-level preferences and explicit profile-based personalization with user controls. Do not rely on process memory for production rate limits or conversation state.
- Add abuse/cost controls, timeouts, tool allowlists, prompt-injection defenses for scraped content, and data minimization for stored conversations.
- Create an evaluation set for event search, location/date filtering, source attribution, no-result behavior, sponsor evidence, educational questions, and adversarial/untrusted page text. Track answer correctness, tool selection, citation coverage, latency, and cost.
- Add feedback controls and a review path for failed answers. Use failures to improve data, tools, prompts, and evaluations before considering fine-tuning.

## Website and platform improvement backlog

### Discovery and trust

- Improve filters, map/list switching, near-me search, date ranges, category selection, and state/city landing pages.
- Show source, last-verified date, organizer link, cancellation/update status, and a clear correction/report action on event pages.
- Add saved searches, reminders, event-change notifications, and calendar export.
- Improve empty, loading, error, and mobile states; make map content usable without relying on the map alone.
- Add structured SEO metadata, canonical URLs, event structured data, fast image loading, and accessible headings/forms.

### Collectors and organizers

- Make onboarding, profiles, preferences, saved events/shops, and alerts consistent and easy to manage.
- Give organizers a verified claim/edit workflow and a way to submit event updates with evidence.
- Add moderation queues, duplicate suggestions, correction history, and admin audit logs.

### Sponsors and business development

- Build searchable, canonical brand/company profiles and distinguish sponsor, exhibitor, partner, and category relationships.
- Add organizer and sponsor leads, contact provenance, event history, and opt-in partnership inquiry workflows.
- Provide sponsor discovery reports only from verified event relationships.

### Reliability, security, and operations

- Repair TypeScript/database schema drift and add migrations before expanding database-facing features.
- Replace per-process rate limiting with a shared store and add request/cost observability.
- Add structured logs, job retries, idempotency, alerting, and dashboards for ingestion and AI failures.
- Centralize secrets server-side, validate environment configuration, protect admin actions, and review row-level security policies.
- Add automated checks for type errors, lint, route behavior, migrations, and critical data pipelines once the current baseline is repaired.

## Suggested delivery sequence

### Phase 0: Stabilize the foundation

- Reconcile the live Supabase schema, migrations, generated types, and application queries.
- Fix current compile blockers and empty or missing routes that are part of active features.
- Establish data ownership, source evidence, and review-status conventions.

### Phase 1: Trusted event coverage

- Use one shared ingestion contract across authorized sources; keep writes pending approval and deduplicate using normalized event identity. Do not automate a source until its access terms or written permission allow it.
- Store source evidence in the supported `events.social_links` JSON field and surface it in the pending review queue. Add persistent run logs, freshness tracking, a conflict queue, and coverage metrics after their database schema is confirmed.
- Connect and evaluate a limited set of event sources; broaden only when quality and coverage are measured.
- Operating model: automated scheduled collection and processing; human review is only an approval gate for public visibility and an exception path for conflicts or uncertain evidence.

### Phase 2: Sponsor and brand intelligence

- Add canonical brands and evidence-backed event relationships; backfill only claims that can be verified.

### Phase 3: Editorial content studio

- Add multi-channel draft generation from approved data, claims/source tracking, templates, review queue, and calendar.
- Begin with LinkedIn and Instagram drafts; connect publishing APIs after access is confirmed.

### Phase 4: Collector assistant

- Repair and type the existing tool flow, add source/freshness responses and filters, then evaluate against a benchmark before broad rollout.

### Phase 5: Growth and optimization

- Add audience analytics, personalized discovery, organizer/sponsor workflows, and performance-informed content iteration.

## Initial success measures

- Event coverage by state and category; percentage of events with a verifiable source and required fields.
- Duplicate, stale, cancellation-detection, and correction rates.
- Sponsor relationship evidence coverage and review overturn rate.
- Chat answer correctness, source coverage, successful search rate, latency, and cost per answer.
- Content approval rate, factual correction rate, time to approve, publishing cadence, and engagement by channel/objective.
