import type { Variants } from "framer-motion";

// ─── Spring physics ──────────────────────────────────────────────────────────
// Use these in `transition` props for tactile, premium-feel motion.
export const springs = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 22, mass: 1 },
  smooth: { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.9 },
  snappy: { type: "spring" as const, stiffness: 280, damping: 22, mass: 0.8 },
  stiff: { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.85 },
} as const;

// ─── Easing curves ───────────────────────────────────────────────────────────
// For duration-based transitions (non-spring).
export const easings = {
  premium: [0.16, 1, 0.3, 1] as [number, number, number, number],
  smooth: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  outExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
} as const;

// ─── Viewport reveal variants ────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easings.smooth } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: easings.smooth } },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.93, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springs.smooth },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: easings.outExpo } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: easings.outExpo } },
};

// ─── Reduced-motion safe variants (opacity-only, no spatial movement) ────────
export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// ─── Stagger containers ───────────────────────────────────────────────────────
// Assign as `variants` on a motion parent — children with matching variant keys
// will animate in staggered sequence.
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ─── Card hover propagation variants ─────────────────────────────────────────
// Set `initial="rest" whileHover="hover" animate="rest"` on the card wrapper.
// Nest motion children with these variants to get coordinated hover reactions.
export const cardVariants: Variants = {
  rest: { y: 0, scale: 1, transition: springs.gentle },
  hover: { y: -5, scale: 1.02, transition: springs.gentle },
};

export const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0, transition: springs.snappy },
  hover: { scale: 1.1, rotate: 5, transition: springs.snappy },
};

// ─── Standalone whileHover values ────────────────────────────────────────────
// Use directly as `whileHover={cardHoverLight}` when no child propagation needed.
export const cardHoverLight = { y: -4, scale: 1.015 } as const;
export const cardHoverMedium = { y: -6, scale: 1.025 } as const;
