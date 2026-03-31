"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const analysisStages = [
  "PARSING RESUME CONTENT...",
  "ANALYZING JOB DESCRIPTION...",
  "CALCULATING SEMANTIC SIMILARITY...",
  "GENERATING ATS SCORE...",
];

const tailoringStages = [
  "PARSING RESUME STRUCTURE...",
  "MATCHING JD KEYWORDS...",
  "GENERATING PRECISION REWRITES...",
  "FINALIZING TAILORED VERSION...",
];

type Mode = "analysis" | "tailoring";

export function ProcessingState({
  activeStage,
  mode = "analysis",
}: {
  activeStage: number;
  mode?: Mode;
}) {
  const stages = mode === "tailoring" ? tailoringStages : analysisStages;
  const progressPercent = Math.min(
    ((activeStage + 1) / stages.length) * 100,
    95,
  );

  return (
    <div className="flex flex-col items-center text-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-10"
      >
        <div className="flex h-32 w-32 items-center justify-center bg-surface-low shadow-ambient">
          {/* Animated checkmark lines */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            className="text-foreground"
          >
            <motion.path
              d="M15 28 L28 42"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.path
              d="M28 42 L48 18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
          </svg>
          <motion.div
            className="absolute bottom-4 right-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="h-5 w-5 fill-foreground text-foreground" />
          </motion.div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
      >
        {mode === "tailoring" ? "PRECISION" : "DEEP ANALYTICS"}
      </motion.h2>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-display text-4xl font-bold italic tracking-tight text-muted-foreground sm:text-5xl"
      >
        {mode === "tailoring" ? "TAILORING" : "IN PROGRESS"}
      </motion.h2>

      {/* Progress Bar */}
      <div className="mt-10 w-full max-w-md">
        <div className="flex items-center justify-between text-sm">
          <span className="label-sm text-muted-foreground">
            SYSTEM INTEGRITY: OPTIMAL
          </span>
          <span className="label-sm text-foreground">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden bg-surface-highest">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-foreground"
          />
        </div>
      </div>

      {/* Processing Steps */}
      <div className="mt-8 space-y-3">
        {stages.map((stage, index) => {
          const isActive = index === activeStage;
          const isComplete = index < activeStage;
          return (
            <motion.p
              key={stage}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : isComplete ? 0.4 : 0.25 }}
              transition={{ duration: 0.3 }}
              className={`label-sm ${
                isActive
                  ? "flex items-center justify-center gap-2 text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {isActive && <span className="h-2 w-2 bg-foreground" />}
              {stage}
            </motion.p>
          );
        })}
      </div>

      {/* Technical Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-12 max-w-sm"
      >
        <p className="label-sm text-muted-foreground">TECHNICAL NOTE</p>
        <p className="mt-2 text-sm italic text-muted-foreground">
          &ldquo;Precision is not just about the match, but the semantic
          resonance between your experience and their intent.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
