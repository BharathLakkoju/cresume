"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Types (matching the AI response schema) ─────────────────────────── */

export interface TailoredResume {
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
}

export interface TailoringResult {
  atsScore?: number;
  issues: Array<{ section: string; issue: string; severity: string }>;
  tailoredResume: TailoredResume;
  changesApplied: Array<{
    section: string;
    what: string;
    why: string;
  }>;
  format?: "pdf" | "docx";
  processingMs?: number;
}

type Tab = "preview" | "issues" | "changes";

/* ─────────────────────────────────────────────────────────── helpers ── */

function severityColor(s: string) {
  if (s === "high") return "bg-red-100 text-red-700";
  if (s === "medium") return "bg-amber-100 text-amber-700";
  return "bg-surface-low text-muted-foreground";
}

/** Build an HTML string for the resume — used for the print-PDF window */
function buildResumeHTML(r: TailoredResume): string {
  const contact = [
    r.contact?.email,
    r.contact?.phone,
    r.contact?.location,
    r.contact?.linkedin
      ? `<a href="${r.contact.linkedin}" style="color:#111">${r.contact.linkedin}</a>`
      : "",
    r.contact?.github
      ? `<a href="${r.contact.github}" style="color:#111">${r.contact.github}</a>`
      : "",
  ]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");

  const experienceHTML = (r.experience ?? [])
    .map(
      (exp) => `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <span style="font-weight:700">${exp.company}</span>
        <span style="font-size:11px;color:#666">${exp.dates}</span>
      </div>
      <div style="font-style:italic;font-size:12px;color:#444;margin-bottom:4px">${exp.title}${exp.location ? " — " + exp.location : ""}</div>
      <ul style="margin:4px 0 0 16px;padding:0">${(exp.bullets ?? []).map((b) => `<li style="font-size:12px;line-height:1.65;margin-bottom:2px">${b}</li>`).join("")}</ul>
    </div>`,
    )
    .join("");

  const skillsHTML = (r.skills ?? [])
    .map(
      (s) =>
        `<div style="margin-bottom:5px"><span style="font-weight:600;font-size:12px">${s.category}:</span> <span style="font-size:12px">${(s.items ?? []).join(", ")}</span></div>`,
    )
    .join("");

  const projectsHTML = (r.projects ?? [])
    .map(
      (p) => `
    <div style="margin-bottom:12px">
      <div style="font-weight:700;font-size:12px">${p.name}${p.tech ? ` <span style="font-weight:400;color:#555">— ${p.tech}</span>` : ""}${p.link ? ` <a href="${p.link}" style="color:#111;font-size:11px">[link]</a>` : ""}</div>
      <ul style="margin:4px 0 0 16px;padding:0">${(p.bullets ?? []).map((b) => `<li style="font-size:12px;line-height:1.65;margin-bottom:2px">${b}</li>`).join("")}</ul>
    </div>`,
    )
    .join("");

  const educationHTML = (r.education ?? [])
    .map(
      (e) => `
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <div><span style="font-weight:700;font-size:12px">${e.institution}</span><span style="font-size:12px;color:#555"> — ${e.degree}</span></div>
      <div style="font-size:11px;color:#666">${e.year}${e.gpa ? " · " + e.gpa : ""}</div>
    </div>`,
    )
    .join("");

  const certsHTML =
    (r.certifications ?? []).length > 0
      ? `<p style="font-size:12px">${(r.certifications ?? []).join(" &nbsp;·&nbsp; ")}</p>`
      : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${r.name ?? "Resume"} — Tailored Resume</title>
<style>
  body{font-family:"Times New Roman",Georgia,serif;max-width:760px;margin:40px auto;color:#111;line-height:1.4}
  h1{font-size:22px;font-weight:700;margin:0 0 4px}
  .contact{font-size:11px;color:#555;margin-bottom:18px}
  h2{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border-bottom:1.5px solid #111;padding-bottom:3px;margin:18px 0 10px}
  @media print{body{margin:20px}button{display:none}}
</style></head><body>
<h1>${r.name ?? ""}</h1>
<div class="contact">${contact}</div>
${r.summary ? `<h2>Professional Summary</h2><p style="font-size:12px;line-height:1.7">${r.summary}</p>` : ""}
${experienceHTML ? `<h2>Experience</h2>${experienceHTML}` : ""}
${skillsHTML ? `<h2>Skills</h2>${skillsHTML}` : ""}
${projectsHTML ? `<h2>Projects</h2>${projectsHTML}` : ""}
${educationHTML ? `<h2>Education</h2>${educationHTML}` : ""}
${certsHTML ? `<h2>Certifications</h2>${certsHTML}` : ""}
</body></html>`;
}

/* ─────────────────────────────────── download helpers ── */

async function downloadPDF(r: TailoredResume) {
  // Dynamically import jsPDF and html2canvas
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  // Create an off-screen container with the resume HTML
  const container = document.createElement("div");
  container.innerHTML = buildResumeHTML(r);
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // ~A4 width at 96dpi
  document.body.appendChild(container);

  // Wait for the HTML to render
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // Get the body inside the iframe-like container
    const body = container.querySelector("body") ?? container;

    const canvas = await html2canvas(body as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    let heightRemaining = imgHeight;

    // Add pages as needed for long resumes
    while (heightRemaining > 0) {
      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
      heightRemaining -= pdfHeight - 20;
      if (heightRemaining > 0) {
        pdf.addPage();
        yPosition = -((imgHeight - heightRemaining) - 10);
      }
    }

    const fileName = `${(r.name ?? "Resume").replace(/\s+/g, "_")}_Tailored.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

async function downloadDOCX(r: TailoredResume) {
  const {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Packer,
    UnderlineType,
  } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];

  // Name
  children.push(
    new Paragraph({
      children: [new TextRun({ text: r.name ?? "", bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
    }),
  );

  // Contact
  const contactLine = [
    r.contact?.email,
    r.contact?.phone,
    r.contact?.location,
    r.contact?.linkedin,
    r.contact?.github,
  ]
    .filter(Boolean)
    .join("  ·  ");
  if (contactLine) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactLine, size: 18, color: "555555" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    );
  }

  const sectionHeading = (text: string) =>
    new Paragraph({
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 22,
          underline: { type: UnderlineType.SINGLE },
        }),
      ],
      spacing: { before: 240, after: 100 },
    });

  // Summary
  if (r.summary) {
    children.push(sectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: r.summary, size: 20 })],
        spacing: { after: 100 },
      }),
    );
  }

  // Experience
  if ((r.experience ?? []).length > 0) {
    children.push(sectionHeading("Experience"));
    for (const exp of r.experience ?? []) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, bold: true, size: 22 }),
            new TextRun({ text: `  ${exp.dates}`, size: 18, color: "666666" }),
          ],
        }),
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.title}${exp.location ? " — " + exp.location : ""}`,
              italics: true,
              size: 20,
            }),
          ],
          spacing: { after: 60 },
        }),
      );
      for (const bullet of exp.bullets ?? []) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: bullet, size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 40 },
          }),
        );
      }
    }
  }

  // Skills
  if ((r.skills ?? []).length > 0) {
    children.push(sectionHeading("Skills"));
    for (const s of r.skills ?? []) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${s.category}: `, bold: true, size: 20 }),
            new TextRun({ text: (s.items ?? []).join(", "), size: 20 }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
  }

  // Projects
  if ((r.projects ?? []).length > 0) {
    children.push(sectionHeading("Projects"));
    for (const p of r.projects ?? []) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name, bold: true, size: 22 }),
            ...(p.tech
              ? [new TextRun({ text: `  — ${p.tech}`, size: 18, color: "555555" })]
              : []),
          ],
        }),
      );
      for (const b of p.bullets ?? []) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: b, size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 40 },
          }),
        );
      }
    }
  }

  // Education
  if ((r.education ?? []).length > 0) {
    children.push(sectionHeading("Education"));
    for (const e of r.education ?? []) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.institution, bold: true, size: 22 }),
            new TextRun({ text: `  ${e.year}${e.gpa ? " · " + e.gpa : ""}`, size: 18, color: "666666" }),
          ],
        }),
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: e.degree, italics: true, size: 20 })],
          spacing: { after: 80 },
        }),
      );
    }
  }

  // Certifications
  if ((r.certifications ?? []).length > 0) {
    children.push(sectionHeading("Certifications"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: (r.certifications ?? []).join("  ·  "), size: 20 })],
      }),
    );
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(r.name ?? "resume").replace(/\s+/g, "_")}_tailored.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────── main component ── */

