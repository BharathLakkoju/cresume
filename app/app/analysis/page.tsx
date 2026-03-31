"use client";

import { motion } from "framer-motion";

import { ResultsDashboard } from "@/components/site/results-dashboard";
import { useEvaluationStore } from "@/store/evaluation-store";

export default function AnalysisPage() {
  const { latestResult, history } = useEvaluationStore();

  if (!latestResult) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="label-sm text-muted-foreground">NO ANALYSIS YET</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
            Upload a resume to begin.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Navigate to the Upload page to start your first ATS evaluation.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ResultsDashboard result={latestResult} history={history} />
      </motion.div>
    </div>
  );
}
