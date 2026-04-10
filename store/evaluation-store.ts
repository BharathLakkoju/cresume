"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AtsEvaluationResult } from "@/lib/ats/types";

export const EVALUATION_HISTORY_STORAGE_KEY = "ats-precision-history";

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
  clearResults: () => void;
}

const initialEvaluationState = {
  latestResult: null,
  history: [] as HistoryEntry[]
};

export const useEvaluationStore = create<EvaluationStore>()(
  persist(
    (set) => ({
      ...initialEvaluationState,
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
        })),
      clearResults: () => set(initialEvaluationState)
    }),
    {
      name: EVALUATION_HISTORY_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export function clearEvaluationSessionData() {
  useEvaluationStore.getState().clearResults();

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(EVALUATION_HISTORY_STORAGE_KEY);
  } catch {
    // Ignore storage failures in restricted browser modes.
  }
}
