import type { NextConfig } from "next";

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
  // Run: next build --no-lint  (or set in package.json build script)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.ebay.com",
      },
      {
        protocol: "https",
        hostname: "ntowgijfpkkohenxipxf.supabase.co",
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
              "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.supabase.co https://*.ebay.com https://*.googleapis.com https://*.gstatic.com https://*.ggpht.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.googleapis.com",
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
