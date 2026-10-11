# KLLCTRS automation output schema

This is the normalized handoff between research, persistence, and the admin review queue. Generate one object per candidate. Keep all dates ISO-8601; event dates use `YYYY-MM-DD`, observation timestamps use UTC.

```json
{
  "job_type": "event_discovery | brand_research | market_news | article | social",
  "review_status": "pending_review | needs_attention",
  "title": "Short human-readable record title",
  "summary": "Collector-facing summary or reason this needs review",
  "facts": [
    {
      "field": "sale_price",
      "value": "$2,000,000 USD",
      "claim_type": "completed_sale | asking_price | estimate | announcement | event_fact | brand_fact | interpretation",
      "source_url": "https://example.com/source",
      "source_title": "Source title",
      "source_published_at": "2026-10-10T00:00:00Z",
      "checked_at": "2026-10-11T00:00:00Z",
      "confidence": "high | medium | low"
    }
  ],
  "record": {},
  "event_calendar": {
    "month": "2026-10",
    "timezone": "America/New_York",
    "directory_checked": true,
    "directory_event_count": 0,
    "directory_events": [
      {
        "name": "Event name",
        "start_date": "2026-10-17",
        "end_date": "2026-10-18",
        "venue": "Venue or null",
        "city": "City",
        "state": "ST",
        "category": "Category or null",
        "official_url": "https://example.com/event",
        "source_urls": ["https://example.com/source"],
        "checked_at": "2026-10-11T00:00:00Z",
        "review_status": "pending_review | needs_attention",
        "attention_reasons": []
      }
    ],
    "additional_candidates": [],
    "sources_searched": [],
    "coverage_note": "Directory checked; external search may not be exhaustive."
  },
  "content_drafts": [
    {
      "format": "article | instagram_caption | instagram_carousel | linkedin_post",
      "title": "Draft title, if applicable",
      "body": "Draft content",
      "source_urls": ["https://example.com/source"]
    }
  ],
  "attention_reasons": []
}
```

## Validation rules

- `job_type` and `review_status` must use the enumerated values above.
- `facts` must contain at least one source-backed claim for any current event, brand update, or market-news item.
- For monthly event discovery, `event_calendar.directory_events` must include every matching KLLCTRS directory event; `additional_candidates` must remain separate and must not be described as approved directory listings.
- A price claim must include a transaction-type label and source. Do not map `asking_price` or `estimate` to `completed_sale`.
- A record with conflicting or low-confidence required facts must use `needs_attention`.
- Article and social drafts are proposals. The application must save them as drafts and require an admin action to publish.
- Treat URLs as data; validate allowed protocols and configured source permissions in application code.
