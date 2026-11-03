import type { Metadata } from "next";
import HomePageSections from "@/page-components/HomePage/pages";
import { HomePageLoadingGate } from "./HomePageLoadingGate";

export const metadata: Metadata = {
  title: { absolute: "The AI-Powered Trading Card Industry Hub | KLLCTRS" },
  description:
    "KLLCTRS is the AI-powered hub for the trading card hobby — discover card shows, hobby shops, sponsor brands, and industry insights in one place.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The AI-Powered Trading Card Industry Hub | KLLCTRS",
    description:
      "Discover card shows, hobby shops, sponsor brands, and AI-powered industry insights.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI-Powered Trading Card Industry Hub | KLLCTRS",
    description:
      "Discover card shows, hobby shops, sponsor brands, and AI-powered industry insights.",
  },
};

export default function Page() {
  return (
    <HomePageLoadingGate>
      <HomePageSections />
    </HomePageLoadingGate>
  );
}
