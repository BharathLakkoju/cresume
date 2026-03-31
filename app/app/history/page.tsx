"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Sparkles, BarChart3 } from "lucide-react";

import { useEvaluationStore } from "@/store/evaluation-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface RemoteEntry {
  id: string;
  job_title: string | null;
  overall_score: number;
  mode: string;
  created_at: string;
}

export default function HistoryPage() {
  const { history: localHistory } = useEvaluationStore();
  const [remoteHistory, setRemoteHistory] = useState<RemoteEntry[] | null>(
    null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(async ({ data }: { data: { user: import("@supabase/supabase-js").User | null } }) => {
      if (!data.user) return;
      setIsLoggedIn(true);

      const { data: rows } = await supabase
        .from("user_evaluations")
        .select("id, job_title, overall_score, mode, created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (rows) setRemoteHistory(rows as RemoteEntry[]);
    });
  }, []);

  const displayList =
    isLoggedIn && remoteHistory !== null ? remoteHistory : null;
  const fallbackList = localHistory;

  return (
    <div className="p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="label-sm text-muted-foreground">EVALUATION ARCHIVE</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
          History
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          {isLoggedIn
            ? "Your full evaluation history synced from the cloud."
            : "Local session history. Sign in to sync evaluations across devices."}
        </p>

        {displayList !== null ? (
          displayList.length > 0 ? (
            <div className="mt-10 space-y-4">
              {displayList.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-surface-lowest p-6 shadow-ambient"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg font-semibold text-foreground">
                        {entry.job_title || "Evaluation"}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-low px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        {entry.mode === "tailoring" ? (
                          <>
                            <Sparkles className="h-2.5 w-2.5" /> TAILORING
                          </>
                        ) : (
                          <>
                            <BarChart3 className="h-2.5 w-2.5" /> ANALYSIS
                          </>
                        )}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4" />
                      <span>{new Date(entry.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-3xl font-bold text-foreground">
                      {entry.overall_score}
                    </span>
                    <p className="label-sm text-muted-foreground">SCORE</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="label-sm text-muted-foreground">
                NO EVALUATIONS YET
              </p>
              <p className="mt-3 text-muted-foreground">
                Complete your first ATS evaluation to see it here.
              </p>
            </div>
          )
        ) : fallbackList.length > 0 ? (
          <div className="mt-10 space-y-4">
            {fallbackList.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex items-center justify-between gap-4 rounded-2xl bg-surface-lowest p-6 shadow-ambient"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {entry.jobTitleHint || "New evaluation"}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-foreground">
                    {entry.result.overallScore}
                  </span>
                  <p className="label-sm text-muted-foreground">SCORE</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="label-sm text-muted-foreground">NO EVALUATIONS YET</p>
            <p className="mt-3 text-muted-foreground">
              Complete your first ATS evaluation to see it here.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
