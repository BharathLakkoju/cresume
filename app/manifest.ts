import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "atsprecise",
    short_name: "atsprecise",
    description:
      "AI ATS resume checker for resume scoring, keyword gap analysis, and resume tailoring.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9f9",
    theme_color: "#111111",
    categories: ["productivity", "business", "education"],
    lang: "en-US",
  };
}