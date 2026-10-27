# Page components

Reusable UI for pages lives here. Keep Next.js route entry files in `src/app` and import the page UI from this folder.

## Navbar

The responsive desktop and mobile navbar is integrated into the new app layout. Its implementation lives in `navbar/`, with the combined component in `navbar/Navbar.tsx`.

## Pricing page

The pricing page UI lives in `PricingPage/PricingPage.tsx`. The active route is `src/app/pricing/page.tsx`; the navbar and homepage Go Pro links navigate to `/pricing`.

## Content page

The blog UI components live in `BlogPage/`; the server data loader and integration live in `ContentPage/ContentPage.tsx`. Its active route is `src/app/blog/page.tsx`. Blog hero and category images are WebP assets in `public/ContentPage-Artifacts/`.

## Authentication page

The sign-in/sign-up screen and auth logo live in `AuthPage/`. The `/login` route in `src/app` renders that UI; `/login?mode=signup` opens signup. Sign-in, sign-up, and verification resend requests go through `src/app/api/auth`; callback and logout handlers are also under `src/app`.

## Home page

The homepage sections live in `HomePage/homecomponent/` and are assembled by `HomePage/pages.tsx`. All “Join KLLCTRS” buttons link to `/login?mode=signup`; the login page also provides sign-in.

## Brands page

The Brands directory and profile UI live in `BrandsPage/`. The active routes are `/brands` and `/brands/[slug]`; the directory loads brand records and upcoming event summaries from Supabase. Local imagery, including brand logos, is WebP in `public/Brand-artifact/`.

## Maps page

The Maps UI lives in `MapsPage/`, including map, filter, sidebar, and card components. `src/app/maps/page.tsx` loads approved events, shops, and saved IDs; detail routes are `/maps/events/[slug]` and `/maps/shops/[slug]`. Legacy `/events/[slug]` and `/shops/[slug]` URLs redirect to those routes. Hero images are WebP files in `public/Map-Artifact/`.

## Admin page

Admin screens, charts, import forms, and content tools live in `AdminPage/`. Their routes are under `src/app/admin`; JSON handlers are under `src/app/api/admin`. Gemini and Anthropic admin generation handlers are maintained in `src/AI integration/admin/`.

## Profile page

The profile dashboard, editing UI, and full onboarding flow live in `ProfilePage/`. The signed-in route is `src/app/profile/page.tsx`; reusable profile rules and types remain in `src/lib/profile/`. Local profile imagery is WebP in `public/ProfilePage-artifact/`.

## Chat page

The chatbot frontend lives in `ChatPage/` and is mounted from the active app layout. Chat images are WebP files in `public/ChatPage-artifact/`. Server-side Gemini integration, prompts, context builders, and tools live in `src/AI integration/`; the active endpoint stays at `src/app/api/chat/route.ts` and delegates to that logic.
