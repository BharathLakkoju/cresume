import { CtaSection } from "@/components/site/cta-section";
import { FeaturesSection } from "@/components/site/features-section";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorksSection } from "@/components/site/how-it-works-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
