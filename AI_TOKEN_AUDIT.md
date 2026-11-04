# KLLCTRS — AI Token Audit

_Inventory of every AI model call in `src/`, with current settings and token-reduction recommendations._
_Costs are **approximate** — verify against current Anthropic / Google pricing before relying on them._

## TL;DR

- The platform uses **two providers**: **Google Gemini** (`gemini-3.6-flash`) for the chatbot, blog, content engine, and card valuation; and **Anthropic Claude** for the two Content Studio tools.
- The **chatbot is Gemini Flash, not Claude** (Part 2C premise corrected) — already a cheap model, but it has **no output cap** and sends more history than needed.
- **Event scraping is NOT AI** (Part 2A premise corrected) — it's `cheerio`/TCDB HTML parsing under `src/lib/tcdb/*`. No tokens are spent scraping events. (AI touches events only via the Gemini blog/content generators.)
- The **most expensive call** is the admin Content Studio generator: **Sonnet, `max_tokens: 8000`, up to 3 continuations + web searches**.
- Post/Image/Video generation in the **new Prompt Studio is already 0-token** (client-side templates) ✅ — matches Part 2 goals. Only its **Research** tab hits the API.

---

## Inventory

| # | File | Provider · Model | max_tokens | Caching | Notes |
|---|------|------------------|-----------|---------|-------|
| 1 | `src/app/api/content-studio/search/route.ts` | Claude · `claude-sonnet-5-5` | 2000 | ❌ | Prompt Studio research + web search (admin). **Changed to Haiku, 1200 — see below.** |
| 2 | `src/AI integration/admin/content-studio/generate.ts` | Claude · `claude-sonnet-5-5` | **8000** (+3 continuations, web searches) | ❌ | Classic Content Studio generator. **Most expensive call.** |
| 3 | `src/AI integration/admin/content-studio-generate.ts` | Claude · `claude-haiku-4-5` | 3000 | ❌ | Already Haiku ✅. **Appears to be an older/alternate file — verify if still used** (possible dead code). |
| 4 | `src/AI integration/chat-handler.ts` | Gemini · `gemini-3.6-flash` | **none** | ❌ | **Chatbot.** No output cap; sends full thread. |
| 5 | `src/lib/content/generate.ts` | Gemini · `gemini-3.6-flash` | none observed | ❌ | Content Engine (blog/linkedin/trend drafts). Long output is intentional. |
| 6 | `src/AI integration/admin/blog/generate-news.ts` | Gemini · `gemini-3.6-flash` | none | ❌ | Blog news generation (2 calls: lookup + writing). |
| 7 | `src/AI integration/admin/blog/generate.ts` | Gemini · `gemini-3.6-flash` | none | ❌ | Blog generation. |
| 8 | `src/AI integration/admin/blog/social.ts` | Gemini · `gemini-3.6-flash` | none | ❌ | Social copy from a blog post. |
| 9 | `src/app/api/cards/valuate/route.ts` | Gemini · `gemini-2.5-flash` (REST) | none (`generationConfig` not set) | ❌ | Card valuation. |
| — | `src/AI integration/config.ts` | `GEMINI_MODEL = "gemini-3.6-flash"` | — | — | Shared Gemini default (chat + content). |

---

## Recommendations (by call)

**#1 Prompt Studio research — ✅ applied now**
Switched `claude-sonnet-5-5` → `claude-haiku-4-5-20251001`, `max_tokens` 2000 → **1200** (JSON response is small). _Caching still recommended:_ a `content_research` table keyed by `(topic, contentType)` with a 7-day TTL so repeat topics cost 0 tokens. (Deferred — needs a DB table; see checkpoint.)

**#2 Classic generator (most expensive)**
This is a quality-sensitive, owner-facing generator. Rather than silently downgrade:
- Keep Sonnet for "deep" generation, **add a Haiku "quick draft" mode** the admin can pick.
- Lower the default `max_tokens` from 8000 (most drafts don't need it) and keep the existing continuation cap.
- Enable **prompt caching** on the large system/skill prompt (it's reused every call) to cut input tokens.
- This is a behavior change → **owner decision** (see checkpoint), not applied yet.

**#3 Alternate Haiku generator** — confirm whether it's still imported anywhere; if not, delete it (dead code).

**#4 Chatbot** — add `generationConfig: { maxOutputTokens: 500 }`, send **only the last ~5 messages**, and add an FAQ short-circuit (a `faq` table checked before calling the model). Behavior change → owner decision.

**#5–#8 Content/Blog generators** — these intentionally produce long-form output; **do not cap aggressively** or drafts will truncate. Add a generous `maxOutputTokens` safety ceiling only (e.g. 4–8k) to prevent runaway.

**#9 Card valuation** — add `generationConfig.maxOutputTokens` (~512) — valuation output is small.

---

## Rough monthly cost @ 1000 calls/call-site

> Ballpark only. Haiku ≈ $1 in / $5 out per Mtok; Sonnet ≈ $3 in / $15 out per Mtok; Gemini Flash ≈ $0.10 in / $0.40 out per Mtok (verify current pricing).

| Call | Model | ~tokens/call (in+out) | Est. / 1000 calls |
|------|-------|----------------------|-------------------|
| Research (#1, before) | Sonnet | ~2k in / 1.5k out | ~$28 |
| Research (#1, **after Haiku**) | Haiku | ~2k in / 1k out | ~$7 |
| Classic generator (#2) | Sonnet | ~4k in / 6k out (+web) | ~$100+ |
| Chatbot (#4) | Gemini Flash | ~2k in / 0.5k out | ~$0.40 |
| Blog/content (#5–#8) | Gemini Flash | ~3k in / 3k out | ~$1.50 |
| Card valuation (#9) | Gemini Flash | ~1.5k in / 0.5k out | ~$0.35 |

**Takeaways:** the Gemini-backed features are already very cheap; the cost center is the **Claude Content Studio generator (#2)** and, to a lesser extent, research (#1, now reduced). The biggest savings come from (a) the Haiku switch on #1 ✅, (b) prompt caching + an optional Haiku mode on #2, and (c) research caching.

---

## Applied in this pass
- ✅ #1 research route → Haiku + `max_tokens: 1200`.

## Deferred (need owner decision / DB changes — see handover checkpoint)
- Research caching table, #2 model/caching strategy, chatbot cap + FAQ, Gemini output ceilings.
