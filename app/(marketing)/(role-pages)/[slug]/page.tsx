import type { Route } from "next";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getRoleCompanionArticlePath,
  getRoleLandingPage,
  roleGuidesHubPath,
  roleLandingPages,
} from "@/lib/role-pages";
import { absoluteUrl, createMetadata } from "@/lib/seo";

type RoleLandingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return roleLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: RoleLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getRoleLandingPage(slug);

  if (!page) {
    return createMetadata({
      title: "Role guide not found",
      description:
        "The requested role-specific resume guide could not be found.",
      path: roleGuidesHubPath,
      noIndex: true,
    });
  }

  return createMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.keywords,
  });
}

export default async function RoleLandingPage({
  params,
}: RoleLandingPageProps) {
  const { slug } = await params;
  const page = getRoleLandingPage(slug);

  if (!page) {
    notFound();
  }

  const relatedPages = roleLandingPages.filter(
    (candidate) => candidate.slug !== page.slug,
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.headline,
    description: page.metaDescription,
    author: {
      "@type": "Organization",
      name: "atsprecise",
    },
    publisher: {
      "@type": "Organization",
      name: "atsprecise",
    },
    mainEntityOfPage: absoluteUrl(page.path),
    datePublished: "2026-04-10",
    dateModified: "2026-04-10",
  };

  return (
    <main className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <article className="container max-w-5xl">
        <p className="label-sm text-muted-foreground">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl font-bold tracking-tight text-foreground">
          {page.headline}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {page.intro}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-surface-lowest p-8 shadow-ambient">
            <p className="label-sm text-muted-foreground">What to optimize</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
              Signals ATS screening looks for in this role
            </h2>
            <ul className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              {page.matchSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl bg-surface-lowest p-8 shadow-ambient">
            <p className="label-sm text-muted-foreground">Rewrite priorities</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
              What candidates should change first
            </h2>
            <ol className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              {page.rewritePriorities.map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ol>
          </section>
        </div>

        <section className="mt-12 rounded-3xl border border-[hsl(var(--border)/0.12)] p-8 lg:p-10">
          <p className="label-sm text-muted-foreground">Role focus</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Why {page.audience.toLowerCase()} need role-specific resume scanning
          </h2>
          <p className="mt-6 text-base leading-8 text-muted-foreground">
            Generic scanners often flatten resumes into a single keyword score.
            That misses how hiring teams evaluate function-specific evidence. A
            strong {page.headline.toLowerCase()} workflow should account for the
            exact language, ownership scope, and proof patterns that recruiters
            expect in this function.
          </p>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            For {page.audience.toLowerCase()}, the highest-leverage edits
            usually come from aligning titles, summary language, and the most
            relevant experience bullets to the target role before adding more
            keywords. That keeps the resume readable while still improving match
            coverage.
          </p>
        </section>

        <section className="mt-12 rounded-3xl bg-surface-lowest p-8 shadow-ambient lg:p-10">
          <p className="label-sm text-muted-foreground">Companion article</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Go deeper with resume examples, keyword lists, and interview prep
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
            {page.companionArticle.metaDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={
                getRoleCompanionArticlePath(
                  page.companionArticle.slug,
                ) as Route<string>
              }
              className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border)/0.12)] px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-base"
            >
              Read companion article
            </Link>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-[linear-gradient(135deg,hsl(var(--surface-base)),hsl(var(--surface-lowest)))] p-8 lg:p-10">
          <p className="label-sm text-muted-foreground">Use the product</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Check your resume against a live job description
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Paste the target job description, upload your current resume, and
            use atsprecise to surface missing keywords, weak evidence, and role
            alignment gaps before you apply.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Check ATS score
            </Link>
            <Link
              href={roleGuidesHubPath as Route<string>}
              className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border)/0.12)] px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-lowest"
            >
              Browse more role guides
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <p className="label-sm text-muted-foreground">FAQ</p>
          <div className="mt-6 space-y-6">
            {page.faq.map((entry) => (
              <section
                key={entry.question}
                className="rounded-3xl bg-surface-lowest p-8 shadow-ambient"
              >
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {entry.question}
                </h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  {entry.answer}
                </p>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="label-sm text-muted-foreground">Related guides</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {relatedPages.map((relatedPage) => (
              <Link
                key={relatedPage.slug}
                href={relatedPage.path as Route<string>}
                className="rounded-3xl border border-[hsl(var(--border)/0.12)] bg-surface-lowest p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <p className="label-sm text-muted-foreground">
                  {relatedPage.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                  {relatedPage.headline}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {relatedPage.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
