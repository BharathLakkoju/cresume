"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { FileUp, ShieldCheck, Sparkles } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { ProcessingState } from "@/components/site/processing-state";
import { ResultsDashboard } from "@/components/site/results-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientEvaluationSchema } from "@/lib/validations/evaluation";
import { useEvaluationStore } from "@/store/evaluation-store";

const stageCount = 4;

export function EvaluatorSection() {
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { latestResult, history, setLatestResult } = useEvaluationStore();

  useEffect(() => {
    if (!isSubmitting) return;

    const timer = window.setInterval(() => {
      setActiveStage((current) =>
        current < stageCount - 1 ? current + 1 : current,
      );
    }, 520);

    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  const helperText = useMemo(() => {
    if (!resumeFile) return "Upload a PDF or DOCX up to 5 MB.";
    return `${resumeFile.name} · ${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB`;
  }, [resumeFile]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = clientEvaluationSchema.safeParse({
      jdText,
      resumeFileName: resumeFile?.name ?? "",
      resumeFileSize: resumeFile?.size ?? 0,
    });

    if (!resumeFile) {
      setError("Upload a resume before starting the evaluation.");
      return;
    }

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          "Please correct the inputs and try again.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setActiveStage(0);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jdText", jdText);

      const response = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Evaluation failed.");
      }

      setLatestResult(
        payload.result.detectedRole ?? "ATS evaluation",
        payload.result,
      );
      setActiveStage(stageCount - 1);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while checking the ATS score.",
      );
    } finally {
      window.setTimeout(() => setIsSubmitting(false), 300);
    }
  }

  return (
    <section id="evaluator" className="py-24">
      <div className="container">
        <FadeIn className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            Evaluator
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight">
            Upload a resume, paste the JD, and run one focused ATS check.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            The evaluator validates file input, parses structured resume
            content, and returns a weighted ATS score with role-specific
            recommendations.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <FadeIn>
            <Card className="sticky top-24 border-white/80 bg-white/72">
              <CardHeader>
                <CardTitle>Check ATS Score</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="resume-upload">Resume upload</Label>
                    <label
                      htmlFor="resume-upload"
                      className="flex cursor-pointer flex-col gap-3 border border-dashed border-border bg-[#fffaf2] p-5 transition hover:border-primary/50 hover:bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                          <FileUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Drop resume or browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PDF or DOCX only
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {helperText}
                      </p>
                    </label>
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.docx"
                      className="sr-only"
                      onChange={(event) =>
                        setResumeFile(event.target.files?.[0] ?? null)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jd-text">Job description</Label>
                    <Textarea
                      id="jd-text"
                      value={jdText}
                      maxLength={12000}
                      onChange={(event) => setJdText(event.target.value)}
                      placeholder="Paste the full job description here so the evaluator can extract role, keyword, and skills signals."
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Minimum 120 characters for reliable matching</span>
                      <span>{jdText.length}/12000</span>
                    </div>
                  </div>

                  <div className="grid gap-3 border border-border bg-[#fffaf2] p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>
                        Zod input validation on both client and API route
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>
                        Local history now, Supabase sync ready after env setup
                      </span>
                    </div>
                  </div>

                  {error ? (
                    <p className="text-sm font-medium text-destructive">
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Evaluating..." : "Check ATS Score"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <ProcessingState activeStage={activeStage} />
                </motion.div>
              ) : latestResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <ResultsDashboard result={latestResult} history={history} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="panel-grid overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(255,248,233,0.84)_100%)]">
                    <CardHeader>
                      <CardTitle>Results dashboard preview</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-2">
                      <div className="border border-border bg-white/75 p-6">
                        <p className="text-sm uppercase tracking-[0.16em] text-primary">
                          Expected output
                        </p>
                        <p className="mt-4 font-display text-6xl font-semibold text-foreground">
                          72
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          ATS score out of 100 with weighted fit analysis.
                        </p>
                      </div>
                      <div className="space-y-4 border border-border bg-white/75 p-6">
                        <div>
                          <p className="font-medium text-foreground">
                            Breakdown
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Keyword fit, semantic match, skills, experience,
                            formatting.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Action plan
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Missing keywords, resume gaps, and role-specific
                            improvement suggestions.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">History</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Stored locally now and designed for authenticated
                            Supabase persistence.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
