"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/fade-in";

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Background glow drifts upward as you scroll into the section
  const bgY      = useTransform(scrollYProgress, [0, 1], [80, -80]);
  // Content has a subtle counter-scroll lift for depth
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="dark-section relative overflow-hidden py-24 lg:py-32"
    >
      {/* Parallax background glow — white tinted on dark background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-96 w-[70%] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.07),transparent_70%)] blur-3xl"
      />

      <div className="container text-center">
        <motion.div style={{ y: contentY }}>
          <FadeIn>
            <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to break the black box?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
              Join 15,000+ professionals using precision AI to secure their dream
              roles.
            </p>
            <div className="mt-10">
              <Button
                size="xl"
                className="bg-white text-black! hover:bg-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                asChild
              >
                <Link href="/auth">Check ATS Score</Link>
              </Button>
            </div>
            <p className="mt-6 label-sm text-white/40">
              FREE TO START. NO CREDIT CARD REQUIRED.
            </p>
          </FadeIn>
        </motion.div>
      </div>
    </section>
  );
}
