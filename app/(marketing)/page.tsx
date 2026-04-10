import type { Metadata } from "next";
import { CtaSection } from "@/components/site/cta-section";
import { faqs, FaqSection } from "@/components/site/faq-section";
import { FeaturesSection } from "@/components/site/features-section";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorksSection } from "@/components/site/how-it-works-section";
import { PricingSection } from "@/components/site/pricing-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { absoluteUrl, createMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "AI ATS Resume Checker, Resume Scanner and Resume Optimization Tool",
  description:
    "Use atsprecise to check ATS resume compatibility, find missing keywords, improve resume structure, and tailor your resume to real job descriptions.",
  path: "/",
  keywords: [
    "ATS resume checker online",
    "resume scanner",
    "resume checker for job description",
    "AI resume optimization tool",
    "resume keyword match",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: absoluteUrl("/"),
  description: siteConfig.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
