import type { Metadata } from "next";

import { RoleGuidesSection } from "@/components/site/role-guides-section";
import { roleGuidesHubPath } from "@/lib/role-pages";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Role-Specific ATS Resume Checker Guides",
  description:
    "Browse role-specific ATS resume checker and resume keyword scanner guides for software engineers, product managers, data analysts, and customer success managers.",
  path: roleGuidesHubPath,
  keywords: [
    "ATS resume checker for software engineers",
    "resume keyword scanner for product managers",
    "data analyst resume checker",
    "customer success manager resume keywords",
  ],
});

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Role-Specific ATS Resume Checker Guides",
  description:
    "Role-specific ATS resume checker and resume keyword scanner guides for modern job seekers.",
  url: absoluteUrl(roleGuidesHubPath),
};

export default function ResumeCheckerForPage() {
  return (
    <main className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <RoleGuidesSection
        title="Role-specific ATS resume checker guides"
        description="These landing pages are written for different hiring funnels, not generic resume advice. Use them to understand which signals, keywords, and proof points matter most for your target function before you tailor a resume."
        className="py-0"
      />
    </main>
  );
}
