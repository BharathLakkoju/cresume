"use client";

import { useRef } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/fade-in";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Try the core analysis engine — no account required.",
    cta: "Start for Free",
    href: "/app/upload",
    featured: false,
    features: [
      "2 ATS evaluations",
      "Full score breakdown",
      "Keyword gap analysis",
      "Actionable recommendations",
      "No account needed",
    ],
    missing: [
      "Resume tailoring",
      "Structured resume builder",
      "Cloud history sync",
      "Profile & skills tracking",
    ],
  },
  {
    name: "Pro",
    price: "Free",
    period: "during beta",
    description:
      "Unlimited evaluations plus AI tailoring and a builder — free while we&apos;re in beta.",
    cta: "Create Account",
    href: "/auth",
    featured: true,
    features: [
      "Unlimited ATS evaluations",
      "Full score breakdown",
      "Keyword gap analysis",
      "Actionable recommendations",
      "AI resume tailoring",
      "Structured resume builder",
      "Cloud-synced history",
      "Profile & skills tracking",
      "Export your data anytime",
    ],
    missing: [],
  },
];

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-24 lg:py-32"
      style={{ scrollMarginTop: "80px" }}
    >
      <div className="container">
        <FadeIn>
          <p className="label-sm text-muted-foreground">PRICING</p>
          <h2 className="mt-4 max-w-lg font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Start free with no account. Unlock everything by creating a free
            account during our beta.
          </p>
        </FadeIn>

        <motion.div
          style={{ y: contentY }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:max-w-3xl"
        >
          {tiers.map((tier) => (
            <FadeIn key={tier.name}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  tier.featured
                    ? "border-foreground/20 bg-foreground text-background"
                    : "border-[hsl(var(--border)/0.15)] bg-card"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-8">
                    <span className="rounded-full border border-foreground/20 bg-background px-3 py-1 text-xs font-semibold text-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <p
                    className={`label-sm ${tier.featured ? "text-background/60" : "text-muted-foreground"}`}
                  >
                    {tier.name.toUpperCase()}
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span
                      className={`font-display text-4xl font-bold ${tier.featured ? "text-background" : "text-foreground"}`}
                    >
                      {tier.price}
                    </span>
                    <span
                      className={`mb-1 text-sm ${tier.featured ? "text-background/60" : "text-muted-foreground"}`}
                    >
                      / {tier.period}
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${tier.featured ? "text-background/70" : "text-muted-foreground"}`}
                    dangerouslySetInnerHTML={{ __html: tier.description }}
                  />
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-background" : "text-foreground"}`}
                      />
                      <span
                        className={
                          tier.featured
                            ? "text-background/90"
                            : "text-muted-foreground"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                  {tier.missing.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm opacity-30"
                    >
                      <span className="mt-0.5 h-4 w-4 shrink-0 text-center leading-none">
                        –
                      </span>
                      <span
                        className={
                          tier.featured
                            ? "text-background/90"
                            : "text-muted-foreground"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    size="lg"
                    className={`w-full ${
                      tier.featured
                        ? "bg-background text-foreground hover:bg-background/90"
                        : ""
                    }`}
                    variant={tier.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link href={tier.href as "/app/upload" | "/auth"}>
                      {tier.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
