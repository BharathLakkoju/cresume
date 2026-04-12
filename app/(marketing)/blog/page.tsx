import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import {
  roleLandingPages,
  getRoleCompanionArticlePath,
} from "@/lib/role-pages";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog — Resume & ATS guides",
  description:
    "Role-specific resume guides, ATS keyword breakdowns, and interview prep articles for software engineers, product managers, data analysts, and more.",
  path: "/blog",
  keywords: [
    "ATS resume guides",
    "resume keyword articles",
    "resume tips by role",
    "interview prep guides",
  ],
});

// Static editorial post that lives at a fixed path
const featuredPost = {
  eyebrow: "Guide",
  title:
    "ATS resume checker guide: how to score higher without stuffing keywords",
  description:
    "Learn how ATS systems evaluate resumes, which resume signals matter most, and how to improve resume-to-job alignment without keyword stuffing.",
  href: "/blog/ats-resume-checker-guide",
  date: "Apr 10, 2026",
};

export default function BlogIndexPage() {
  const articles = roleLandingPages.map((page) => ({
    eyebrow: page.eyebrow,
    title: page.companionArticle.title,
    description: page.companionArticle.metaDescription,
    href: getRoleCompanionArticlePath(page.companionArticle.slug),
    date: "Apr 11, 2026",
  }));

  return (
    <main className="py-24">
      <div className="container">
        {/* Header */}
        <p className="label-sm text-muted-foreground">BLOG</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-bold tracking-tight text-foreground">
          Resume &amp; ATS Guides
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Role-specific keyword breakdowns, resume examples, and interview prep
          for every function.
        </p>

        {/* Featured post */}
        <div className="mt-16 border-t border-foreground/10">
          <Link
            href={featuredPost.href as Route<string>}
            className="group flex flex-col gap-4 border-b border-foreground/10 py-10 md:flex-row md:items-start md:justify-between md:gap-12"
          >
            <div className="flex-1">
              <p className="label-sm text-muted-foreground">
                {featuredPost.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground transition-opacity group-hover:opacity-70">
                {featuredPost.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                {featuredPost.description}
              </p>
            </div>
            <div className="shrink-0 text-sm text-muted-foreground md:pt-1">
              {featuredPost.date}
            </div>
          </Link>
        </div>

        {/* All role companion articles */}
        <div className="mt-4">
          {articles.map((article) => (
            <Link
              key={article.href}
              href={article.href as Route<string>}
              className="group flex flex-col gap-4 border-b border-foreground/10 py-8 md:flex-row md:items-start md:justify-between md:gap-12"
            >
              <div className="flex-1">
                <p className="label-sm text-muted-foreground">
                  {article.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-xl font-semibold text-foreground transition-opacity group-hover:opacity-70">
                  {article.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {article.description}
                </p>
              </div>
              <div className="shrink-0 text-sm text-muted-foreground md:pt-1">
                {article.date}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
