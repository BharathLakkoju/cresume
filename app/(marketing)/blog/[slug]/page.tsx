import type { Route } from "next";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getRoleCompanionArticlePath,
  getRoleLandingPageByArticleSlug,
  roleLandingPages,
} from "@/lib/role-pages";
import { absoluteUrl, createMetadata } from "@/lib/seo";

type RoleBlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return roleLandingPages.map((page) => ({ slug: page.companionArticle.slug }));
}

export async function generateMetadata({
  params,
}: RoleBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getRoleLandingPageByArticleSlug(slug);

  if (!page) {
    return createMetadata({
      title: "Blog article not found",
      description: "The requested blog article could not be found.",
      path: "/blog/ats-resume-checker-guide",
      noIndex: true,
      type: "article",
    });
  }

  return createMetadata({
    title: page.companionArticle.metaTitle,
    description: page.companionArticle.metaDescription,
    path: getRoleCompanionArticlePath(page.companionArticle.slug),
    keywords: page.companionArticle.keywords,
    type: "article",
  });
}

export default async function RoleBlogPage({ params }: RoleBlogPageProps) {
  const { slug } = await params;
  const page = getRoleLandingPageByArticleSlug(slug);

  if (!page) {
    notFound();
  }

  const relatedArticles = roleLandingPages.filter(
    (candidate) => candidate.slug !== page.slug,
  );

  const articlePath = getRoleCompanionArticlePath(page.companionArticle.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.companionArticle.title,
    description: page.companionArticle.metaDescription,
    author: {
      "@type": "Organization",
      name: "atsprecise",
    },
    publisher: {
      "@type": "Organization",
      name: "atsprecise",
    },
    mainEntityOfPage: absoluteUrl(articlePath),
    datePublished: "2026-04-11",
    dateModified: "2026-04-11",
  };

  return (
    <main className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <article className="container max-w-5xl">
        <p className="label-sm text-muted-foreground">Blog</p>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-5xl font-bold tracking-tight text-foreground">
          {page.companionArticle.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {page.companionArticle.intro}
        </p>

        <section className="mt-12 rounded-3xl bg-surface-lowest p-8 shadow-ambient lg:p-10">
          <p className="label-sm text-muted-foreground">Role guide</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
            Pair this article with the role-specific landing page
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            The landing page focuses on ATS match signals and rewrite
            priorities. This article goes deeper on resume examples, keyword
            usage, and interview prep for the same role.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={page.path as Route<string>}
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Open role guide
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border)/0.12)] px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-base"
            >
              Check ATS score
            </Link>
          </div>
        </section>

        <div className="mt-12 space-y-8">
          {page.companionArticle.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl bg-surface-lowest p-8 shadow-ambient lg:p-10"
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

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-[hsl(var(--border)/0.12)] p-8 lg:p-10">
            <p className="label-sm text-muted-foreground">Keyword angles</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
              Search terms this role usually needs to cover
            </h2>
            <ul className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              {page.companionArticle.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl border border-[hsl(var(--border)/0.12)] p-8 lg:p-10">
            <p className="label-sm text-muted-foreground">
              Resume rewrite focus
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground">
              What to tighten before you apply
            </h2>
            <ol className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              {page.rewritePriorities.map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ol>
          </section>
        </section>

        <section className="mt-12">
          <p className="label-sm text-muted-foreground">Related articles</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {relatedArticles.slice(0, 6).map((relatedPage) => (
              <Link
                key={relatedPage.slug}
                href={
                  getRoleCompanionArticlePath(
                    relatedPage.companionArticle.slug,
                  ) as Route<string>
                }
                className="rounded-3xl border border-[hsl(var(--border)/0.12)] bg-surface-lowest p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <p className="label-sm text-muted-foreground">
                  {relatedPage.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                  {relatedPage.companionArticle.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {relatedPage.companionArticle.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
