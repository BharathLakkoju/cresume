import type { Metadata } from "next";

import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "ATS Resume Checker Guide",
  description:
    "Learn how ATS systems evaluate resumes, which resume signals matter most, and how to improve resume-to-job alignment without keyword stuffing.",
  path: "/blog/ats-resume-checker-guide",
  type: "article",
  keywords: [
    "ATS resume checker guide",
    "how ATS scans resumes",
    "resume keyword stuffing",
    "resume ATS optimization tips",
  ],
});

const sections = [
  {
    title: "What real ATS scoring looks for",
    body: "Modern screeners combine keyword coverage with title relevance, experience depth, formatting clarity, and whether project bullets prove impact. A resume with the right terms but weak evidence still gets filtered out.",
  },
  {
    title: "Why generic keyword tools underperform",
    body: "Pure keyword counters miss context. If a JD asks for backend ownership, REST APIs, and production systems, simply repeating isolated terms is weaker than showing delivery scope, measurable outcomes, and stack fit inside experience bullets.",
  },
  {
    title: "How to improve ATS alignment fast",
    body: "Start with the top missing keywords, then rewrite the most relevant experience bullets using measurable impact, ownership, and the same role language that appears in the job description. Keep formatting clean and section headings standard.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "ATS resume checker guide: how to score higher without stuffing keywords",
  description:
    "Learn how ATS systems evaluate resumes, what signals matter most, and how to improve resume-to-job alignment without keyword stuffing.",
  author: {
    "@type": "Organization",
    name: "atsprecise",
  },
  publisher: {
    "@type": "Organization",
    name: "atsprecise",
  },
  mainEntityOfPage: absoluteUrl("/blog/ats-resume-checker-guide"),
  datePublished: "2026-04-10",
  dateModified: "2026-04-10",
};

export default function BlogGuidePage() {
  return (
    <main className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <article className="container max-w-4xl">
        <p className="label-sm text-muted-foreground">Blog</p>
        <h1 className="mt-4 text-balance font-display text-5xl font-bold tracking-tight text-foreground">
          ATS resume checker guide: how to score higher without stuffing
          keywords
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          atsprecise is built around one principle: strong hiring alignment
          comes from relevance and evidence, not gimmicks. Use this guide to
          understand the same signals the evaluator surfaces in the product.
        </p>
        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-surface-lowest p-8 shadow-ambient"
            >
              <h2 className="font-display text-3xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
