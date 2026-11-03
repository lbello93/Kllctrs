import type { NextConfig } from "next";

// Derive the Supabase image host from the env var instead of hardcoding a
// project ref, falling back to the wildcard when the URL is unavailable.
const supabaseImageHostname = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).hostname : "**.supabase.co";
  } catch {
    return "**.supabase.co";
  }
})();

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "10.68.152.64",
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  // Next.js 16 removed the `eslint` config key and build-time linting.
  // Linting runs separately via `npm run lint` (eslint).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseImageHostname,
      },
      {
        protocol: "https",
        hostname: "**.ebay.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/login?mode=signup",
        permanent: false,
      },
      {
        source: "/verify-email",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js injects inline bootstrap scripts; Google Maps loads from
              // its own origins. A nonce-based policy would need middleware.
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://maps.googleapis.com https://*.googleapis.com",
              "frame-src 'self' https://*.google.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
