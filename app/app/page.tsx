"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import { useEvaluationStore } from "@/store/evaluation-store";

export default function AppDashboardPage() {
  const { history } = useEvaluationStore();
  const [mountedAt] = useState(() => Date.now());

  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const scores = history.map((h) => h.result.overallScore);
    const total = history.length;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / total);
    const best = Math.max(...scores);

    const oneWeekAgo = mountedAt - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = history.filter(
      (h) => new Date(h.createdAt).getTime() > oneWeekAgo,
    ).length;

    const keywordFreq: Record<string, number> = {};
    for (const entry of history) {
      for (const kw of entry.result.missingKeywords) {
        keywordFreq[kw] = (keywordFreq[kw] ?? 0) + 1;
      }
    }
    const topMissing = Object.entries(keywordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([kw, count]) => ({ kw, count }));

    const buckets = [
      { label: "0–49", min: 0, max: 49, color: "bg-destructive/60" },
      { label: "50–69", min: 50, max: 69, color: "bg-amber-500/60" },
      { label: "70–89", min: 70, max: 89, color: "bg-foreground/40" },
      { label: "90–100", min: 90, max: 100, color: "bg-foreground" },
    ].map((b) => ({
      ...b,
      count: scores.filter((s) => s >= b.min && s <= b.max).length,
    }));

    return { total, avg, best, thisWeek, topMissing, buckets, scores };
  }, [history, mountedAt]);

  if (!stats) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-surface-low">
            <BarChart3 className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="label-sm text-muted-foreground mb-2">
            PRECISION PORTAL
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground">
            No scans yet
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Run your first evaluation to see analytics and insights here.
          </p>
          <Link
            href="/app/upload"
            className="mt-6 inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:opacity-80"
          >
            <Upload className="h-4 w-4" />
            Start Evaluation
          </Link>
        </motion.div>
      </div>
    );
  }

  const { total, avg, best, thisWeek, topMissing, buckets, scores } = stats;
  const maxBucketCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="label-sm text-muted-foreground">OVERVIEW</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Analytics from {total} evaluation{total !== 1 ? "s" : ""} in your
          history.
        </p>

        {/* Stat Cards — 2 cols on mobile, 4 on large */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            { label: "TOTAL SCANS", value: total, Icon: BarChart3 },
            { label: "AVG. SCORE", value: `${avg}`, Icon: Target },
            { label: "BEST SCORE", value: `${best}`, Icon: TrendingUp },
            { label: "THIS WEEK", value: thisWeek, Icon: Zap },
          ].map(({ label, value, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="bg-surface-low p-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <p className="label-sm text-muted-foreground truncate">
                  {label}
                </p>
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-foreground sm:mt-3 sm:text-4xl">
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts — full width on mobile, side-by-side on lg */}
        <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Score Trend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-surface-low p-4 sm:p-6"
          >
            <p className="label-sm text-muted-foreground mb-4">SCORE TREND</p>
            <ScoreTrend scores={[...scores].reverse()} />
          </motion.div>

          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-surface-low p-4 sm:p-6"
          >
            <p className="label-sm text-muted-foreground mb-4">
              SCORE DISTRIBUTION
            </p>
            <div className="space-y-3">
              {buckets.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="label-sm w-14 shrink-0 text-muted-foreground">
                    {b.label}
                  </span>
                  <div className="flex-1 overflow-hidden bg-surface-highest h-2">
                    <motion.div
                      className={`h-full ${b.color}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(b.count / maxBucketCount) * 100}%`,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                  <span className="label-sm w-4 shrink-0 text-right text-foreground">
                    {b.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Missing Keywords */}
        {topMissing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 bg-surface-low p-4 sm:mt-6 sm:p-6"
          >
            <p className="label-sm text-muted-foreground mb-4">
              MOST FREQUENTLY MISSING KEYWORDS
            </p>
            <div className="flex flex-wrap gap-2">
              {topMissing.map(({ kw, count }, i) => (
                <motion.span
                  key={kw}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.35 + i * 0.04 }}
                  className="inline-flex items-center gap-1.5 bg-surface-highest px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {kw}
                  <span className="bg-foreground/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    ×{count}
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function ScoreTrend({ scores }: { scores: number[] }) {
  if (scores.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
        Run at least 2 scans to see the trend.
      </div>
    );
  }

  const W = 320;
  const H = 120;
  const pad = { top: 8, right: 8, bottom: 24, left: 32 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const minS = Math.max(0, Math.min(...scores) - 5);
  const maxS = Math.min(100, Math.max(...scores) + 5);
  const range = maxS - minS || 1;

  const pts = scores.map((s, i) => ({
    x: pad.left + (i / (scores.length - 1)) * chartW,
    y: pad.top + chartH - ((s - minS) / range) * chartH,
    score: s,
  }));

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = [
    `M ${pts[0].x} ${pad.top + chartH}`,
    ...pts.map((p) => `L ${p.x} ${p.y}`),
    `L ${pts[pts.length - 1].x} ${pad.top + chartH}`,
    "Z",
  ].join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        aria-label="Score trend chart"
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 50, 100].map((v) => {
          const y = pad.top + chartH - ((v - minS) / range) * chartH;
          if (y < pad.top - 1 || y > pad.top + chartH + 1) return null;
          return (
            <text
              key={v}
              x={pad.left - 6}
              y={y + 4}
              textAnchor="end"
              fontSize={9}
              fill="currentColor"
              opacity={0.4}
            >
              {v}
            </text>
          );
        })}
        <line
          x1={pad.left}
          x2={pad.left + chartW}
          y1={pad.top + chartH / 2}
          y2={pad.top + chartH / 2}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeDasharray="4 3"
        />
        <path
          d={areaPath}
          fill="url(#trend-fill)"
          className="text-foreground"
        />
        <polyline
          points={polyline}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-foreground"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="white"
              stroke="currentColor"
              strokeWidth={2}
              className="text-foreground"
            />
            {i === pts.length - 1 && (
              <text
                x={p.x + 6}
                y={p.y + 4}
                fontSize={9}
                fill="currentColor"
                opacity={0.6}
              >
                {p.score}
              </text>
            )}
          </g>
        ))}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 4}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
            opacity={0.35}
          >
            #{i + 1}
          </text>
        ))}
      </svg>
    </div>
  );
}
