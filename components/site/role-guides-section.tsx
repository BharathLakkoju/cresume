"use client";

import type { Route } from "next";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { roleLandingPages } from "@/lib/role-pages";
import {
  fadeUp,
  fadeUpReduced,
  springs,
  staggerContainer,
} from "@/lib/animation-variants";

type RoleGuidesSectionProps = {
  title: string;
  description: string;
  limit?: number;
  className?: string;
};

export function RoleGuidesSection({
  title,
  description,
  limit,
  className,
}: RoleGuidesSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const itemVariants = prefersReducedMotion ? fadeUpReduced : fadeUp;
  const pages = limit ? roleLandingPages.slice(0, limit) : roleLandingPages;

  return (
    <section className={className ?? "py-24"}>
      <div className="container">
        <div className="max-w-3xl">
          <p className="label-sm text-muted-foreground">Role guides</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {pages.map((page) => (
            <motion.div
              key={page.slug}
              variants={itemVariants}
              whileHover={!prefersReducedMotion ? { y: -4, scale: 1.01 } : {}}
              transition={springs.gentle}
            >
              <Link
                href={page.path as Route<string>}
                className="group block rounded-3xl border border-[hsl(var(--border)/0.12)] bg-surface-lowest p-8 transition-shadow duration-500 hover:shadow-panel"
              >
                <p className="label-sm text-muted-foreground">{page.eyebrow}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {page.headline}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {page.metaDescription}
                </p>
                <p className="mt-6 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  Read the role guide
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
