"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#151E3C] text-[#FEF9FF]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="font-unica-one text-2xl tracking-wide">KLLCTRS</h3>
            <p className="max-w-xs text-sm leading-relaxed text-[#FEF9FF]/70">
              Discover trading card events, shops, and collectors near you. The
              hub for the hobby community.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com/kllctrs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF9FF]/10 transition-colors hover:bg-[#8B5CF6]/30"
                aria-label="Instagram"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com/kllctrs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF9FF]/10 transition-colors hover:bg-[#8B5CF6]/30"
                aria-label="Twitter / X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@kllctrs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF9FF]/10 transition-colors hover:bg-[#8B5CF6]/30"
                aria-label="TikTok"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.18 8.18 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FCD279]">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/maps"
                  className="text-sm text-[#FEF9FF]/70 transition-colors hover:text-[#8B5CF6]"
                >
                  Maps
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-sm text-[#FEF9FF]/70 transition-colors hover:text-[#8B5CF6]"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-[#FEF9FF]/70 transition-colors hover:text-[#8B5CF6]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-[#FEF9FF]/70 transition-colors hover:text-[#8B5CF6]"
                >
                  Go Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FCD279]">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[#FEF9FF]/70 transition-colors hover:text-[#8B5CF6]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[#FEF9FF]/70 transition-colors hover:text-[#8B5CF6]"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FCD279]">
              Stay in the loop
            </h4>
            <p className="text-sm text-[#FEF9FF]/70">
              Get updates on events, drops, and new features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-[#FEF9FF]/20 bg-[#FEF9FF]/10 px-3 py-2.5 text-sm text-[#FEF9FF] transition-colors placeholder:text-[#FEF9FF]/40 focus:border-[#8B5CF6] focus:outline-none"
              />
              <button
                type="button"
                className="whitespace-nowrap rounded-lg bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7729F1]"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#FEF9FF]/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-xs text-[#FEF9FF]/50">
            © {new Date().getFullYear()} KLLCTRS. All rights reserved.
          </p>
          <p className="text-xs text-[#FEF9FF]/50">
            Built for collectors, by collectors.
          </p>
        </div>
      </div>
    </footer>
  );
}
