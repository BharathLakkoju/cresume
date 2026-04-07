import { NextResponse } from "next/server";

import { parseResumeFile } from "@/lib/ats/parser";
import type { AtsEvaluationResult, ScoreBreakdown } from "@/lib/ats/types";
import { callOpenRouter, parseJsonFromModel } from "@/lib/openrouter/client";
import { ANALYSIS_SYSTEM_PROMPT, summarizeInputs } from "@/lib/openrouter/prompts";
import { serverEvaluationSchema } from "@/lib/validations/evaluation";
import { getCurrentUser } from "@/lib/supabase/auth-helpers";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const FREE_USE_LIMIT = 2;

type UsageClient =
  | NonNullable<ReturnType<typeof getSupabaseServiceClient>>
  | NonNullable<Awaited<ReturnType<typeof getSupabaseServerClient>>>;

/**
 * POST /api/evaluate
 *
 * Accepts a resume file + job description text.
 * Sends both to OpenRouter for a COMPLETE AI-driven ATS evaluation.
 * No local scoring engine — the AI is the sole source of truth.
 */
export async function POST(request: Request) {
  const start = Date.now();
  let anonymousUsageContext: {
    ip: string;
    currentCount: number;
    client: UsageClient;
  } | null = null;

  try {
    /* ── 1. Parse multipart form ──────────────────────────────── */
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const rawJd = formData.get("jdText") as string | null;

    if (!resumeFile || !rawJd) {
      return NextResponse.json(
        { error: "Resume file and job description are required." },
        { status: 400 }
      );
    }

    /* ── 2. Validate JD ──────────────────────────────────────── */
    const parsed = serverEvaluationSchema.safeParse({ jdText: rawJd });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid job description." },
        { status: 400 }
      );
    }
    const jdText = parsed.data.jdText;

    /* ── 3. Rate-limit gate (IP-based for anonymous users) ──── */
    const user = await getCurrentUser();
    if (!user) {
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0]?.trim() || "unknown";
      const usageClient =
        getSupabaseServiceClient() ?? (await getSupabaseServerClient());

      if (usageClient) {
        const { data: row } = await usageClient
          .from("ip_usage")
          .select("use_count")
          .eq("ip_address", ip)
          .maybeSingle();

        if (row && row.use_count >= FREE_USE_LIMIT) {
          return NextResponse.json(
            { error: "FREE_LIMIT_REACHED", usesLeft: 0 },
            { status: 403 }
          );
        }

        // Defer counting usage until a successful AI response is produced.
        anonymousUsageContext = {
          ip,
          currentCount: row?.use_count ?? 0,
          client: usageClient,
        };
      }
    }

    /* ── 4. Parse resume to text ──────────────────────────────── */
    let resumeText: string;
    try {
      resumeText = await parseResumeFile(resumeFile);
    } catch (parseError) {
      return NextResponse.json(
        {
          error:
            parseError instanceof Error
              ? parseError.message
              : "Failed to parse resume file."
        },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the resume. Ensure the PDF contains selectable text (not a scanned image)." },
        { status: 400 }
      );
    }

    /* ── 5. Call AI for COMPLETE evaluation ───────────────────── */
    const { resume: trimmedResume, jd: trimmedJd } = summarizeInputs(resumeText, jdText);
    const userMessage = `## RESUME\n\n${trimmedResume}\n\n---\n\n## JOB DESCRIPTION\n\n${trimmedJd}`;

    // ── DEBUG: log the exact payload being sent to the AI ─────────────
    console.log("\n========== [evaluate] FULL USER MESSAGE TO AI ================");
    console.log(userMessage);
    console.log("==============================================================\n");

    let aiRawResponse: string | null;
    try {
      aiRawResponse = await callOpenRouter(
        ANALYSIS_SYSTEM_PROMPT,
        userMessage,
        undefined, // use default model
        30_000,    // 30s timeout — streaming handles the rest
        3000       // reduced for faster completion
      );
    } catch (configError) {
      // API key not configured
      return NextResponse.json(
        { error: "AI service is not configured. Please set OPENROUTER_API_KEY." },
        { status: 503 }
      );
    }

    if (!aiRawResponse) {
      return NextResponse.json(
        {
          error: "AI analysis is temporarily unavailable. Our servers are processing high demand — please try again in a moment.",
          retryable: true
        },
        { status: 503 }
      );
    }

    if (anonymousUsageContext) {
      await anonymousUsageContext.client.from("ip_usage").upsert(
        {
          ip_address: anonymousUsageContext.ip,
          use_count: anonymousUsageContext.currentCount + 1,
          last_used_at: new Date().toISOString()
        },
        { onConflict: "ip_address" }
      );
    }

    /* ── 6. Parse and validate AI response ───────────────────── */
    interface AiEvaluation {
      overallScore: number;
      breakdown: ScoreBreakdown;
      missingKeywords: string[];
      resumeGaps: Array<{ label: string; detail: string }>;
      suggestions: Array<{ title: string; detail: string; priority: string }>;
      matchedSkills: string[];
      unmatchedSkills: string[];
      detectedRole: string | null;
      aiInsight: string | null;
    }

    const aiResult = parseJsonFromModel<AiEvaluation>(aiRawResponse);

    if (!aiResult || typeof aiResult.overallScore !== "number" || !aiResult.breakdown) {
      console.error("[evaluate] AI returned invalid evaluation structure:", aiRawResponse.slice(0, 500));
      return NextResponse.json(
        {
          error: "AI returned an unexpected response format. Please try again.",
          retryable: true
        },
        { status: 502 }
      );
    }

    /* ── 7. Build final result ───────────────────────────────── */
    const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

    const result: AtsEvaluationResult = {
      overallScore: clamp(aiResult.overallScore),
      breakdown: {
        keywordMatch: clamp(aiResult.breakdown.keywordMatch ?? 0),
        semanticMatch: clamp(aiResult.breakdown.semanticMatch ?? 0),
        skillsAlignment: clamp(aiResult.breakdown.skillsAlignment ?? 0),
        experienceRelevance: clamp(aiResult.breakdown.experienceRelevance ?? 0),
        formattingReadability: clamp(aiResult.breakdown.formattingReadability ?? 0)
      },
      missingKeywords: Array.isArray(aiResult.missingKeywords) ? aiResult.missingKeywords : [],
      resumeGaps: Array.isArray(aiResult.resumeGaps) ? aiResult.resumeGaps : [],
      suggestions: Array.isArray(aiResult.suggestions)
        ? aiResult.suggestions.map((s) => ({
            title: s.title || "Suggestion",
            detail: s.detail || "",
            priority: (["high", "medium", "low"].includes(s.priority) ? s.priority : "medium") as "high" | "medium" | "low"
          }))
        : [],
      matchedSkills: Array.isArray(aiResult.matchedSkills) ? aiResult.matchedSkills : [],
      unmatchedSkills: Array.isArray(aiResult.unmatchedSkills) ? aiResult.unmatchedSkills : [],
      detectedRole: aiResult.detectedRole ?? null,
      aiInsight: aiResult.aiInsight ?? null,
      generatedAt: new Date().toISOString(),
      processingMs: Date.now() - start
    };

    /* ── 8. Save metadata for authenticated users ─────────────── */
    if (user) {
      const service = getSupabaseServiceClient();
      if (service) {
        await service
          .from("user_evaluations")
          .insert({
            user_id: user.id,
            job_title: result.detectedRole,
            overall_score: result.overallScore,
            breakdown: result.breakdown,
            suggestions: result.suggestions,
            missing_keywords: result.missingKeywords,
            matched_skills: result.matchedSkills,
            mode: "analysis"
          })
          .then(({ error }) => {
            if (error) console.error("[evaluate] Failed to save evaluation:", error.message);
          });
      }
    }

    console.log(`[evaluate] AI-only evaluation completed in ${result.processingMs}ms | score: ${result.overallScore}`);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[evaluate] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", retryable: true },
      { status: 500 }
    );
  }
}
