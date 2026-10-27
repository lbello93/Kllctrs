# Frontend for Kllctrs platform 

## Current rebuild status

The responsive desktop and mobile navbar is integrated into the new app layout. Its implementation lives in `src/page-components/navbar`.

## Production deployment

This is a Next.js application and can be deployed to a Node.js host or a Next.js
platform such as Vercel. Use Node.js 20.9 or newer, install dependencies from the
lockfile with `npm ci`, then run `npm run build` and `npm run start`.

Copy `.env.example` to `.env.local` for local development. Configure the required
Supabase URL, anon key, and service-role key in the deployment provider before
building. Add optional integration keys only for features that are enabled. Keep
service-role and API keys server-side; only variables prefixed with
`NEXT_PUBLIC_` are exposed to the browser. Do not enable scheduled ingestion
until the source permissions are documented.

The app emits `/robots.txt` and `/sitemap.xml`. After deploying the canonical
HTTPS domain, submit `https://www.kllctrs.com/sitemap.xml` in Google Search
Console and verify the domain there.
