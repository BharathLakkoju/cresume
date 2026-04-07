"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileUp } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";

const steps = [
  {
    number: "01",
    title: "Upload Resume",
    detail:
      "Drop your PDF or DOCX file. We handle complex layouts and parse them into raw semantic data.",
  },
  {
    number: "02",
    title: "Paste JD",
    detail:
      "Provide the target Job Description. Our AI analyzes the hidden constraints of the role.",
  },
  {
    number: "03",
    title: "Get Results",
    detail:
      "Receive an interactive report with a precision score and actionable, line-by-line feedback.",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Upload card floats upward as you scroll through the section
  const cardY = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);

  // Step numbers drift at a slower rate (parallax depth layer)
  const stepsY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="relative py-24 lg:py-32"
      style={{ scrollMarginTop: "80px" }}
    >
      <div className="container">
        <FadeIn>
          <p className="label-sm text-muted-foreground">THE PROTOCOL</p>
          <h2 className="mt-4 max-w-lg font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Three Steps To
            <br />
            Optimization
          </h2>
        </FadeIn>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2">
          {/* Left — Steps with subtle parallax drift */}
          <motion.div
            style={{ y: stepsY }}
            className="space-y-10 will-change-transform"
          >
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.1}>
                <div className="flex gap-5">
                  <span className="font-display text-4xl font-bold text-surface-highest">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-7 text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </motion.div>

          {/* Right — Upload card with pronounced parallax */}
          <FadeIn delay={0.2}>
            <motion.div
              style={{ y: cardY, rotate: cardRotate }}
              className="will-change-transform bg-surface-lowest p-8 shadow-panel"
            >
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-surface-highest py-16">
                <div className="flex h-14 w-14 items-center justify-center bg-foreground text-white">
                  <FileUp className="h-6 w-6" />
                </div>
                <p className="mt-4 font-display font-semibold text-foreground">
                  Drag your file here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Max 5MB</p>
              </div>
              <div className="mt-6 h-1 overflow-hidden bg-surface-highest">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-foreground"
                />
              </div>
              <p className="mt-3 label-sm text-right text-muted-foreground">
                ANALYZING STRUCTURE...
              </p>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
