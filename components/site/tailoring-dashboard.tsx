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
  awards?: string[];
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
  companyName?: string;
}

type Tab = "preview" | "issues" | "changes";

/* ─────────────────────────────────────────────────────────── helpers ── */

function severityColor(s: string) {
  if (s === "high") return "bg-red-100 text-red-700";
  if (s === "medium") return "bg-amber-100 text-amber-700";
  return "bg-surface-low text-muted-foreground";
}

/* ─────────────────────────────────── download helpers ── */

async function downloadPDF(r: TailoredResume, companyName?: string) {
  const { default: jsPDF } = await import("jspdf");

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 14;
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (need: number) => {
    if (y + need > pageH - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const addText = (
    text: string,
    opts: {
      bold?: boolean;
      italic?: boolean;
      size?: number;
      color?: number;
      x?: number;
    } = {},
  ) => {
    const {
      bold = false,
      italic = false,
      size = 10,
      color = 0,
      x = margin,
    } = opts;
    pdf.setFont(
      "helvetica",
      bold && italic
        ? "bolditalic"
        : bold
          ? "bold"
          : italic
            ? "italic"
            : "normal",
    );
    pdf.setFontSize(size);
    pdf.setTextColor(color, color, color);
    const lines = pdf.splitTextToSize(text, contentW - (x - margin));
    lines.forEach((line: string) => {
      ensureSpace(size * 0.4 + 1);
      pdf.text(line, x, y);
      y += size * 0.4 + 1;
    });
    pdf.setTextColor(0, 0, 0);
  };

  const addRightText = (text: string, baseY: number, size = 9, color = 100) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(color, color, color);
    const w = pdf.getTextWidth(text);
    pdf.text(text, pageW - margin - w, baseY);
    pdf.setTextColor(0, 0, 0);
  };

  const addSection = (title: string) => {
    ensureSpace(10);
    y += 2;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title.toUpperCase(), margin, y);
    y += 1.5;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.25);
    pdf.line(margin, y, pageW - margin, y);
    y += 3.5;
  };

  // ── Name ──
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  const nameW = pdf.getTextWidth(r.name ?? "");
  pdf.text(r.name ?? "", (pageW - nameW) / 2, y);
  y += 8;

  // ── Contact ──
  const contactParts = [
    r.contact?.email,
    r.contact?.phone,
    r.contact?.location,
    r.contact?.linkedin,
    r.contact?.github,
  ].filter(Boolean) as string[];
  if (contactParts.length > 0) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(80, 80, 80);
    const contactStr = contactParts.join("  ·  ");
    const cLines = pdf.splitTextToSize(contactStr, contentW);
    cLines.forEach((line: string) => {
      const lw = pdf.getTextWidth(line);
      pdf.text(line, (pageW - lw) / 2, y);
      y += 4.5;
    });
    pdf.setTextColor(0, 0, 0);
    y += 1;
  }

  // ── Summary ──
  if (r.summary) {
    addSection("Professional Summary");
    addText(r.summary, { size: 10 });
    y += 1;
  }

  // ── Experience ──
  if ((r.experience ?? []).length > 0) {
    addSection("Experience");
    for (const exp of r.experience ?? []) {
      ensureSpace(12);
      const rowY = y;
      addText(exp.company, { bold: true, size: 11 });
      addRightText(exp.dates, rowY, 9, 100);
      addText(`${exp.title}${exp.location ? " — " + exp.location : ""}`, {
        italic: true,
        size: 10,
      });
      for (const bullet of exp.bullets ?? []) {
        const bulletLines = pdf.splitTextToSize(bullet, contentW - 5);
        bulletLines.forEach((line: string, i: number) => {
          ensureSpace(5);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.text(i === 0 ? "•" : " ", margin, y);
          pdf.text(line, margin + 4, y);
          y += 4.5;
        });
      }
      y += 2;
    }
  }

  // ── Skills ──
  if ((r.skills ?? []).length > 0) {
    addSection("Skills");
    for (const s of r.skills ?? []) {
      ensureSpace(6);
      const label = `${s.category}: `;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      const labelW = pdf.getTextWidth(label);
      pdf.text(label, margin, y);
      pdf.setFont("helvetica", "normal");
      const itemsStr = (s.items ?? []).join(", ");
      const itemLines = pdf.splitTextToSize(itemsStr, contentW - labelW);
      itemLines.forEach((line: string, i: number) => {
        if (i === 0) {
          pdf.text(line, margin + labelW, y);
          y += 4.5;
        } else {
          ensureSpace(5);
          pdf.text(line, margin + labelW, y);
          y += 4.5;
        }
      });
    }
    y += 1;
  }

  // ── Projects ──
  if ((r.projects ?? []).length > 0) {
    addSection("Projects");
    for (const p of r.projects ?? []) {
      ensureSpace(10);
      addText(p.name, { bold: true, size: 11 });
      if (p.tech) addText(p.tech, { size: 9, color: 100 });
      for (const b of p.bullets ?? []) {
        const bulletLines = pdf.splitTextToSize(b, contentW - 5);
        bulletLines.forEach((line: string, i: number) => {
          ensureSpace(5);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.text(i === 0 ? "•" : " ", margin, y);
          pdf.text(line, margin + 4, y);
          y += 4.5;
        });
      }
      y += 2;
    }
  }

  // ── Education ──
  if ((r.education ?? []).length > 0) {
    addSection("Education");
    for (const e of r.education ?? []) {
      ensureSpace(10);
      const rowY = y;
      addText(e.institution, { bold: true, size: 11 });
      addRightText(`${e.year}${e.gpa ? " · " + e.gpa : ""}`, rowY, 9, 100);
      addText(e.degree, { italic: true, size: 10 });
      y += 2;
    }
  }

  // ── Certifications ──
  if ((r.certifications ?? []).length > 0) {
    addSection("Certifications");
    addText((r.certifications ?? []).join("  ·  "), { size: 10 });
  }

  // ── Awards & Recognition ──
  if ((r.awards ?? []).length > 0) {
    addSection("Awards & Recognition");
    for (const award of r.awards ?? []) {
      ensureSpace(6);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("•", margin, y);
      const aLines = pdf.splitTextToSize(award, contentW - 4);
      aLines.forEach((line: string) => {
        ensureSpace(5);
        pdf.text(line, margin + 4, y);
        y += 4.5;
      });
    }
  }

  const safeName = (r.name ?? "Resume").replace(/\s+/g, "_");
  const safeCompany = companyName
    ? "_" + companyName.replace(/[\s/\\:*?"<>|]+/g, "_")
    : "";
  pdf.save(`${safeName}${safeCompany}.pdf`);
}

async function downloadDOCX(r: TailoredResume, companyName?: string) {
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
        children: [
          new TextRun({ text: contactLine, size: 18, color: "555555" }),
        ],
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
          children: [new TextRun({ text: p.name, bold: true, size: 22 })],
          spacing: { after: 40 },
        }),
      );
      if (p.tech) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: p.tech,
                size: 18,
                color: "666666",
                italics: true,
              }),
            ],
            spacing: { after: 60 },
          }),
        );
      }
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
            new TextRun({
              text: `  ${e.year}${e.gpa ? " · " + e.gpa : ""}`,
              size: 18,
              color: "666666",
            }),
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
        children: [
          new TextRun({
            text: (r.certifications ?? []).join("  ·  "),
            size: 20,
          }),
        ],
      }),
    );
  }

  // Awards & Recognition
  if ((r.awards ?? []).length > 0) {
    children.push(sectionHeading("Awards & Recognition"));
    for (const award of r.awards ?? []) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: award, size: 20 })],
          bullet: { level: 0 },
          spacing: { after: 40 },
        }),
      );
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (r.name ?? "resume").replace(/\s+/g, "_");
  const safeCompany = companyName
    ? "_" + companyName.replace(/[\s/\\:*?"<>|]+/g, "_")
    : "";
  a.download = `${safeName}${safeCompany}.docx`;
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
    <div className="border border-foreground/10">
      {/* ── Breadcrumb bar ──────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_auto] items-center border-b border-foreground/10 bg-foreground px-6 py-3">
        <span className="label-sm text-white/60">
          {result.companyName
            ? `TAILORING / ${result.companyName.toUpperCase()}`
            : "RESUME TAILORING COMPLETE"}
        </span>
        {result.atsScore != null && (
          <span className="label-sm text-white/60">
            ATS MATCH · {result.atsScore}%
          </span>
        )}
      </div>

      {/* ── Info row ────────────────────────────────────────────────── */}
      <div className="grid gap-px md:grid-cols-[1fr_220px]">
        {/* Name cell */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface-lowest p-6 sm:p-8"
        >
          <p className="label-sm text-muted-foreground">CANDIDATE</p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {resume.name ?? "Your Resume"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {highCount > 0
              ? `${highCount} critical issue${highCount > 1 ? "s" : ""} fixed · ready to download`
              : `${changes.length} improvements applied · ready to download`}
          </p>
        </motion.div>

        {/* Score + download cell */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col justify-between gap-6 bg-foreground p-6 text-primary-foreground"
        >
          {result.atsScore != null ? (
            <div>
              <p className="label-sm text-white/50">ATS MATCH</p>
              <p className="mt-1 font-display text-5xl font-black leading-none text-white">
                {result.atsScore}
                <span className="text-2xl text-white/40">%</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="label-sm text-white/50">OPTIMIZED</p>
              <p className="mt-1 font-display text-2xl font-black text-white">
                Ready
              </p>
            </div>
          )}
          <div>
            {result.format === "docx" ? (
              <Button
                size="sm"
                className="w-full gap-2 border-0 bg-white/10 text-white hover:bg-white/20"
                disabled={isDownloadingDocx}
                onClick={async () => {
                  setIsDownloadingDocx(true);
                  try {
                    await downloadDOCX(resume, result.companyName);
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
                className="w-full gap-2 border-0 bg-white/10 text-white hover:bg-white/20"
                disabled={isDownloadingPdf}
                onClick={async () => {
                  setIsDownloadingPdf(true);
                  try {
                    await downloadPDF(resume, result.companyName);
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
        </motion.div>
      </div>

      {/* ── Tabs bar ────────────────────────────────────────────────── */}
      <div className="flex border-y border-foreground/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 border-r border-foreground/10 px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ease-out last:border-r-0",
              tab === t.id
                ? "bg-foreground text-primary-foreground"
                : "bg-surface-low text-muted-foreground hover:bg-surface-highest hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* Preview */}
        {tab === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="lg:max-h-[70vh] lg:overflow-y-auto"
          >
            <ResumePreview resume={resume} />
          </motion.div>
        )}

        {/* Issues */}
        {tab === "issues" && (
          <motion.div
            key="issues"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {issues.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No issues recorded.
              </p>
            ) : (
              <div className="grid gap-px">
                {issues.map((issue, i) => (
                  <div key={i} className="bg-surface-lowest p-5">
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
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {issue.section}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
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
                      <div className="ml-7 mt-3 bg-surface-low p-3">
                        <p className="text-xs text-muted-foreground">
                          This issue has been fixed in the tailored resume in
                          the <strong>Tailored Resume</strong> tab.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Changes */}
        {tab === "changes" && (
          <motion.div
            key="changes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {changes.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No changes recorded.
              </p>
            ) : (
              <div className="grid gap-px">
                {changes.map((change, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-surface-lowest p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-foreground text-primary-foreground">
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
              </div>
            )}
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
    <div className="bg-surface-lowest p-6 sm:p-10">
      {/* Name + contact */}
      <div className="border-b border-surface-highest pb-5 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {resume.name}
        </h1>
        {contact && (
          <p className="mt-1 text-xs text-muted-foreground wrap-break-word">
            {contact}
          </p>
        )}
      </div>

      {/* Summary */}
      {resume.summary && (
        <ResumeSection title="Professional Summary">
          <p className="text-sm leading-7 text-foreground/80">
            {resume.summary}
          </p>
        </ResumeSection>
      )}

      {/* Experience */}
      {(resume.experience ?? []).length > 0 && (
        <ResumeSection title="Experience">
          <div className="space-y-5">
            {(resume.experience ?? []).map((exp, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="font-semibold text-foreground">
                    {exp.company}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {exp.dates}
                  </span>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  {exp.title}
                  {exp.location ? ` — ${exp.location}` : ""}
                </p>
                <ul className="mt-2 space-y-1.5 pl-4">
                  {(exp.bullets ?? []).map((b, j) => (
                    <li
                      key={j}
                      className="list-disc text-sm leading-6 text-foreground/80"
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
                <span className="font-semibold text-foreground">
                  {s.category}:
                </span>
                <span className="text-foreground/80">
                  {(s.items ?? []).join(", ")}
                </span>
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
                <div>
                  <span className="font-semibold text-foreground">
                    {p.name}
                  </span>
                  {p.link && (
                    <a
                      href={p.link}
                      className="ml-2 text-xs text-muted-foreground underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.link}
                    </a>
                  )}
                  {p.tech && (
                    <p className="text-xs text-muted-foreground italic mt-0.5">
                      {p.tech}
                    </p>
                  )}
                </div>
                <ul className="mt-1.5 space-y-1.5 pl-4">
                  {(p.bullets ?? []).map((b, j) => (
                    <li
                      key={j}
                      className="list-disc text-sm leading-6 text-foreground/80"
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

      {/* Education */}
      {(resume.education ?? []).length > 0 && (
        <ResumeSection title="Education">
          <div className="space-y-3">
            {(resume.education ?? []).map((e, i) => (
              <div
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-x-2"
              >
                <div>
                  <span className="font-semibold text-foreground">
                    {e.institution}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    — {e.degree}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
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
                className="bg-surface-low px-3 py-1 text-xs font-medium text-foreground/80"
              >
                {c}
              </span>
            ))}
          </div>
        </ResumeSection>
      )}

      {/* Awards & Recognition */}
      {(resume.awards ?? []).length > 0 && (
        <ResumeSection title="Awards &amp; Recognition">
          <ul className="space-y-1.5 pl-4">
            {(resume.awards ?? []).map((a, i) => (
              <li
                key={i}
                className="list-disc text-sm leading-6 text-foreground/80"
              >
                {a}
              </li>
            ))}
          </ul>
        </ResumeSection>
      )}

      {/* Download CTA at bottom of preview */}
      <div className="mt-8 flex flex-col items-center gap-3 border-t border-surface-highest pt-6 sm:flex-row sm:justify-center">
        <CheckCircle2 className="h-4 w-4 text-foreground" />
        <span className="text-sm text-muted-foreground">
          Use the <strong>PDF</strong> or <strong>DOCX</strong> buttons above to
          download this resume.
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
      <h2 className="mb-3 border-b border-surface-highest pb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}
