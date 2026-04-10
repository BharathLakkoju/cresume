import type { Metadata } from "next";

const defaultSiteUrl = "https://www.atsprecise.com";

export const siteConfig = {
  name: "atsprecise",
  shortName: "atsprecise",
  description:
    "atsprecise is an AI ATS resume checker that scores resume-to-job fit, finds keyword gaps, and helps candidates tailor resumes for real hiring pipelines.",
  domain: "www.atsprecise.com",
  email: "lbharath0712@gmail.com",
  keywords: [
    "ATS resume checker",
    "AI resume checker",
    "resume ATS score",
    "resume keyword scanner",
    "resume optimization",
    "resume tailoring tool",
    "job description match",
    "ATS friendly resume",
    "resume analysis tool",
    "resume score tool",
  ],
} as const;

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configuredUrl || defaultSiteUrl);
  } catch {
    return new URL(defaultSiteUrl);
  }
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  noIndex = false,
}: MetadataOptions): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}