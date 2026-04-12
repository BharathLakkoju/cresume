import type { Metadata } from "next";
import Link from "next/link";

import { absoluteUrl, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sample ATS Report — See how atsprecise scores a resume",
  description:
    "Walk through a real atsprecise evaluation: how the overall score is calculated, what the gap analysis shows, and what actionable recommendations look like.",
  path: "/blog/sample-report",
  type: "article",
  keywords: [
    "ATS report example",
    "resume score sample",
    "how atsprecise works",
    "ATS evaluation walkthrough",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sample ATS report: how atsprecise evaluates a resume",
  description:
    "Walk through a real atsprecise evaluation: how the overall score is calculated, what the gap analysis shows, and what actionable recommendations look like.",
  author: { "@type": "Organization", name: "atsprecise" },
  publisher: { "@type": "Organization", name: "atsprecise" },
  mainEntityOfPage: absoluteUrl("/blog/sample-report"),
  datePublished: "2026-04-13",
  dateModified: "2026-04-13",
};

// ─── Static sample data ───────────────────────────────────────────────────────
const sampleBreakdown = [
  { label: "Keyword Match", value: 62 },
  { label: "Semantic Relevance", value: 74 },
  { label: "Skills Alignment", value: 58 },
  { label: "Experience Relevance", value: 81 },
  { label: "Formatting & Readability", value: 90 },
];

const missingKeywords = [
  "TypeScript",
  "CI/CD",
  "system design",
  "observability",
  "distributed systems",
];

const matchedKeywords = [
  "React",
  "Node.js",
  "REST APIs",
  "PostgreSQL",
  "Agile",
  "unit testing",
];

const recommendations = [
  {
    priority: "HIGH",
    title: "Add missing technical keywords in context",
    body: 'The job description explicitly requires TypeScript and CI/CD experience. Add these inside experience bullets that demonstrate real usage — e.g. "Migrated three React services from JavaScript to TypeScript, reducing type-related bugs by 40%."',
  },
  {
    priority: "HIGH",
    title: "Strengthen system-level ownership language",
    body: 'The role demands distributed systems and observability experience. Rewrite at least one bullet to include architecture scope: e.g. "Designed event-driven microservice architecture handling 5M daily events, instrumented with Datadog for p99 latency tracking."',
  },
  {
    priority: "MEDIUM",
    title: "Quantify impact in every experience bullet",
    body: "Three of your five experience bullets describe responsibilities without outcomes. Add a measurable result — percentage improvement, scale handled, time saved, or revenue influenced — to each one.",
  },
  {
    priority: "LOW",
    title: "Align job title in summary to target seniority",
    body: 'The role targets a Senior Software Engineer. Your summary says "Software Engineer". Match title language in the summary to signal seniority alignment from the first line.',
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    detail:
      "Paste or upload a PDF/DOCX. The parser extracts raw text, preserving section structure and bullet semantics.",
  },
  {
    number: "02",
    title: "Paste the job description",
    detail:
      "The AI reads the JD to identify required skills, seniority signals, ownership patterns, and implicit constraints.",
  },
  {
    number: "03",
    title: "Receive the precision report",
    detail:
      "You get an overall score, five sub-dimension scores, a gap analysis, keyword lists, and prioritised rewrite recommendations.",
  },
];

export default function SampleReportPage() {
  return (
    <main className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="container max-w-4xl">
        {/* Header */}
        <p className="label-sm text-muted-foreground">Sample Report</p>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-bold tracking-tight text-foreground">
          How atsprecise evaluates your resume
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A walkthrough of a real evaluation — the score breakdown, gap
          analysis, and the recommendations you receive for a Software Engineer
          applying to a Senior SWE role.
        </p>

        {/* How it works */}
        <section className="mt-16 border-t border-foreground/10">
          <p className="label-sm pt-10 text-muted-foreground">HOW IT WORKS</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Three steps from upload to insight
          </h2>
          <div className="mt-8 grid gap-px border border-foreground/10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="bg-surface-lowest p-8">
                <span className="font-display text-4xl font-black text-foreground/10">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Overall score */}
        <section className="mt-16 border-t border-foreground/10 pt-10">
          <p className="label-sm text-muted-foreground">OVERALL SCORE</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Moderate Fit — 67 / 100
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            The resume has strong formatting and solid experience relevance, but
            is missing several high-signal technical keywords the job
            description explicitly requires. Keyword and skills scores pull the
            overall index below the 70-point threshold that typically clears
            initial screening.
          </p>

          {/* Score breakdown bars */}
          <div className="mt-8 border border-foreground/10">
            <div className="grid grid-cols-[1fr_auto] border-b border-foreground/10 bg-foreground px-6 py-3">
              <span className="label-sm text-white/60">DIMENSION</span>
              <span className="label-sm text-white/60">SCORE</span>
            </div>
            {sampleBreakdown.map((item, i) => (
              <div
                key={item.label}
                className={`grid grid-cols-[1fr_auto] items-center gap-6 px-6 py-5 ${
                  i < sampleBreakdown.length - 1
                    ? "border-b border-foreground/10"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <div className="mt-2 h-1 w-full bg-surface-highest">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
                <span className="font-display text-xl font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Gap analysis */}
        <section className="mt-16 border-t border-foreground/10 pt-10">
          <p className="label-sm text-muted-foreground">GAP ANALYSIS</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Keywords the JD requires vs. what the resume covers
          </h2>
          <div className="mt-8 grid gap-px border border-foreground/10 md:grid-cols-2">
            <div className="bg-surface-lowest p-8">
              <p className="label-sm text-muted-foreground">MISSING</p>
              <ul className="mt-4 space-y-2">
                {missingKeywords.map((kw) => (
                  <li
                    key={kw}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 bg-foreground/30 shrink-0" />
                    {kw}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-low p-8">
              <p className="label-sm text-muted-foreground">MATCHED</p>
              <ul className="mt-4 space-y-2">
                {matchedKeywords.map((kw) => (
                  <li
                    key={kw}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 bg-foreground shrink-0" />
                    {kw}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-16 border-t border-foreground/10 pt-10">
          <p className="label-sm text-muted-foreground">RECOMMENDATIONS</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Prioritised rewrite actions
          </h2>
          <div className="mt-8 border-t border-foreground/10">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className="flex gap-6 border-b border-foreground/10 py-8"
              >
                <span
                  className={`label-sm mt-0.5 shrink-0 px-2 py-1 ${
                    rec.priority === "HIGH"
                      ? "bg-foreground text-background"
                      : rec.priority === "MEDIUM"
                        ? "bg-surface-highest text-foreground"
                        : "bg-surface-low text-muted-foreground"
                  }`}
                >
                  {rec.priority}
                </span>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {rec.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {rec.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 border border-foreground/10 p-10">
          <p className="label-sm text-muted-foreground">
            TRY IT ON YOUR RESUME
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Get your own precision report — free
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
            Upload your resume and the target job description. Receive your full
            score, gap analysis, and prioritised recommendations in under 30
            seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Check ATS Score
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-low"
            >
              Browse all guides
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
