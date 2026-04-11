import Link from "next/link";

import { roleLandingPages } from "@/lib/role-pages";

type RoleGuidesSectionProps = {
  title: string;
  description: string;
  limit?: number;
  className?: string;
};

export function RoleGuidesSection({
  title,
  description,
  limit,
  className,
}: RoleGuidesSectionProps) {
  const pages = limit ? roleLandingPages.slice(0, limit) : roleLandingPages;

  return (
    <section className={className ?? "py-24"}>
      <div className="container">
        <div className="max-w-3xl">
          <p className="label-sm text-muted-foreground">Role guides</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={page.path}
              className="group rounded-3xl border border-[hsl(var(--border)/0.12)] bg-surface-lowest p-8 transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="label-sm text-muted-foreground">{page.eyebrow}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                {page.headline}
              </h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {page.metaDescription}
              </p>
              <p className="mt-6 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                Read the role guide
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
