"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/fade-in";

const bars = [
  { height: 38, tone: "lite" as const },
  { height: 55, tone: "mid" as const },
  { height: 72, tone: "full" as const },
  { height: 85, tone: "full" as const },
  { height: 68, tone: "mid" as const },
  { height: 92, tone: "full" as const },
  { height: 78, tone: "mid" as const },
];

const barToneClass: Record<"lite" | "mid" | "full", string> = {
  lite: "bg-surface-highest",
  mid: "bg-foreground/25",
  full: "bg-foreground",
};

export function HeroSection() {
  const { scrollY } = useScroll();

  const blob1Y = useTransform(scrollY, [0, 800], [0, 220]);
  const blob2Y = useTransform(scrollY, [0, 800], [0, -140]);
  const blob3Y = useTransform(scrollY, [0, 800], [0, 110]);

  const cardY = useTransform(scrollY, [0, 800], [0, -90]);
  const cardScale = useTransform(scrollY, [0, 800], [1.4, 1]);

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28"
    >
      {/* Parallax background blobs */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -left-32 -top-20 -z-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(21,19,17,0.05),transparent_65%)] blur-3xl"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute -right-24 top-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(21,19,17,0.03),transparent_60%)] blur-3xl"
      />
      <motion.div
        style={{ y: blob3Y }}
        className="absolute left-1/2 top-2/3 -z-10 h-80 w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(21,19,17,0.03),transparent_70%)] blur-3xl"
      />

      <div className="container text-center">
        {/* Badge */}
        <FadeIn delay={0}>
          <span className="label-sm inline-flex items-center gap-2 bg-surface-low px-4 py-2 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            NEXT-GEN RESUME ANALYSIS
          </span>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.05}>
          <h1 className="mx-auto mt-8 max-w-4xl text-balance font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-display-lg">
            Engineered for
            <br />
            <em className="italic text-muted-foreground">Absolute Clarity.</em>
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Stop guessing. Our high-precision AI evaluates your resume through
            the lens of modern ATS algorithms with mathematical rigor.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" asChild>
              <Link href="/auth">Check ATS Score</Link>
            </Button>
            <Button variant="secondary" size="lg">
              View Sample Report
            </Button>
          </div>
        </FadeIn>

        {/* Chart Preview Card */}
        <FadeIn delay={0.3}>
          <motion.div
            style={{ y: cardY, scale: cardScale }}
            className="mx-auto mt-24 max-w-lg will-change-transform"
          >
            <div className="bg-surface-lowest p-1 shadow-panel">
              <div className="bg-surface-low p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="label-sm text-muted-foreground">
                    ATS QUANTIFIED
                  </p>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 bg-surface-highest" />
                    <div className="h-2 w-2 bg-surface-highest" />
                    <div className="h-2 w-2 bg-foreground" />
                  </div>
                </div>
                {/* Three-tone animated bar chart */}
                <div className="flex items-end justify-center gap-2.5 pt-2">
                  {bars.map((bar, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.height}px` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + i * 0.08,
                        ease: "easeOut",
                      }}
                      className={`w-8 sm:w-9 ${barToneClass[bar.tone]}`}
                      style={{ minHeight: 4 }}
                    />
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-0.5 overflow-hidden bg-surface-highest">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "65%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.4,
                      delay: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full bg-foreground"
                  />
                </div>
                <p className="mt-2 label-sm text-right text-muted-foreground">
                  ANALYZING STRUCTURE...
                </p>
              </div>
            </div>
          </motion.div>
        </FadeIn>

        {/* Scroll cue */}
        <FadeIn delay={0.5}>
          <div className="mt-12 flex flex-col items-center gap-2">
            <motion.div
              className="h-7 w-px bg-muted-foreground/40"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="label-sm text-muted-foreground/60">SCROLL</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
