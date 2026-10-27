"use client";

import HeroSection from "../components/LandingPage/HeroSection";
import AboutSection from "../components/LandingPage/AboutSection";
import ExploreSection from "../components/LandingPage/ExploreSection";
import ShopShowcase from "../components/LandingPage/ShopShowcase";
import AppraiseToolShowcase from "../components/LandingPage/AppraiseToolShowcase";

import CTASection from "../components/LandingPage/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f3fb] overflow-hidden">
      <HeroSection />
      <AboutSection />
      <ExploreSection />
      <ShopShowcase />
      <AppraiseToolShowcase />
      <CTASection />
    </div>
  );
}
