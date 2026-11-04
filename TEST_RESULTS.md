# KLLCTRS Test Results — 2026-11-04

## ⚠️ Important: scope of what was actually run

This environment has **no browser-automation tooling** (no Claude-in-Chrome
extension and no desktop browser pane are connected to the session). Because of
that, the interactive, click-by-click, and **screen-recording** tests described
in the testing prompt **could not be executed**, and **no GIFs/videos were
produced**. Nothing below is fabricated — items that require a real browser are
marked **Not executed**.

What *was* executed: an **HTTP route smoke test** against the running dev server
(`http://localhost:3000`) — it verifies each route boots, returns the expected
status, and renders without a 500. It cannot click buttons, submit forms, upload
files, read the clipboard, check colors/fonts, or run client-side JS.

---

## Summary

| Area | Executed via | Passed | Failed | Not executed | Notes |
|------|--------------|--------|--------|--------------|-------|
| Homepage & nav | HTTP smoke | 1 (route 200) | 0 | visual/click/responsive | Renders; interaction not testable here |
| Signup | HTTP smoke | 1 (route 200) | 0 | form submit/validation | Needs browser |
| Login | HTTP smoke | 1 (route 200) | 0 | credentials/redirect/menu | Needs browser |
| Password reset | HTTP smoke | 2 (both pages 200) | 0 | submit flow | Pages load |
| Profile | HTTP smoke | — | — | all (auth) | 200 to curl; guard resolves client-side — see findings |
| Events | HTTP smoke | 1 (route 200) | 0 | cards/detail/search/map | Needs browser |
| Cards/Trading | — | — | — | all | No dedicated cards route found — see findings |
| Chatbot | — | — | — | all | Needs browser (streaming UI) |
| Content Studio | HTTP smoke | 1 (guarded 307) | 0 | all 4 tabs | Moved under /admin — see findings |
| Admin Reports | HTTP smoke | 1 (guarded 307) | 0 | stats/charts/download | Needs admin login + migration |
| Admin Nav | HTTP smoke | 1 (guarded 307) | 0 | per-item CRUD | Needs admin login |
| Responsive | — | — | — | all | Needs browser viewport control |
| External links | static (prior audit) | — | — | click-through | Covered in LINK_AUDIT_REPORT.md |

---

## ✅ HTTP route smoke test (actually executed)

Dev server started with `npm run dev`; each route requested with `curl` (no JS).

| Route | Status | Result |
|-------|--------|--------|
| `/` | 200 | ✅ renders |
| `/login` | 200 | ✅ renders (auth UI) |
| `/auth/login` | 200 | ✅ renders |
| `/auth/signup` | 200 | ⚠️ 200 to curl (redirect to `?mode=signup` resolves client-side) |
| `/auth/reset-password` | 200 | ✅ renders |
| `/auth/update-password` | 200 | ✅ renders |
| `/maps` | 200 | ✅ |
| `/events` | 200 | ✅ |
| `/shops` | 200 | ✅ |
| `/sponsors` | 200 | ✅ |
| `/brands` | 200 | ✅ |
| `/blog` | 200 | ✅ |
| `/videos` | 200 | ✅ |
| `/pricing` | 200 | ✅ |
| `/privacy` | 200 | ✅ |
| `/terms` | 200 | ✅ |
| `/profile` | 200 | ⚠️ served to cookie-less curl — see findings |
| `/admin` | 307 → `/login?redirect=/admin` | ✅ guard works |
| `/admin/reports` | 307 → `/login?redirect=/admin/reports` | ✅ guard works |
| `/admin/content-studio` | 307 → `/login?...` | ✅ guard works |
| `/admin/content-studio/studio` | 307 → `/login?...` | ✅ guard works (Prompt Studio) |
| `/content-studio` | 404 | ✅ expected — moved to `/admin/content-studio/studio` |
| `/xyz123-nonexistent` | 404 | ✅ 404 page works |

**No route returned a 500.** All public pages render; all `/admin/*` routes
correctly redirect unauthenticated requests to login.

---

## 🔎 Findings & things to verify in a real browser

1. **`/profile` returned `200` to a cookie-less request** (served the Profile
   page HTML, not a redirect). The page *does* call
   `redirect("/login?redirect=/profile")` when there's no user, but in Next 16 a
   **page-level** `redirect()` can resolve in the client RSC runtime, so `curl`
   (which runs no JS) sees a streamed `200`. **Verify in a browser** that an
   unauthenticated visit to `/profile` actually lands on `/login`. (The
   layout-level admin guard *did* produce a hard `307`, so that path is
   confirmed.) If browser testing shows the profile page content flashing before
   redirect, consider moving the check into a layout or middleware.
2. **`/auth/signup`** likewise returns `200` to curl; its `redirect()` to
   `/auth/login?mode=signup` should be confirmed in a browser.
3. **No dedicated "cards / collection / trading" route exists** (Test 7). The
   card features present are **card valuation** (`/api/cards/valuate`) and
   eBay comps (`/api/cards/ebay-comps`) — API-only, surfaced inside other UI,
   not a standalone collection page. Confirm with Leo whether a cards page is
   expected for handover.
4. **Content Studio moved**: the testing prompt points to `/content-studio`
   (now 404). The current location is **`/admin/content-studio/studio`**
   (admin-gated), per the earlier task. Re-run Test 9 there once logged in.
5. **Admin Reports** needs the analytics migration
   (`supabase/migrations/20261104000001_analytics_events.sql`) run; otherwise the
   page shows a "run the migration" banner (verified it compiles/guards; the
   banner path was not exercised in-browser).

---

## ❌ Not executed (require browser automation — unavailable here)

All of the following need interactive Chrome control + recording, which this
session cannot do:
- Clicking nav/footer/social links and visually confirming destinations
- Signup/login/reset **form submission**, validation errors, redirects, user menu
- Profile **edit/save**, avatar **upload**
- Events list → detail clicks, search/filter, map embed
- **Chatbot** send/stream/history
- Content Studio **all 4 tabs** (search, copy, PNG download, prompt copy, colors/fonts)
- Admin Reports **charts/download**, per-item admin CRUD
- **Responsive** breakpoints, network throttling
- **Visual** checks (navy `#151E3C`, amethyst `#8B5CF6`, cream, Space Grotesk/Inter)
- All **screen recordings**

To run these, open the project in an environment with the **Claude-in-Chrome
extension** or the **Claude desktop app** browser pane, or test manually.

---

## ⚠️ Needs Leo's input (carried over from the audit)
- Real social-media handles (none linked) and an owner/support email.
- Confirm `kllctrs.com` is the Resend sending domain (verification pending).
- Whether a standalone **cards/collection** page is expected.
- Set `REPORT_EMAIL` + `SMTP_*` (+ install `nodemailer`) to enable the weekly email.

## 📹 Recordings
**None produced** — screen recording requires browser automation, which is not
available in this environment.

| # | Name | File | Status |
|---|------|------|--------|
| 01–13 | (all sections) | — | Not captured — no browser automation |
