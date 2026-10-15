import "./globals.css";
import type { Metadata } from "next";

import { Navbar } from "../components/layout/navbar/Navbar";
import FooterGate from "@/components/layout/FooterGate";
import ChatWindow from "@/components/chat/ChatWindow";
import CookieBanner from "@/components/layout/CookieBanner";

import { Toaster } from "sonner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { spaceGrotesk, inter, unica } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kllctrs.com"),
  title: "KLLCTRS | Find Card Shows, Shops, and Collector Stories",
  description:
    "Discover trading card shows, local card shops, collecting brands, and stories for collectors across the United States.",
  openGraph: {
    type: "website",
    siteName: "KLLCTRS",
    title: "KLLCTRS | Find Card Shows, Shops, and Collector Stories",
    description:
      "Discover trading card shows, local card shops, collecting brands, and stories for collectors across the United States.",
    url: "https://www.kllctrs.com",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "KLLCTRS — The collector community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KLLCTRS | Find Card Shows, Shops, and Collector Stories",
    description:
      "Discover trading card shows, local card shops, collecting brands, and stories for collectors across the United States.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/Favicon/Group.svg",
    shortcut: "/favicon.ico",
    apple: "/Favicon/Group.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${unica.variable}`}
    >
      <body
        className={`${inter.className} ${spaceGrotesk.variable} ${inter.variable} ${unica.variable}`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <FooterGate />
        </div>

        <ChatWindow />
        <CookieBanner />

        <AnalyticsTracker />

        <Toaster
          position="top-center"
          richColors
          closeButton
          expand
          duration={3000}
          toastOptions={{
            className: "font-inter",
          }}
        />
      </body>
    </html>
  );
}