export function TailoringDashboard({ result }: { result: TailoringResult }) {
  const [tab, setTab] = useState<Tab>("preview");
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

  const resume = result.tailoredResume ?? ({} as TailoredResume);
  const issues = result.issues ?? [];
  const changes = result.changesApplied ?? [];

  const highCount = issues.filter((i) => i.severity === "high").length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "preview", label: "Tailored Resume" },
    { id: "issues", label: `Issues Found (${issues.length})` },
    { id: "changes", label: `Changes Made (${changes.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-foreground p-6 sm:p-8 text-primary-foreground"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="label-sm text-white/50">RESUME TAILORING COMPLETE</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              {resume.name ?? "Your Resume"}
            </h2>
            <p className="mt-2 text-sm text-white/60">
              {highCount > 0
                ? `${highCount} critical issue${highCount > 1 ? "s" : ""} fixed · ready to download`
                : `${changes.length} improvements applied · ready to download`}
            </p>
            {result.atsScore != null && (
              <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5">
                <span className="font-display text-3xl font-black text-white">{result.atsScore}%</span>
                <div>
                  <p className="text-xs font-semibold text-white/80">ATS MATCH SCORE</p>
                  <p className="text-[10px] text-white/50">Predicted keyword match</p>
                </div>
              </div>
            )}
          </div>

          {/* Download button — single format based on user choice */}
          <div className="flex shrink-0 gap-3">
            {result.format === "docx" ? (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-white/10 text-white hover:bg-white/20 border-0"
                disabled={isDownloadingDocx}
                onClick={async () => {
                  setIsDownloadingDocx(true);
                  try {
                    await downloadDOCX(resume);
                  } finally {
                    setIsDownloadingDocx(false);
                  }
                }}
              >
                <Download className="h-4 w-4" />
                {isDownloadingDocx ? "Building…" : "Download DOCX"}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-white/10 text-white hover:bg-white/20 border-0"
                disabled={isDownloadingPdf}
                onClick={async () => {
                  setIsDownloadingPdf(true);
                  try {
                    await downloadPDF(resume);
                  } finally {
                    setIsDownloadingPdf(false);
                  }
                }}
              >
                <FileText className="h-4 w-4" />
                {isDownloadingPdf ? "Building…" : "Download PDF"}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-xl bg-surface-low p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
              tab === t.id
                ? "bg-foreground text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Tab: Tailored Resume Preview ──────────────────────────── */}
        {tab === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="lg:max-h-[70vh] lg:overflow-y-auto lg:rounded-2xl"
          >
            <ResumePreview resume={resume} />
          </motion.div>
        )}

        {/* ── Tab: Issues Found ─────────────────────────────────────── */}
        {tab === "issues" && (
          <motion.div
            key="issues"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {issues.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No issues recorded.
              </p>
            )}
            {issues.map((issue, i) => (
              <div
                key={i}
                className="rounded-xl border border-surface-highest bg-surface-lowest p-5"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      issue.severity === "high"
                        ? "text-red-500"
                        : issue.severity === "medium"
                          ? "text-amber-500"
                          : "text-muted-foreground",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {issue.section}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          severityColor(issue.severity),
                        )}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {issue.issue}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setExpandedIssues((prev) => {
                        const next = new Set(prev);
                        next.has(i) ? next.delete(i) : next.add(i);
                        return next;
                      });
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {expandedIssues.has(i) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {expandedIssues.has(i) && (
                  <div className="mt-3 ml-7 rounded-lg bg-surface-low p-3">
                    <p className="text-xs text-muted-foreground">
                      This issue has been fixed in the tailored resume shown in
                      the <strong>Tailored Resume</strong> tab.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Tab: Changes Made ─────────────────────────────────────── */}
        {tab === "changes" && (
          <motion.div
            key="changes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {changes.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No changes recorded.
              </p>
            )}
            {changes.map((change, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-surface-highest bg-surface-lowest p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {change.section}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {change.what}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {change.why}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────── ResumePreview sub-component ── */

function ResumePreview({ resume }: { resume: TailoredResume }) {
  const contact = [
    resume.contact?.email,
    resume.contact?.phone,
    resume.contact?.location,
    resume.contact?.linkedin,
    resume.contact?.github,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="rounded-2xl border border-surface-highest bg-white p-6 sm:p-10 shadow-ambient">
      {/* Name + contact */}
      <div className="border-b border-gray-200 pb-5 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {resume.name}
        </h1>
        {contact && (
          <p className="mt-1 text-xs text-gray-500 wrap-break-word">{contact}</p>
        )}
      </div>

      {/* Summary */}
      {resume.summary && (
        <ResumeSection title="Professional Summary">
          <p className="text-sm leading-7 text-gray-700">{resume.summary}</p>
        </ResumeSection>
      )}

      {/* Experience */}
      {(resume.experience ?? []).length > 0 && (
        <ResumeSection title="Experience">
          <div className="space-y-5">
            {(resume.experience ?? []).map((exp, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="font-semibold text-gray-900">{exp.company}</span>
                  <span className="text-xs text-gray-500">{exp.dates}</span>
                </div>
                <p className="text-sm italic text-gray-600">
                  {exp.title}
                  {exp.location ? ` — ${exp.location}` : ""}
                </p>
                <ul className="mt-2 space-y-1.5 pl-4">
                  {(exp.bullets ?? []).map((b, j) => (
                    <li
                      key={j}
                      className="list-disc text-sm leading-6 text-gray-700"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {/* Skills */}
      {(resume.skills ?? []).length > 0 && (
        <ResumeSection title="Skills">
          <div className="space-y-2">
            {(resume.skills ?? []).map((s, i) => (
              <div key={i} className="flex flex-wrap gap-x-1 text-sm">
                <span className="font-semibold text-gray-900">{s.category}:</span>
                <span className="text-gray-700">{(s.items ?? []).join(", ")}</span>
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {/* Projects */}
      {(resume.projects ?? []).length > 0 && (
        <ResumeSection title="Projects">
          <div className="space-y-4">
            {(resume.projects ?? []).map((p, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  {p.tech && (
                    <span className="text-xs text-gray-500">— {p.tech}</span>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      className="text-xs text-gray-500 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.link}
                    </a>
                  )}
                </div>
                <ul className="mt-1.5 space-y-1.5 pl-4">
                  {(p.bullets ?? []).map((b, j) => (
                    <li key={j} className="list-disc text-sm leading-6 text-gray-700">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {/* Education */}
      {(resume.education ?? []).length > 0 && (
        <ResumeSection title="Education">
          <div className="space-y-3">
            {(resume.education ?? []).map((e, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-2">
                <div>
                  <span className="font-semibold text-gray-900">{e.institution}</span>
                  <span className="text-sm text-gray-600"> — {e.degree}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {e.year}
                  {e.gpa ? ` · ${e.gpa}` : ""}
                </span>
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {/* Certifications */}
      {(resume.certifications ?? []).length > 0 && (
        <ResumeSection title="Certifications">
          <div className="flex flex-wrap gap-2">
            {(resume.certifications ?? []).map((c, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {c}
              </span>
            ))}
          </div>
        </ResumeSection>
      )}

      {/* Download CTA at bottom of preview */}
      <div className="mt-8 flex flex-col items-center gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-center">
        <CheckCircle2 className="h-4 w-4 text-foreground" />
        <span className="text-sm text-muted-foreground">
          Use the <strong>PDF</strong> or <strong>DOCX</strong> buttons above to download this resume.
        </span>
      </div>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 border-b border-gray-300 pb-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
        {title}
      </h2>
      {children}
    </div>
  );
}
