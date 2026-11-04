# KLLCTRS — Link & Button Audit

_Generated during the production-handover audit. Scope: every `src/` file._
_Method: static scan of `<Link href>`, `<a href>`, `router.push()`, `redirect()`, `mailto:`/`tel:`, and external URLs, cross-checked against the App Router page list (`src/app/**/page.tsx`) and API routes (`src/app/api/**/route.ts`)._

## Summary

- **Internal routes: healthy.** Every internal `href` / `router.push` / `redirect` target maps to an existing page. No dead internal routes found.
- **Auth redirects: correct.** Gated actions redirect to `/login?redirect=<path>`; `/profile`, `/admin`, `/shops/submit` etc. redirect unauthenticated users correctly (`src/lib/auth/admin.ts`, `src/app/profile/page.tsx`).
- **Main issue: domain inconsistency** — the canonical domain is `kllctrs.com` (metadata, sitemap, robots, Resend sender), but a few places still use the old `kllctbls.com`. **Fixed** (see below).
- **No real social media accounts are linked** anywhere (header/footer). Only share-intent links and admin "open platform" helpers exist. **Needs owner input.**
- **No personal/developer emails** are hardcoded. Contact emails are role addresses on the brand domain.

---

## ✅ Working Links (representative — all verified against the router)

| Area | File | Link/Button | Destination | Status |
|------|------|-------------|-------------|--------|
| Navbar | `src/page-components/navbar/Navbar.tsx` | Home / Pricing / Login / Admin | `/`, `/pricing`, `/login`, `/admin` | ✅ pages exist |
| Home CTAs | `src/page-components/HomePage/homecomponent/*` | Get started / Explore | `/login?mode=signup`, `/maps`, `/shops/submit` | ✅ |
| Events | `src/components/maps/cards/EventCard.tsx` | Event card | `/maps/events/[slug]` | ✅ page exists |
| Shops | `src/components/maps/cards/ShopCard.tsx` | Shop card | `/maps/shops/[slug]` | ✅ page exists |
| Sponsors | `src/page-components/sponsor-intel/SponsorsListClient.tsx` | Compare / detail | `/sponsors/compare`, `/sponsors/[id]` | ✅ |
| Redirects | `src/app/events/[slug]/page.tsx`, `src/app/shops/[id]/page.tsx` | legacy → canonical | `/maps/events/[slug]`, `/maps/shops/[slug]` | ✅ intentional |
| Share | `src/components/events/detail/ShareButtons.tsx` | X / Facebook share | twitter/facebook intent URLs | ✅ valid intents |
| External | `src/page-components/BrandsPage/MonthlyCollectorEvents.tsx` | Organizer/venue sites | real event URLs | ✅ resolve |
| Maps | `src/app/maps/shops/[slug]/page.tsx` | "Directions" | `google.com/maps/search/?api=1&query=<lat>,<lng>` | ✅ correct format |
| Tools | `src/app/admin/content-studio/studio/components/video-panel.tsx` | "Open Claude" | `https://claude.ai/new` | ✅ intentional |

> Full internal-route set referenced in code — all present as pages:
> `/`, `/maps`, `/maps/events/[slug]`, `/maps/shops/[slug]`, `/events`, `/shops`, `/shops/submit`,
> `/sponsors`, `/sponsors/[id]`, `/sponsors/compare`, `/sponsors/submit`, `/brands`, `/brands/[slug]`,
> `/blog`, `/blog/[slug]`, `/videos`, `/pricing`, `/login`, `/profile`, `/privacy`, `/terms`,
> `/admin` and all `/admin/*` sections.

---

## ❌ Broken / Placeholder Links

| File | Line | Link/Button | Issue | Fix |
|------|------|-------------|-------|-----|
| `src/lib/mailerlite.ts` | 54 | Event link in marketing email | Points to **`kllctbls.com`** (wrong domain) — email recipients would hit the wrong/old domain | ✅ **Fixed** → `kllctrs.com` |
| `src/app/terms/page.tsx` | 198 | `mailto:legal@kllctbls.com` | Wrong domain | ✅ **Fixed** → `legal@kllctrs.com` |
| `src/app/privacy/page.tsx` | 176 | `mailto:privacy@kllctbls.com` | Wrong domain | ✅ **Fixed** → `privacy@kllctrs.com` |

> No broken **internal** routes were found.

---

## ⚠️ Developer / Placeholder Links & Owner Decisions

| File | Line | Current | Should Be |
|------|------|---------|-----------|
| `package.json` | 2 | `"name": "kllctbls"` | Cosmetic only (not shipped). Optionally rename to `kllctrs`. Left as-is. |
| `src/app/terms/page.tsx`, `src/app/privacy/page.tsx` | — | `legal@` / `privacy@kllctrs.com` (after fix) | Confirm these inboxes exist / forward to **Leo** — `TODO: OWNER_EMAIL` |
| `src/lib/email/resend.ts` | 11 | `from: "KLLCTRS <onboarding@kllctrs.com>"` | Confirm `kllctrs.com` sending domain is **verified** in Resend (per `src/app/README.md` it still "needs confirmation") |
| Header / Footer | — | **No social profile links exist** | Add real KLLCTRS Instagram / X / TikTok / YouTube accounts, or confirm none should be shown — `TODO: SOCIAL_HANDLES` |
| `src/page-components/AdminPage/AdminBlogEditClient.tsx` | 261, 267 | `instagram.com/`, `linkedin.com/feed/` | Admin "open the platform to paste a post" helpers — generic by design. Acceptable; optionally deep-link to the KLLCTRS business account. |

### Owner contact — action required
There is no single "owner/support" contact in the UI. Before handover, confirm with Leo:
- **Support email** (for a Contact/Support link — currently absent).
- Whether `legal@` and `privacy@kllctrs.com` are live inboxes.
- Real **social handles** to wire into the header/footer.

Replace each `TODO:` above once Leo provides the values.
