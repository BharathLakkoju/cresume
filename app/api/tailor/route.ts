import { NextResponse } from "next/server";

import { parseResumeFile } from "@/lib/ats/parser";
import { callOpenRouter, parseJsonFromModel } from "@/lib/openrouter/client";
import { TAILORING_SYSTEM_PROMPT } from "@/lib/openrouter/prompts";
import { getCurrentUser } from "@/lib/supabase/auth-helpers";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

const FREE_USE_LIMIT = 2;

/** Shape of the AI tailoring response (must match TAILORING_SYSTEM_PROMPT output schema) */
interface TailoringResult {
  issues: Array<{ section: string; issue: string; severity: string }>;
  tailoredResume: {
    name: string;
    contact: {
      email: string;
      phone: string;
      linkedin: string;
      github: string;
      location: string;
    };
    summary: string;
    experience: Array<{
      company: string;
      title: string;
      dates: string;
      location: string;
      bullets: string[];
    }>;
    skills: Array<{ category: string; items: string[] }>;
    projects: Array<{
      name: string;
      tech: string;
      link: string;
      bullets: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      gpa: string;
    }>;
    certifications: string[];
  };
  changesApplied: Array<{
    section: string;
    what: string;
    why: string;
  }>;
}

/**
 * POST /api/tailor
 *
 * Accepts a resume file + job description text + format preference.
 * Returns the complete tailored resume from AI — no local analysis.
 */
export async function POST(request: Request) {
  const start = Date.now();
  let anonymousUsageContext: {
    ip: string;
    currentCount: number;
    service: NonNullable<ReturnType<typeof getSupabaseServiceClient>>;
  } | null = null;

  try {
    /* ── 1. Parse multipart form ──────────────────────────────── */
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const rawJd = formData.get("jdText") as string | null;
    const format = (formData.get("format") as string | null) ?? "pdf";

    if (!resumeFile || !rawJd) {
      return NextResponse.json(
        { error: "Resume file and job description are required." },
        { status: 400 }
      );
    }

    if (rawJd.trim().length < 120) {
      return NextResponse.json(
        { error: "Paste a fuller job description for accurate tailoring." },
        { status: 400 }
      );
    }

    /* ── 2. Rate-limit gate ──────────────────────────────────── */
    const user = await getCurrentUser();
    if (!user) {
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0]?.trim() || "unknown";
      const service = getSupabaseServiceClient();

      if (service) {
        const { data: row } = await service
          .from("ip_usage")
          .select("use_count")
          .eq("ip_address", ip)
          .single();

        if (row && row.use_count >= FREE_USE_LIMIT) {
          return NextResponse.json(
            { error: "FREE_LIMIT_REACHED", usesLeft: 0 },
            { status: 403 }
          );
        }

        // Defer usage increment until tailoring completes successfully.
        anonymousUsageContext = {
          ip,
          currentCount: row?.use_count ?? 0,
          service
        };
      }
    }

    /* ── 3. Parse resume to text ─────────────────────────────── */
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
        { error: "Could not extract enough text from the resume. Ensure the PDF contains selectable text." },
        { status: 400 }
      );
    }

    /* ── 4. Call AI for tailoring ─────────────────────────────── */
    const userMessage = `## RESUME\n\n${resumeText}\n\n---\n\n## JOB DESCRIPTION\n\n${rawJd.trim()}`;

    let aiRawResponse: string | null;
    try {
      aiRawResponse = await callOpenRouter(
        TAILORING_SYSTEM_PROMPT,
        userMessage,
        undefined,
        150_000, // tailoring payloads are large and free models can be slower
        4600     // keep output rich while avoiding slow oversized generations
      );
    } catch (configError) {
      return NextResponse.json(
        { error: "AI service is not configured. Please set OPENROUTER_API_KEY." },
        { status: 503 }
      );
    }

    if (!aiRawResponse) {
      return NextResponse.json(
        {
          error: "AI tailoring is temporarily unavailable. Please try again in a moment.",
          retryable: true
        },
        { status: 503 }
      );
    }

    if (anonymousUsageContext) {
      await anonymousUsageContext.service.from("ip_usage").upsert(
        {
          ip_address: anonymousUsageContext.ip,
          use_count: anonymousUsageContext.currentCount + 1,
          last_used_at: new Date().toISOString()
        },
        { onConflict: "ip_address" }
      );
    }

    /* ── 5. Parse AI response ────────────────────────────────── */
    const aiResult = parseJsonFromModel<TailoringResult>(aiRawResponse);

    if (!aiResult || !aiResult.tailoredResume) {
      console.error("[tailor] AI returned invalid structure:", aiRawResponse.slice(0, 500));
      return NextResponse.json(
        {
          error: "AI returned an unexpected response format. Please try again.",
          retryable: true
        },
        { status: 502 }
      );
    }

    /* ── 6. Save metadata for authenticated users ─────────────── */
    if (user) {
      const service = getSupabaseServiceClient();
      if (service) {
        await service
          .from("user_evaluations")
          .insert({
            user_id: user.id,
            job_title: aiResult.tailoredResume.experience?.[0]?.title ?? "Tailored Resume",
            overall_score: 0,
            breakdown: {},
            suggestions: aiResult.changesApplied ?? [],
            missing_keywords: [],
            matched_skills: [],
            mode: "tailoring"
          })
          .then(({ error }) => {
            if (error) console.error("[tailor] Failed to save evaluation:", error.message);
          });
      }
    }

    const processingMs = Date.now() - start;
    console.log(`[tailor] AI tailoring completed in ${processingMs}ms`);

    return NextResponse.json({
      ...aiResult,
      format,         // echo back the user's chosen format
      processingMs
    });
  } catch (err) {
    console.error("[tailor] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", retryable: true },
      { status: 500 }
    );
  }
}
