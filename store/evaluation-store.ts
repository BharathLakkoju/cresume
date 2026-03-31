"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AtsEvaluationResult } from "@/lib/ats/types";

interface HistoryEntry {
  id: string;
  jobTitleHint: string;
  createdAt: string;
  result: AtsEvaluationResult;
}

interface EvaluationStore {
  latestResult: AtsEvaluationResult | null;
  history: HistoryEntry[];
  setLatestResult: (jobTitleHint: string, result: AtsEvaluationResult) => void;
}

export const useEvaluationStore = create<EvaluationStore>()(
  persist(
    (set) => ({
      latestResult: null,
      history: [],
      setLatestResult: (jobTitleHint, result) =>
        set((state) => ({
          latestResult: result,
          history: [
            {
              id: `${result.generatedAt}-${Math.random().toString(36).slice(2, 8)}`,
              jobTitleHint,
              createdAt: result.generatedAt,
              result
            },
            ...state.history
          ].slice(0, 8)
        }))
    }),
    {
      name: "ats-precision-history"
    }
  )
);
