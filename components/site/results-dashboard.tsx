"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight, Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AtsEvaluationResult } from "@/lib/ats/types";

const labelMap = {
  keywordMatch: "KEYWORDS",
  semanticMatch: "SEMANTIC",
  skillsAlignment: "SKILLS",
  experienceRelevance: "EXPERIENCE",
  formattingReadability: "FORMATTING",
} as const;

interface ResultsDashboardProps {
  result: AtsEvaluationResult;
  history: Array<{
    id: string;
    jobTitleHint: string;
    createdAt: string;
    result: AtsEvaluationResult;
  }>;
}

function getScoreLabel(score: number) {
  if (score >= 85) return "OPTIMIZED STRENGTH";
  if (score >= 70) return "STRONG ALIGNMENT";
  if (score >= 55) return "MODERATE FIT";
  return "NEEDS IMPROVEMENT";
}

function getScoreDescription(score: number) {
  if (score >= 85)
    return "Your profile is in the top 5% of candidates for this specific role. Minor adjustments can bridge the final gap.";
  if (score >= 70)
    return "Your profile shows strong alignment with the target role. Focus on the gaps below to improve further.";
  if (score >= 55)
    return "Your profile has moderate fit. Address the key gaps and missing keywords to significantly improve your match.";
  return "Your profile needs significant adjustments to align with this role. Follow the suggestions below.";
}

export function ResultsDashboard({ result, history }: ResultsDashboardProps) {
  const scoreLabel = getScoreLabel(result.overallScore);
  const scoreWords = scoreLabel.split(" ");

  return (
    <div className="space-y-6">
      {/* ── TOP ROW ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Score headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-surface-lowest p-8 shadow-ambient"
        >
          {result.detectedRole && (
            <p className="label-sm text-muted-foreground">
              Analysis /&nbsp;
              <span className="text-foreground">{result.detectedRole}</span>
            </p>
          )}
          <p className="mt-2 label-sm text-muted-foreground">
            OVERALL QUALITY INDEX
          </p>

          {/* Big heading — two lines */}
          <div className="mt-3">
            {scoreWords.map((word, i) => (
              <h2
                key={i}
                className={`block font-display text-5xl font-black leading-none tracking-tight sm:text-6xl ${
                  i === scoreWords.length - 1
                    ? "text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {word}
              </h2>
            ))}
          </div>

          {/* Score number — large, overlapping right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute right-8 top-8 flex flex-col items-end"
          >
            <span className="font-display text-[7rem] font-black leading-none text-foreground/10 sm:text-[9rem]">
              {result.overallScore}
            </span>
            <span className="label-sm -mt-2 text-muted-foreground">
              PERCENTILE
            </span>
          </motion.div>

          <p className="mt-6 max-w-sm text-muted-foreground leading-7">
            {getScoreDescription(result.overallScore)}
          </p>

          {result.aiInsight && (
            <p className="mt-4 max-w-sm text-sm italic text-muted-foreground/80 border-l-2 border-surface-highest pl-4">
              {result.aiInsight}
            </p>
          )}

          <Button variant="default" className="mt-6" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download Analysis
          </Button>
        </motion.div>

        {/* Right: Success Vectors — dark card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl bg-foreground p-6 text-primary-foreground"
        >
          <p className="label-sm text-white/50">SUCCESS VECTORS</p>
          <div className="mt-6 space-y-5">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">
                    {labelMap[key as keyof typeof labelMap]}
                  </span>
                  <span className="font-semibold text-white">{value}%</span>
                </div>
                <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-white/70"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs italic text-white/30">
            {result.overallScore >= 70
              ? "High technical alignment detected."
              : "Improvement opportunities identified."}
          </p>
        </motion.div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl bg-surface-lowest p-8 shadow-ambient"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-low">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Gap Analysis
            </h3>
          </div>

          {result.missingKeywords.length > 0 && (
            <div className="mt-6">
              <p className="label-sm text-muted-foreground">
                MISSING STRATEGIC KEYWORDS
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.missingKeywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                  >
                    <X className="h-3 w-3" />
                    {kw.toUpperCase()}
                  </span>
                ))}
                {result.missingKeywords.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-surface-low px-3 py-1.5 text-xs text-muted-foreground">
                    + {result.missingKeywords.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {result.resumeGaps.length > 0 && (
            <div className="mt-6">
              <p className="label-sm text-muted-foreground">
                STRUCTURAL DEFICIENCIES
              </p>
              <div className="mt-3 space-y-3">
                {result.resumeGaps.slice(0, 3).map((gap) => (
                  <div
                    key={gap.label}
                    className="flex gap-3 rounded-xl bg-red-50 p-4"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {gap.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {gap.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.matchedSkills.length > 0 && (
            <div className="mt-6">
              <p className="label-sm text-muted-foreground">MATCHED SKILLS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.matchedSkills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-surface-low px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Precision Actions + Historical Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col rounded-2xl bg-surface-lowest p-8 shadow-ambient"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-low">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Precision Actions
            </h3>
          </div>

          <div className="mt-6 flex-1 space-y-2">
            {result.suggestions.map((s) => (
              <div
                key={s.title}
                className="flex items-center justify-between gap-4 rounded-xl bg-surface-low p-4 transition-colors hover:bg-surface-highest"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {s.detail}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>

          {history.length > 0 && (
            <div className="mt-8">
              <p className="label-sm text-muted-foreground">HISTORICAL TREND</p>
              <div className="mt-3 flex items-end gap-1.5 h-14">
                {history
                  .slice(0, 8)
                  .reverse()
                  .map((entry, i, arr) => (
                    <motion.div
                      key={entry.id}
                      initial={{ height: 0 }}
                      animate={{
                        height: `${Math.max(entry.result.overallScore * 0.56, 14)}px`,
                      }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`w-8 max-w-8 rounded-t-md ${
                        i === arr.length - 1
                          ? "bg-foreground"
                          : "bg-surface-highest"
                      }`}
                      title={`Score: ${entry.result.overallScore} — ${entry.jobTitleHint}`}
                    />
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
