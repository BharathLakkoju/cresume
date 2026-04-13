"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { roleLandingPages } from "@/lib/role-pages";

gsap.registerPlugin(ScrollTrigger);

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
  const pages = limit ? roleLandingPages.slice(0, limit) : roleLandingPages;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount + on resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // GSAP pinned horizontal scroll — desktop only
  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx: gsap.Context;

    const initTimeout = setTimeout(() => {
      const halfViewport = window.innerWidth / 2;
      const firstCardHalf =
        ((track.firstElementChild as HTMLElement)?.offsetWidth ?? 0) / 2;
      const lastCardHalf =
        ((track.lastElementChild as HTMLElement)?.offsetWidth ?? 0) / 2;

      const startX = halfViewport - firstCardHalf;
      const endX = -(track.scrollWidth - halfViewport - lastCardHalf);
      const totalTravel = startX - endX;

      if (totalTravel <= 0) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          track,
          { x: startX },
          {
            x: endX,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${totalTravel}`,
              invalidateOnRefresh: true,
            },
          },
        );
      }, section);
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      ctx?.revert();
    };
  }, [isMobile, pages.length]);

  // ─── Mobile layout ───────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id="role-guides" className={className ?? ""}>
        {/* Header */}
        <div className="px-4 pt-16 pb-8">
          <p className="label-sm text-muted-foreground">Role guides</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>

        {/*
          Native horizontal scroll with snap.
          - overflow-x: scroll → native momentum scroll on iOS, no jank
          - scroll-snap-type: x mandatory → snaps card-by-card
          - pb for scrollbar clearance on Android
        */}
        <div
          className="overflow-x-auto pb-6"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            ref={trackRef}
            className="flex"
            // px so first/last card peek from center, gap between cards
            style={{
              paddingLeft: "calc(50vw - 140px)",
              paddingRight: "calc(50vw - 140px)",
              gap: "16px",
              width: "max-content",
            }}
          >
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={page.path as Route<string>}
                className="group shrink-0 border-2 border-foreground bg-surface-lowest p-6 flex flex-col justify-between transition-colors active:bg-surface-low"
                style={{
                  width: "280px",
                  minHeight: "320px",
                  scrollSnapAlign: "center", // snaps each card to center
                }}
              >
                <div>
                  <p className="label-sm text-muted-foreground">
                    {page.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                    {page.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {page.metaDescription}
                  </p>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground transition-opacity group-hover:opacity-60">
                  Read the role guide →
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-xs text-muted-foreground pb-12 mt-2">
          ← Swipe to explore →
        </p>
      </section>
    );
  }

  // ─── Desktop layout ───────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="role-guides"
      className={className ?? ""}
      style={{ overflow: "clip" }}
    >
      <div className="h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="container mb-12">
          <div className="max-w-3xl">
            <p className="label-sm text-muted-foreground">Role guides</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ width: "max-content" }}
          >
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={page.path as Route<string>}
                className="group shrink-0 w-95 border-y-2 border-l-2 border-foreground last:border-r-2 bg-surface-lowest p-12 flex flex-col justify-between transition-colors hover:bg-surface-low"
                style={{ minHeight: "360px" }}
              >
                <div>
                  <p className="label-sm text-muted-foreground">
                    {page.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                    {page.headline}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    {page.metaDescription}
                  </p>
                </div>
                <p className="mt-6 text-sm font-medium text-foreground transition-opacity group-hover:opacity-60">
                  Read the role guide →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
