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
    up: { y: y ?? 24, x: 0 },
    down: { y: -(y ?? 24), x: 0 },
    left: { y: 0, x: x ?? 24 },
    right: { y: 0, x: -(x ?? 24) },
  };

  const offset = directionMap[direction];

  const initial = { opacity: 0, y: offset.y, x: offset.x, scale: scale ?? 1 };
  const whileInViewTarget = { opacity: 1, y: 0, x: 0, scale: 1 };

  // Spring physics for a tactile, premium reveal feel.
  const transition = {
    type: "spring" as const,
    stiffness: 160,
    damping: 22,
    mass: 0.9,
    delay,
  };

  // SSR + first hydration: plain div (no Framer inline styles → no hydration mismatch).
  // After mount: motion.div with a real `initial` so whileInView fires correctly.
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
      initial={initial}
      whileInView={whileInViewTarget}
      viewport={{ once: true, amount: 0.15 }}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
