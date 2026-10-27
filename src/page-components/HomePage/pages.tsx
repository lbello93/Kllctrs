import AboutSection from "./homecomponent/AboutSection";
import ContentSection from "./homecomponent/contentSection";
import CTASection from "./homecomponent/CTASection";
import ExploreSection from "./homecomponent/ExploreSection";
import HeroSection from "./homecomponent/HeroSection";
import ShopShowcase from "./homecomponent/ShopShowcase";

export default function HomePageSections() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f3fb]">
      <HeroSection />
      <AboutSection />
      <ExploreSection />
      <ShopShowcase />
      <ContentSection />
      <CTASection />
    </div>
  );
}
