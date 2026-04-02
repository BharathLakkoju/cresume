"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Loader2,
  Shield,
  Wand2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProcessingState } from "@/components/site/processing-state";
import type { TailoringResult } from "@/components/site/tailoring-dashboard";

/* ─── Main component ───────────────────────────────────────────────────── */

export function ResumeBuilderForm({
  onResult,
  onAuthGate,
}: {
  onResult: (result: TailoringResult) => void;
  onAuthGate: () => void;
}) {
  const [jdText, setJdText] = useState("");
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  /* ── Check if profile exists ── */
  const checkProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const { profile } = await res.json();
      if (profile?.name) setProfileName(profile.name);
    } catch {
      // silent
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  useEffect(() => {
    if (!isSubmitting) return;
    const timer = window.setInterval(() => {
      setActiveStage((s) => (s < 3 ? s + 1 : s));
    }, 520);
    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  /* ── Submit — fetch full profile from DB then build ── */
  async function handleSubmit() {
    setError(null);

    if (!profileName) {
      setError("Save your resume details in the Profile tab first.");
      return;
    }

    if (jdText.trim().length < 120) {
      setError(
        "Paste the full job description (min 120 characters) to generate an accurate resume.",
      );
      return;
    }

    setIsSubmitting(true);
    setActiveStage(0);

    try {
      /* Fetch full profile */
      const profileRes = await fetch("/api/profile");
      if (!profileRes.ok) throw new Error("Could not load your profile.");
      const { profile } = await profileRes.json();
      if (!profile?.name)
        throw new Error("Profile is empty. Fill it in the Profile tab.");

      const resumeData = {
        name: profile.name ?? "",
        contact: {
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          linkedin: profile.linkedin ?? "",
          github: profile.github ?? "",
          location: profile.location ?? "",
        },
        summary: profile.summary ?? "",
        experience: (profile.experience ?? []).map(
          (e: {
            company?: string;
            title?: string;
            dates?: string;
            location?: string;
            bullets?: string[] | string;
          }) => ({
            company: e.company ?? "",
            title: e.title ?? "",
            dates: e.dates ?? "",
            location: e.location ?? "",
            bullets: Array.isArray(e.bullets)
              ? e.bullets
              : (e.bullets ?? "").split("\n").filter(Boolean),
          }),
        ),
        skills: (profile.skills ?? []).map(
          (s: { category?: string; items?: string[] | string }) => ({
            category: s.category ?? "",
            items: Array.isArray(s.items)
              ? s.items
              : (s.items ?? "")
                  .split(",")
                  .map((i: string) => i.trim())
                  .filter(Boolean),
          }),
        ),
        projects: (profile.projects ?? []).map(
          (p: {
            name?: string;
            tech?: string;
            link?: string;
            bullets?: string[] | string;
          }) => ({
            name: p.name ?? "",
            tech: p.tech ?? "",
            link: p.link ?? "",
            bullets: Array.isArray(p.bullets)
              ? p.bullets
              : (p.bullets ?? "").split("\n").filter(Boolean),
          }),
        ),
        education: (profile.education ?? []).map(
          (e: {
            institution?: string;
            degree?: string;
            year?: string;
            gpa?: string;
          }) => ({
            institution: e.institution ?? "",
            degree: e.degree ?? "",
            year: e.year ?? "",
            gpa: e.gpa ?? "",
          }),
        ),
        certifications: Array.isArray(profile.certifications)
          ? profile.certifications
          : [],
        awards: Array.isArray(profile.awards) ? profile.awards : [],
      };

      const response = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, jdText: jdText.trim(), format }),
      });

      const payload = await response.json();

      if (response.status === 403 && payload.error === "FREE_LIMIT_REACHED") {
        onAuthGate();
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to build resume.");
      }

      setActiveStage(3);
      onResult(payload as TailoringResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setTimeout(() => setIsSubmitting(false), 300);
    }
  }

  /* ── Processing overlay ── */
  if (isSubmitting) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <ProcessingState activeStage={activeStage} mode="tailoring" />
      </div>
    );
  }

  /* ── Loading check ── */
  if (profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      {/* Profile status */}
      {profileName ? (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          <UserCheck className="h-4 w-4 shrink-0" />
          <span>
            Building as <strong>{profileName}</strong> — details loaded from
            your saved profile.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 text-sm text-yellow-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            No profile saved.{" "}
            <Link
              href="/app/profile"
              className="underline font-semibold hover:text-yellow-300"
            >
              Go to Profile
            </Link>{" "}
            to add your resume details first.
          </span>
        </div>
      )}

      {/* JD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="label-sm flex items-center gap-2 text-foreground">
            <FileText className="h-4 w-4" />
            TARGET JOB DESCRIPTION
            <span className="text-destructive">*</span>
          </Label>
          <span className="label-sm text-muted-foreground">
            {jdText.length} / 12000
          </span>
        </div>
        <div className="relative h-56 sm:h-64 bg-surface-low ring-1 ring-surface-highest focus-within:ring-foreground/30 transition-shadow">
          <textarea
            value={jdText}
            maxLength={12000}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here. The AI will tailor your resume to match it at ≥95% ATS."
            className="h-full w-full resize-none bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5">
            <span className="label-sm text-muted-foreground/60">
              PRECISION MODE ACTIVE
            </span>
            <span className="h-1.5 w-1.5 bg-foreground/60" />
          </div>
        </div>
      </div>

      {/* Format */}
      <div className="bg-surface-low p-4">
        <p className="label-sm text-muted-foreground">EXPORT FORMAT</p>
        <div className="mt-2 flex gap-2">
          {(["pdf", "docx"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ease-out ${
                format === fmt
                  ? "bg-foreground text-primary-foreground shadow-sm"
                  : "bg-surface-highest text-muted-foreground hover:text-foreground"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="button"
        size="xl"
        className="w-full"
        onClick={handleSubmit}
        disabled={isSubmitting || !profileName}
      >
        <span className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          BUILD & OPTIMIZE RESUME
        </span>
      </Button>

      <p className="flex items-center justify-center gap-2 label-sm text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        DATA PROCESSED SECURELY. PRIVACY BY DESIGN.
      </p>
    </div>
  );
}
