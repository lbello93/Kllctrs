import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "10.68.152.64",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint ignore during builds is now handled via CLI flag, not next.config
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
};

export default nextConfig;