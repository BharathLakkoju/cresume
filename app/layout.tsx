import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { LoadingProvider } from "@/components/providers/loading-provider";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ATS Precision | AI-Powered ATS Resume Evaluator",
  description:
    "Engineered for absolute clarity. Evaluate your resume through the lens of modern ATS algorithms with mathematical rigor.",
  keywords: [
    "ATS resume checker",
    "resume score tool",
    "ATS evaluator",
    "resume job match",
    "resume optimization",
  ],
  openGraph: {
    title: "ATS Precision — Engineered for Clarity",
    description:
      "A hiring-aligned ATS evaluator for realistic resume scoring, keyword gaps, and role-specific improvement ideas.",
    type: "website",
  },
  metadataBase: new URL("https://atsprecision.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}
