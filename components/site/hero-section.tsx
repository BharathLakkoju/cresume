"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/fade-in";

export function HeroSection() {
  const { scrollY } = useScroll();

  // Background blob layers — each moves at a different speed for depth
  const blob1Y   = useTransform(scrollY, [0, 800], [0, 220]);
  const blob2Y   = useTransform(scrollY, [0, 800], [0, -140]);
  const blob3Y   = useTransform(scrollY, [0, 800], [0, 110]);

  // Hero card — moves up, tilts, and shrinks slightly while scrolling
  const cardY      = useTransform(scrollY, [0, 800], [0, -90]);
  const cardRotate = useTransform(scrollY, [0, 800], [0, 5]);
  const cardScale  = useTransform(scrollY, [0, 800], [1, 0.95]);

  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28">
      {/* Parallax background blobs — three layers at different depths */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -left-32 -top-20 -z-10 h-136 w-136 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_65%)] blur-3xl"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute -right-24 top-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.04),transparent_60%)] blur-3xl"
      />
      <motion.div
        style={{ y: blob3Y }}
        className="absolute left-1/2 top-2/3 -z-10 h-80 w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,0,0,0.03),transparent_70%)] blur-3xl"
      />

      <div className="container text-center">
        {/* Badge */}
        <FadeIn delay={0}>
          <span className="label-sm inline-block rounded-full bg-surface-low px-4 py-2 text-muted-foreground">
            NEXT-GEN RESUME ANALYSIS
          </span>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.05}>
          <h1 className="mx-auto mt-8 max-w-4xl text-balance font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-display-lg">
            Engineered for
            <br />
            Absolute Clarity.
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

        {/* Chart Preview Card — pronounced parallax: rises, tilts, shrinks on scroll */}
        <FadeIn delay={0.3}>
          <motion.div
            style={{ y: cardY, rotate: cardRotate, scale: cardScale }}
            className="mx-auto mt-16 max-w-lg will-change-transform"
          >
            <div className="rounded-2xl bg-surface-lowest p-1 shadow-panel">
              <div className="panel-grid rounded-xl bg-surface-lowest p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="label-sm text-muted-foreground">ATS QUANTIFIED</p>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-surface-highest" />
                    <div className="h-2 w-2 rounded-full bg-surface-highest" />
                    <div className="h-2 w-2 rounded-full bg-foreground" />
                  </div>
                </div>
                {/* Animated bar chart — bars grow in when entering viewport */}
                <div className="flex items-end justify-center gap-3 pt-4">
                  {[38, 55, 72, 85, 68, 92, 78].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}px` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                      className="w-8 rounded-t-md bg-foreground sm:w-10"
                      style={{ minHeight: 4 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
