import CTASection from "@/components/Landing/CTASection";
import FeaturesSection from "@/components/Landing/FeatureSection";
import HeroSection from "@/components/Landing/HeroSection";
import LandingFooter from "@/components/Landing/LandingFooter";
import LandingNav from "@/components/Landing/LandingNav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-editor-bg text-editor-text overflow-x-hidden">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
