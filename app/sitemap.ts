import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";

import { roleLandingPages } from "@/lib/role-pages";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/resume-checker-for", changeFrequency: "weekly", priority: 0.8 },
  { path: "/ai-ethics", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
] as const satisfies Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}>;

function getStaticBlogSlugs() {
  try {
    const blogDir = path.join(process.cwd(), "app", "(marketing)", "blog");
    if (!fs.existsSync(blogDir)) return [];

    return fs
      .readdirSync(blogDir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          !entry.name.startsWith("(") &&
          !entry.name.startsWith("["),
      )
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

const blogSlugs = [
  ...new Set([
    ...getStaticBlogSlugs(),
    ...roleLandingPages.map((page) => page.companionArticle.slug),
  ]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticSitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency as "weekly" | "yearly" | "monthly",
    priority: route.priority,
  }));

  const blogRoutes = blogSlugs.map((slug) => ({
    url: absoluteUrl(`/blog/${slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const roleGuideRoutes = roleLandingPages.map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticSitemap, ...blogRoutes, ...roleGuideRoutes];
}