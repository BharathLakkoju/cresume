"use client";

import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // Disables the warning in development but respects settings in production
  return (
    <MotionConfig
      reducedMotion={process.env.NODE_ENV === "production" ? "user" : "never"}
    >
      {children}
    </MotionConfig>
  );
}
