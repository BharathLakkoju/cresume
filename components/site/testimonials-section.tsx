"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { FadeIn } from "@/components/site/fade-in";
import { springs } from "@/lib/animation-variants";

const testimonials = [
  {
    quote:
      "atsprecise helped me realize my resume was being filtered out not because of my skills, but because of my structure. After one scan, I landed 3 interviews in a week.",
    initials: "SL",
    name: "Ram Sundar",
    role: "DATA SCIENTIST",
  },
  {
    quote:
      "The semantic mapping is scary accurate. It picked up on nuances in my engineering background that generic ATS checkers completely missed.",
    initials: "SR",
    name: "Siva Raghavan",
    role: "DATA ANALYST",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Two cards move in opposing vertical directions — creates a dynamic depth effect
  const leftY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-30, 50]);

  // Decorative background parallax
  const blobY = useTransform(scrollYProgress, [0, 1], [40, -60]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32">
      {/* Parallax decorative blob */}
      <motion.div
        style={{ y: blobY }}
        className="absolute -left-20 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03),transparent_65%)] blur-3xl"
      />

      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <FadeIn delay={0} direction="left">
            <motion.div style={{ y: leftY }} className="will-change-transform">
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                transition={springs.gentle}
                className="h-full"
              >
                <div className="bg-surface-lowest p-8 shadow-ambient transition-shadow duration-500 hover:shadow-panel">
                  <p className="text-lg italic leading-8 text-foreground">
                    &ldquo;{testimonials[0].quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center bg-surface-low font-display text-sm font-semibold text-muted-foreground">
                      {testimonials[0].initials}
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {testimonials[0].name}
                      </p>
                      <p className="label-sm text-muted-foreground">
                        {testimonials[0].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.12} direction="right">
            <motion.div style={{ y: rightY }} className="will-change-transform">
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                transition={springs.gentle}
                className="h-full"
              >
                <div className="bg-surface-lowest p-8 shadow-ambient transition-shadow duration-500 hover:shadow-panel">
                  <p className="text-lg italic leading-8 text-foreground">
                    &ldquo;{testimonials[1].quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center bg-surface-low font-display text-sm font-semibold text-muted-foreground">
                      {testimonials[1].initials}
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {testimonials[1].name}
                      </p>
                      <p className="label-sm text-muted-foreground">
                        {testimonials[1].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
