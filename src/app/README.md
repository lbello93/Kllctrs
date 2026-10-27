# App routes

This folder contains the active Next.js App Router entry points.

- `page.tsx` loads the homepage from `src/page-components/HomePage`; its “Join KLLCTRS” buttons open `/login?mode=signup`.
- `maps/page.tsx` loads the Maps directory from Supabase; `maps/events/[slug]` and `maps/shops/[slug]` render event and shop details. Legacy `/events/[slug]` and `/shops/[slug]` URLs redirect to the `/maps/...` routes.
- `brands/page.tsx` and `brands/[slug]/page.tsx` render the Brands directory and profiles using `src/page-components/BrandsPage`; imagery is WebP in `public/Brand-artifact/`. Legacy `/sponsors/[slug]` URLs redirect to `/brands/[slug]`.
- `blog/page.tsx` loads the Content Hub from Supabase.
- `profile/page.tsx` is the signed-in account destination and loads UI from `src/page-components/ProfilePage`; local imagery is WebP in `public/ProfilePage-artifact/`.
- The admin dashboard and management screens live under `admin/`; their frontend components are in `src/page-components/AdminPage` and their API routes are in `api/admin/`.
- `login/page.tsx` renders the auth UI from `src/page-components/AuthPage`; `/login?mode=signup` opens account creation and `/login` opens sign-in.
- `(auth)/callback/route.ts` handles Supabase email verification and sign-in callbacks; `auth/logout/route.ts` handles server-side sign-out.
- `api/auth/sign-in`, `api/auth/sign-up`, and `api/auth/resend-verification` handle authentication form requests using the server Supabase client.
- `api/profile/route.ts` handles authenticated profile updates from the onboarding and edit forms.
- `api/chat/route.ts` exposes the chatbot endpoint and delegates server-side Gemini, prompt, context, and tool logic to `src/AI integration`.
- `api/geocode/reverse/route.ts` handles reverse geocoding through Geoapify for profile location setup.
- The global chat frontend lives in `src/page-components/ChatPage` and is mounted by the active root layout. Its WebP images live in `public/ChatPage-artifact`.
- Supabase Auth custom SMTP is enabled for Resend (`smtp.resend.com`, port `465`) with saved credentials. Resend login has no password field: use the Google/GitHub provider used when creating the account, or enter the account email to receive a sign-in link. Check spam if the link does not arrive. The `kllctrs.com` sending-domain verification still needs confirmation in the Resend dashboard; SMTP being configured does not by itself confirm that the sender domain is verified.
- `pricing/page.tsx` loads the pricing page from `src/page-components/PricingPage`.
- `loading.tsx` shows the KLLCTRS loading animation during route loading.

Keep route entry files here and place page UI in `src/page-components`.
