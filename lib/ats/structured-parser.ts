/**
 * Structured parser — extracts sections from raw resume text and JD text
 * using heuristics (no AI needed). Produces compact structured representations
 * that are much more efficient as AI input than raw text.
 */

// ---------------------------------------------------------------------------
// Resume section extraction
// ---------------------------------------------------------------------------

export interface ParsedResume {
  contact: string;
  summary: string;
  experience: string;
  skills: string;
  projects: string;
  education: string;
  certifications: string;
  other: string;
}

const SECTION_PATTERNS: Array<{ key: keyof ParsedResume; pattern: RegExp }> = [
  {
    key: "summary",
    pattern:
      /^(?:summary|profile|about\s*me|objective|career\s*objective|professional\s*(?:summary|profile|objective)|personal\s*statement|overview|introduction|executive\s*summary)/i,
  },
  {
    key: "experience",
    pattern:
      /^(?:experience|work\s*(?:experience|history)|employment(?:\s*history)?|professional\s*experience|career\s*(?:history|background|experience)|positions?(?:\s*held)?|internship[s]?(?:\s*experience)?|relevant\s*experience|industry\s*experience)/i,
  },
  {
    key: "skills",
    pattern:
      /^(?:skills|technical\s*skills|core\s*competencies|competencies|technologies|tools?(?:\s*(?:&|and)\s*technologies)?|key\s*skills|areas?\s*of\s*(?:expertise|competence)|professional\s*skills|core\s*skills|technical\s*expertise|expertise|technical\s*(?:abilities|proficiencies|knowledge)|technologies\s*(?:&|and)\s*tools?)/i,
  },
  {
    key: "projects",
    pattern:
      /^(?:projects|personal\s*projects|key\s*projects|selected\s*projects|notable\s*projects|side\s*projects|academic\s*projects|portfolio|project\s*experience)/i,
  },
  {
    key: "education",
    pattern:
      /^(?:education|academic(?:\s*(?:background|details|history|qualifications?))?|qualifications?|educational(?:\s*(?:background|details|qualifications?))?|scholastics?|degrees?)/i,
  },
  {
    key: "certifications",
    pattern:
      /^(?:certifications?|(?:licenses?\s*(?:&|and)\s*)?certifications?|professional\s*development|achievements?(?:\s*(?:&|and)\s*(?:awards?|recognition))?|awards?(?:\s*(?:&|and)\s*(?:achievements?|honors?))?|honors?(?:\s*(?:&|and)\s*awards?)?|accomplishments?|recognitions?|publications?)/i,
  },
];

/**
 * Splits raw resume text into labelled sections based on common headings.
 * Lines before the first recognized heading are treated as contact info.
 */
export function parseResumeSections(rawText: string): ParsedResume {
  // Normalize form feeds (PDF page breaks) and carriage returns to newlines
  const lines = rawText.replace(/\f/g, "\n").replace(/\r/g, "\n").split(/\n/);
  const result: ParsedResume = {
    contact: "",
    summary: "",
    experience: "",
    skills: "",
    projects: "",
    education: "",
    certifications: "",
    other: "",
  };

  let currentKey: keyof ParsedResume = "contact";
  const buckets: Record<keyof ParsedResume, string[]> = {
    contact: [],
    summary: [],
    experience: [],
    skills: [],
    projects: [],
    education: [],
    certifications: [],
    other: [],
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check if this line is a section heading
    const matched = SECTION_PATTERNS.find((sp) => sp.pattern.test(line));
    if (matched) {
      currentKey = matched.key;
      continue; // skip the heading line itself
    }

    // Catch-all for unrecognized headings (ALL CAPS short lines that look like headings)
    if (
      currentKey !== "contact" &&
      line.length < 40 &&
      line === line.toUpperCase() &&
      /^[A-Z\s&/,\-]+$/.test(line)
    ) {
      currentKey = "other";
      continue;
    }

    buckets[currentKey].push(line);
  }

  for (const key of Object.keys(buckets) as Array<keyof ParsedResume>) {
    result[key] = buckets[key].join("\n").trim();
  }

  return result;
}

// ---------------------------------------------------------------------------
// JD requirements extraction
// ---------------------------------------------------------------------------

export interface ParsedJD {
  role: string;
  requirements: string;
  responsibilities: string;
  niceToHave: string;
  other: string;
}

const JD_SECTION_PATTERNS: Array<{ key: keyof ParsedJD; pattern: RegExp }> = [
  { key: "requirements",      pattern: /^(?:requirements?|qualifications?|must\s*have|required|what\s*(?:you|we)\s*(?:need|require|look))/i },
  { key: "responsibilities",  pattern: /^(?:responsibilities|what\s*you.?ll\s*do|role|about\s*the\s*role|job\s*description|key\s*responsibilities|duties)/i },
  { key: "niceToHave",        pattern: /^(?:nice\s*to\s*have|preferred|bonus|plus|good\s*to\s*have|desired)/i },
];

/**
 * Splits raw JD text into structured sections.
 * The first few lines (before any heading) are treated as the role/company overview.
 */
export function parseJDSections(rawText: string): ParsedJD {
  const lines = rawText.split(/\n/);
  const result: ParsedJD = {
    role: "",
    requirements: "",
    responsibilities: "",
    niceToHave: "",
    other: "",
  };

  let currentKey: keyof ParsedJD = "role";
  const buckets: Record<keyof ParsedJD, string[]> = {
    role: [],
    requirements: [],
    responsibilities: [],
    niceToHave: [],
    other: [],
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const matched = JD_SECTION_PATTERNS.find((sp) => sp.pattern.test(line));
    if (matched) {
      currentKey = matched.key;
      continue;
    }

    buckets[currentKey].push(line);
  }

  for (const key of Object.keys(buckets) as Array<keyof ParsedJD>) {
    result[key] = buckets[key].join("\n").trim();
  }

  return result;
}

// ---------------------------------------------------------------------------
// Serialize structured data into compact AI-ready text
// ---------------------------------------------------------------------------

/**
 * Sends the raw resume text as-is and the parsed+structured JD sections.
 * Resume is sent whole so the AI has full fidelity — no section caps or truncation.
 * JD is structured so the AI can locate requirements quickly.
 */
export function buildStructuredPromptInputs(
  resumeText: string,
  jdText: string
): { resume: string; jd: string } {
  const j = parseJDSections(jdText);

  // Build structured JD representation
  const jdParts: string[] = [];

  if (j.role)             jdParts.push(`[ROLE]\n${j.role}`);
  if (j.responsibilities) jdParts.push(`[RESPONSIBILITIES]\n${j.responsibilities}`);
  if (j.requirements)     jdParts.push(`[REQUIREMENTS]\n${j.requirements}`);
  if (j.niceToHave)       jdParts.push(`[NICE TO HAVE]\n${j.niceToHave}`);
  if (j.other)            jdParts.push(`[OTHER]\n${j.other}`);

  const structuredJd = jdParts.join("\n\n");

  return {
    resume: resumeText,
    jd: structuredJd,
  };
}
