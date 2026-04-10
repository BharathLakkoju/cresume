"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type DragEvent,
  useCallback,
  SetStateAction,
} from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  FileUp,
  Shield,
  Clipboard,
  X,
  ScanSearch,
  Wand2,
  CheckCircle2,
  FileText,
  PenLine,
} from "lucide-react";

import { ProcessingState } from "@/components/site/processing-state";
import { ResultsDashboard } from "@/components/site/results-dashboard";
import { TailoringDashboard } from "@/components/site/tailoring-dashboard";
import type { TailoringResult } from "@/components/site/tailoring-dashboard";
import { ResumeBuilderForm } from "@/components/site/resume-builder-form";
import { AuthGateModal } from "@/components/site/auth-gate-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { clientEvaluationSchema } from "@/lib/validations/evaluation";
import { useEvaluationStore } from "@/store/evaluation-store";

type Mode = "analysis" | "tailoring" | "builder";
type FileStatus = "idle" | "selected" | "ready";
type ExportFormat = "pdf" | "docx";

const stageCount = 4;

export default function UploadPage() {
  const [mode, setMode] = useState<Mode>("analysis");
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tailoringResult, setTailoringResult] =
    useState<TailoringResult | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Global paste — catch pasted files from file explorer / screenshots
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const files = event.clipboardData?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".docx")) {
        setResumeFile(file);
        setFileStatus("selected");
        setTimeout(() => setFileStatus("ready"), 900);
        event.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setResumeFile(file);
      setFileStatus("selected");
      setTimeout(() => setFileStatus("ready"), 900);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setResumeFile(file);
      setFileStatus("selected");
      setTimeout(() => setFileStatus("ready"), 900);
    }
  }

  function clearResume() {
    setResumeFile(null);
    setFileStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setShowResults(false);
    setTailoringResult(null);

    if (!resumeFile) {
      setError("Upload a resume before starting the evaluation.");
      return;
    }

    if (mode === "analysis") {
      const parsed = clientEvaluationSchema.safeParse({
        jdText,
        resumeFileName: resumeFile.name,
        resumeFileSize: resumeFile.size,
      });
      if (!parsed.success) {
        setError(
          parsed.error.issues[0]?.message ??
            "Please correct the inputs and try again.",
        );
        return;
      }
    } else {
      if (jdText.trim().length < 120) {
        setError(
          "Paste the full job description to tailor your resume (min 120 characters).",
        );
        return;
      }
    }

    setIsSubmitting(true);
    setActiveStage(0);

    try {
      if (mode === "analysis") {
        /* ── ATS Analysis — single API call ────────────────────────── */
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jdText", jdText);

        const response = await fetch("/api/evaluate", {
          method: "POST",
          body: formData,
        });
        const payload = await response.json();

        if (response.status === 403 && payload.error === "FREE_LIMIT_REACHED") {
          setShowAuthGate(true);
          return;
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Evaluation failed.");
        }

        // The route returns the result directly (not nested under .result)
        setLatestResult(payload.detectedRole ?? "ATS evaluation", payload);
        setActiveStage(stageCount - 1);
        setShowResults(true);
      } else {
        /* ── Resume Tailoring — direct call to /api/tailor ─────────── */
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jdText", jdText);
        formData.append("format", exportFormat);

        const response = await fetch("/api/tailor", {
          method: "POST",
          body: formData,
        });
        const payload = await response.json();

        if (response.status === 403 && payload.error === "FREE_LIMIT_REACHED") {
          setShowAuthGate(true);
          return;
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Tailoring failed.");
        }

        setTailoringResult(payload);
        setActiveStage(stageCount - 1);
        setShowResults(true);
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      window.setTimeout(() => setIsSubmitting(false), 300);
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <motion.div
          key="processing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <ProcessingState
            activeStage={activeStage}
            mode={mode === "builder" ? "tailoring" : mode}
          />
        </motion.div>
      </div>
    );
  }

  if (showResults && mode === "analysis" && latestResult) {
    return (
      <div className="p-4 sm:p-6 lg:p-10">
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowResults(false);
                setTailoringResult(null);
              }}
            >
              ← New Analysis
            </Button>
            <ModeToggle
              mode={mode}
              onChange={(m) => {
                setMode(m);
                setShowResults(false);
              }}
            />
          </div>
          <ResultsDashboard result={latestResult} history={history} />
        </motion.div>
      </div>
    );
  }

  if (
    showResults &&
    (mode === "tailoring" || mode === "builder") &&
    tailoringResult
  ) {
    return (
      <div className="p-4 sm:p-6 lg:p-10">
        <motion.div
          key="tailor-result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowResults(false);
                setTailoringResult(null);
              }}
            >
              ← {mode === "builder" ? "New Build" : "New Tailoring"}
            </Button>
            <ModeToggle
              mode={mode}
              onChange={(m) => {
                setMode(m);
                setShowResults(false);
              }}
            />
          </div>
          <TailoringDashboard result={tailoringResult} />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
      <div className="p-4 sm:p-6 lg:p-10 max-lg:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="label-sm text-center text-muted-foreground">
            ENGINEERED FOR CLARITY
          </p>
          <h1 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Analyze your impact.
          </h1>
          <p className="mt-4 text-center text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Upload your professional profile and paste the target role
            description. Our precision engine maps your experience against
            market requirements in real-time.
          </p>

          <div className="mt-8 flex justify-center">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>

          {mode === "builder" && (
            <div className="mt-6">
              <ResumeBuilderForm
                onResult={(result: SetStateAction<TailoringResult | null>) => {
                  setTailoringResult(result);
                  setShowResults(true);
                }}
                onAuthGate={() => setShowAuthGate(true)}
              />
            </div>
          )}

          {mode !== "builder" && (
            <form onSubmit={onSubmit} className="mt-6">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Resume Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="label-sm flex items-center gap-2 text-foreground">
                      <FileUp className="h-4 w-4" />
                      RESUME UPLOAD
                    </Label>
                    <span className="label-sm text-muted-foreground">
                      MAX 5MB · PDF, DOCX
                    </span>
                  </div>

                  <label
                    htmlFor="resume-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-8 sm:p-12 transition-all duration-300 ${
                      fileStatus === "ready"
                        ? "border-foreground/40 bg-surface-low"
                        : fileStatus === "selected"
                          ? "border-foreground/20 bg-surface-low"
                          : isDragging
                            ? "border-foreground bg-surface-highest"
                            : "border-surface-highest bg-surface-low hover:border-muted-foreground hover:bg-surface-lowest"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {fileStatus === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="flex h-12 w-12 items-center justify-center bg-foreground text-white">
                            <FileUp className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <p className="font-display font-semibold text-foreground">
                              {isDragging
                                ? "Release to upload"
                                : "Drop resume here"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              or tap to browse your files
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {fileStatus === "selected" && (
                        <motion.div
                          key="selected"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.2,
                              ease: "easeInOut",
                            }}
                            className="flex h-12 w-12 items-center justify-center bg-surface-highest"
                          >
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </motion.div>
                          <div className="text-center">
                            <p className="font-display font-semibold text-foreground">
                              {resumeFile?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Reading file…
                            </p>
                          </div>
                          <div className="h-1 w-40 overflow-hidden bg-surface-highest">
                            <motion.div
                              className="h-full bg-foreground"
                              initial={{ width: "0%" }}
                              animate={{ width: "80%" }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {fileStatus === "ready" && resumeFile && (
                        <motion.div
                          key="ready"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className="flex h-12 w-12 items-center justify-center bg-foreground text-white"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </motion.div>
                          <div className="text-center">
                            <p className="font-display font-semibold text-foreground">
                              {resumeFile.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                              · Ready
                            </p>
                          </div>
                          <div className="h-1 w-40 overflow-hidden bg-surface-highest">
                            <motion.div
                              className="h-full bg-foreground"
                              initial={{ width: "80%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              clearResume();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 ease-out hover:bg-surface-highest hover:text-foreground"
                          >
                            <X className="h-3 w-3" /> Remove
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </label>

                  <Input
                    ref={fileInputRef}
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    className="sr-only"
                    onChange={handleFileChange}
                  />

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-surface-highest" />
                    <span className="label-sm text-muted-foreground">
                      {fileStatus === "ready"
                        ? "FILE READY"
                        : fileStatus === "selected"
                          ? "READING…"
                          : "READY FOR SCAN"}
                    </span>
                  </div>
                </div>

                {/* Job Description — fixed height, scrollable content */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="label-sm flex items-center gap-2 text-foreground">
                      <FileUp className="h-4 w-4" />
                      TARGET ROLE DESCRIPTION
                    </Label>
                    <span className="label-sm text-muted-foreground">
                      {jdText.length} / 5000 CHARACTERS
                    </span>
                  </div>

                  <div className="relative h-70 bg-surface-low ring-1 ring-surface-highest focus-within:ring-foreground/30 transition-shadow">
                    <textarea
                      value={jdText}
                      maxLength={12000}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste the job description, required skills, or responsibilities here..."
                      className="h-full w-full resize-none overflow-y-auto bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5">
                      <span className="label-sm text-muted-foreground/60">
                        PRECISION MODE ACTIVE
                      </span>
                      <span className="h-1.5 w-1.5 bg-foreground/60" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-surface-highest" />
                    <span className="label-sm text-muted-foreground">
                      {mode === "analysis" ? "ATS MODE" : "TAILORING MODE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Chips + Format Selection */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="bg-surface-low p-4">
                  <p className="label-sm text-muted-foreground">LANGUAGE</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    AUTO-DETECT (EN)
                  </p>
                </div>

                {mode === "tailoring" ? (
                  <div className="bg-surface-low p-4">
                    <p className="label-sm text-muted-foreground">
                      EXPORT FORMAT
                    </p>
                    <div className="mt-2 flex gap-2">
                      {(["pdf", "docx"] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setExportFormat(fmt)}
                          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ease-out ${
                            exportFormat === fmt
                              ? "bg-foreground text-primary-foreground shadow-sm"
                              : "bg-surface-highest text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-low p-4">
                    <p className="label-sm text-muted-foreground">
                      TONE ANALYSIS
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      PROFESSIONAL
                    </p>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-sm font-medium text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  size="xl"
                  className="w-full max-w-md"
                  disabled={isSubmitting}
                >
                  <span className="flex items-center gap-2">
                    {isSubmitting
                      ? "ANALYZING..."
                      : mode === "analysis"
                        ? "ANALYZE RESUME"
                        : "TAILOR RESUME"}
                    <BarChartIcon />
                  </span>
                </Button>
                <p className="flex items-center gap-2 label-sm text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  DATA PROCESSED SECURELY. PRIVACY BY DESIGN.
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  const modes: {
    id: Mode;
    label: string;
    Icon: typeof ScanSearch;
  }[] = [
    {
      id: "analysis",
      label: "ATS Analysis",
      Icon: ScanSearch,
    },
    {
      id: "tailoring",
      label: "Resume Tailoring",
      Icon: Wand2,
    },
    {
      id: "builder",
      label: "Resume Builder",
      Icon: PenLine,
    },
  ];

  return (
    <div className="relative inline-flex w-full sm:w-auto bg-surface-low p-1 gap-0.5">
      {modes.map((m) => {
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className="relative lg:w-xs z-10 flex flex-1 items-center justify-center gap-1.5 sm:gap-2.5 px-2 sm:px-4 py-2.5 transition-all duration-200 ease-out"
          >
            {isActive && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <m.Icon
              className={`relative z-10 h-4 w-4 shrink-0 transition-colors duration-150 ${isActive ? "text-white" : "text-muted-foreground"}`}
            />
            <div className="relative z-10 text-left hidden sm:block">
              <p
                className={`text-xs font-semibold uppercase tracking-widest leading-none transition-colors duration-150 ${isActive ? "text-white" : "text-muted-foreground"}`}
              >
                {m.label}
              </p>
            </div>
            <span
              className={`relative z-10 text-[10px] font-semibold uppercase tracking-wider sm:hidden transition-colors duration-150 ${isActive ? "text-white" : "text-muted-foreground"}`}
            >
              {m.id === "analysis"
                ? "Analyze"
                : m.id === "tailoring"
                  ? "Tailor"
                  : "Build"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}
