/**
 * ATS evaluation types.
 *
 * All scoring is done by the AI (OpenRouter). No local scoring engine exists.
 * These types define the structured schemas the AI must return.
 */

export type ScoreKey =
  | "keywordMatch"
  | "semanticMatch"
  | "skillsAlignment"
  | "experienceRelevance"
  | "formattingReadability";

export type ScoreBreakdown = Record<ScoreKey, number>;

export interface AtsSuggestion {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export interface AtsGap {
  label: string;
  detail: string;
}

export interface AtsEvaluationResult {
  overallScore: number;
  breakdown: ScoreBreakdown;
  missingKeywords: string[];
  resumeGaps: AtsGap[];
  suggestions: AtsSuggestion[];
  matchedSkills: string[];
  unmatchedSkills: string[];
  detectedRole: string | null;
  aiInsight: string | null;
  generatedAt: string;
  processingMs: number;
}
