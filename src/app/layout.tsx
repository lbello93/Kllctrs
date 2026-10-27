import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";

import "./globals.css";
import { Navbar } from "@/page-components/navbar/Navbar";
import ChatPage from "@/page-components/ChatPage/ChatPage";
import AnalyticsTracker from "@/page-components/shared/AnalyticsTracker";
import CookieBanner from "@/page-components/shared/CookieBanner";
import { inter, spaceGrotesk, unica } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kllctrs.com"),
  title: {
    default: "KLLCTRS | Discover the hobby near you",
    template: "%s | KLLCTRS",
  },
  description:
    "Find card shows, local shops, brands, and collector communities near you on the KLLCTRS hobby map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${unica.variable}`}
    >
      <body className={inter.className}>
        <Navbar />
        {children}
        <ChatPage />

        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <CookieBanner />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}