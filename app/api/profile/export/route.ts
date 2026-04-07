import { NextResponse } from "next/server";

import { getAuthenticatedClient } from "@/lib/supabase/auth-helpers";

export const maxDuration = 10;

interface ExportEvaluationRow {
  id: string;
  job_title: string | null;
  overall_score: number;
  breakdown: Record<string, unknown> | null;
  suggestions: unknown[] | null;
  missing_keywords: string[] | null;
  matched_skills: string[] | null;
  mode: string;
  created_at: string;
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) return false;

  const message = (error.message ?? "").toLowerCase();
  return (
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    message.includes("could not find the table")
  );
}

export async function GET() {
  const auth = await getAuthenticatedClient();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { supabase, user } = auth;

  const [profileResult, evaluationsResult] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("user_evaluations")
      .select(
        "id, job_title, overall_score, breakdown, suggestions, missing_keywords, matched_skills, mode, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.error) {
    console.error("[profile/export] Failed to load profile:", profileResult.error.message);
    return NextResponse.json({ error: "Failed to export profile data" }, { status: 500 });
  }

  if (evaluationsResult.error && !isMissingTableError(evaluationsResult.error)) {
    console.error(
      "[profile/export] Failed to load evaluations:",
      evaluationsResult.error.message,
    );
    return NextResponse.json({ error: "Failed to export profile data" }, { status: 500 });
  }

  if (evaluationsResult.error && isMissingTableError(evaluationsResult.error)) {
    console.warn(
      "[profile/export] user_evaluations table missing; exporting without evaluation history.",
    );
  }

  const evaluations = isMissingTableError(evaluationsResult.error)
    ? []
    : ((evaluationsResult.data ?? []) as ExportEvaluationRow[]).map((entry) => ({
        id: entry.id,
        jobTitle: entry.job_title,
        overallScore: entry.overall_score,
        breakdown: entry.breakdown ?? {},
        suggestions: entry.suggestions ?? [],
        missingKeywords: entry.missing_keywords ?? [],
        matchedSkills: entry.matched_skills ?? [],
        mode: entry.mode,
        createdAt: entry.created_at,
      }));

  return NextResponse.json({
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    counts: {
      evaluations: evaluations.length,
      hasProfile: Boolean(profileResult.data),
    },
    profile: profileResult.data,
    evaluations,
  });
}