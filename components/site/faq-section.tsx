"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  fadeUp,
  fadeUpReduced,
  staggerContainer,
  staggerContainerFast,
} from "@/lib/animation-variants";
import { faqs } from "@/lib/faq-data";

export function FaqSection() {
  const prefersReducedMotion = useReducedMotion();
  const itemVariants = prefersReducedMotion ? fadeUpReduced : fadeUp;
  const containerVariants = prefersReducedMotion
    ? staggerContainerFast
    : staggerContainer;

  return (
    <section className="py-24" aria-labelledby="faq-heading">
      <div className="container max-w-4xl">
        {/* Heading fades in first */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.p
            className="label-sm text-muted-foreground"
            variants={itemVariants}
          >
            FAQ
          </motion.p>
          <motion.h2
            id="faq-heading"
            className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            variants={itemVariants}
          >
            Questions candidates ask before improving an ATS resume score
          </motion.h2>
        </motion.div>

        {/* FAQ items stagger in independently */}
        <motion.div
          className="mt-12 grid gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {faqs.map((faq) => (
            <motion.article
              key={faq.question}
              variants={itemVariants}
              className="bg-surface-lowest p-8 shadow-ambient"
            >
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                {faq.answer}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
