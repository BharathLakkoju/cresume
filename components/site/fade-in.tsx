"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FadeInProps {
  children?: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  id?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeIn({
  className,
  delay = 0,
  y,
  x,
  scale,
  children,
  id,
  direction = "up",
}: FadeInProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const directionMap = {
    up: { y: y ?? 28, x: 0 },
    down: { y: -(y ?? 28), x: 0 },
    left: { y: 0, x: x ?? 28 },
    right: { y: 0, x: -(x ?? 28) },
  };

  const offset = directionMap[direction];

  // SSR + first hydration: plain div (no Framer inline styles → no hydration mismatch).
  // After mount: motion.div with a real `initial` so whileInView fires correctly.
  // Note: Framer Motion only reads `initial` once on mount, so we can't change it after
  // the fact — we must swap the element type entirely.
  if (!isMounted) {
    return (
      <div id={id} className={cn(className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: offset.y, x: offset.x, scale: scale ?? 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
