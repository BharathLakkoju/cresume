"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FadeIn } from "@/components/site/fade-in";
import { faqs } from "@/lib/faq-data";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24" aria-labelledby="faq-heading">
      <div className="container max-w-4xl">
        <FadeIn>
          <p className="label-sm text-muted-foreground">FAQ</p>
          <h2
            id="faq-heading"
            className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Questions candidates ask before improving an ATS resume score
          </h2>
        </FadeIn>

        <div className="mt-12 border-t border-[hsl(var(--border)/0.2)]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border-b border-[hsl(var(--border)/0.2)]"
              >
                <button
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg text-foreground">
                    {faq.question}
                  </span>
                  {/* Plus / minus icon */}
                  <span className="relative h-4.5 w-4.5 shrink-0 text-muted-foreground">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    <motion.span
                      className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current"
                      animate={{
                        scaleY: isOpen ? 0 : 1,
                        opacity: isOpen ? 0 : 1,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-base leading-8 text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
