import { parseResumeSections } from "@/lib/ats/structured-parser";

type ImportedProfileDraft = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    dates: string;
    location: string;
    bullets: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects: Array<{
    name: string;
    tech: string;
    link: string;
    website: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  certifications: string[];
  awards: string[];
};

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Z0-9-_%/]+/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Z0-9-_.]+/i;
const PHONE_CANDIDATE_REGEX = /(?:\+?\d[\d()\s.-]{8,}\d)/g;
const DATE_LINE_REGEX =
  /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|present|current|\b\d{4}\b)/i;
const TITLE_HINT_REGEX =
  /\b(engineer|developer|manager|analyst|designer|consultant|intern|lead|architect|specialist|director|executive|administrator|devops|sre|qa|tester|product|marketing|sales|finance|research|success)\b/i;
const INSTITUTION_HINT_REGEX =
  /\b(university|college|institute|school|academy|polytechnic)\b/i;
const LOCATION_HINT_REGEX =
  /\b(remote|hybrid|onsite|india|usa|u\.s\.a?\.?|uk|u\.k\.|canada|singapore|australia|bangalore|hyderabad|mumbai|delhi|chennai|pune|kolkata|new\s*york|san\s*francisco|seattle|london|berlin|toronto|noida|gurgaon|gurugram)\b/i;

// Heading words that should never be treated as a person's name
const NON_NAME_HEADING_REGEX =
  /^(?:summary|experience|skills|projects|education|certifications?|awards?|work(?:\s+(?:experience|history))?|employment|contact(?:\s+(?:info(?:rmation)?|details?))?|personal(?:\s+(?:info(?:rmation)?|details?|profile|statement))?|curriculum(?:\s+vitae)?|c\.v\.|resume|profile|about(?:\s+me)?|objective|overview|introduction|declaration|references?|activities|interests|hobbies|languages?|achievements?|accomplishments?|publications?|organizations?|volunteer(?:ing)?|internship[s]?|date(?:\s+of\s+birth)?|nationality|gender|marital(?:\s+status)?|full\s+name|name|phone|email|address|website|portfolio|github|linkedin|social|links|additional(?:\s+info(?:rmation)?)?|professional|career|key|core|areas?|expertise|competencies?|technologies|tools?|technical)$/i;

function cleanLine(line: string) {
  return line
    .replace(/[\u0000\t]/g, " ")
    .replace(/[•▪◦●]/g, "•")
    .replace(/\s+/g, " ")
    .trim();
}

function splitNonEmptyLines(text: string) {
  return text
    .split(/\n+/)
    .map(cleanLine)
    .filter(Boolean);
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function stripBullet(line: string) {
  return line.replace(/^[•*\-–—]+\s*/, "").trim();
}

function splitListItems(value: string) {
  return value
    .split(/[|,;/]+/)
    .map(cleanLine)
    .filter(Boolean);
}

function isSentenceLike(line: string) {
  return line.split(/\s+/).length > 10 || /[.]$/.test(line);
}

function isLikelyName(line: string) {
  if (!line || line.length > 60 || /\d/.test(line)) return false;
  if (EMAIL_REGEX.test(line) || LINKEDIN_REGEX.test(line) || GITHUB_REGEX.test(line)) {
    return false;
  }
  if (NON_NAME_HEADING_REGEX.test(line.trim())) return false;

  const words = line.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5) return false;
  if (!words.every((word) => /^[A-Za-z'.-]+$/.test(word))) return false;

  // Reject lines that look like a job title or combined descriptor
  // (e.g. "Software Engineer", "Full Stack Developer", "Data Analyst")
  if (TITLE_HINT_REGEX.test(line)) return false;

  return true;
}

function extractPhone(text: string) {
  const candidates = text.match(PHONE_CANDIDATE_REGEX) ?? [];

  for (const candidate of candidates) {
    const digits = candidate.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 15) {
      return candidate.trim();
    }
  }

  return "";
}

function normalizeUrl(url: string) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function extractLocation(lines: string[]) {
  return (
    lines.find(
      (line) =>
        !EMAIL_REGEX.test(line) &&
        !LINKEDIN_REGEX.test(line) &&
        !GITHUB_REGEX.test(line) &&
        !extractPhone(line) &&
        (LOCATION_HINT_REGEX.test(line) || /,/.test(line)),
    ) ?? ""
  );
}

function extractSummary(summaryText: string) {
  return splitNonEmptyLines(summaryText).join(" ").trim();
}

function splitTitleAndCompany(line: string) {
  const atMatch = line.match(/^(.*?)\s+at\s+(.*)$/i);
  if (atMatch) {
    return {
      title: cleanLine(atMatch[1]),
      company: cleanLine(atMatch[2]),
    };
  }

  const parts = line.split(/\s+[|•]\s+|\s+[-–—]\s+/).map(cleanLine).filter(Boolean);
  if (parts.length === 2) {
    if (TITLE_HINT_REGEX.test(parts[0]) && !TITLE_HINT_REGEX.test(parts[1])) {
      return { title: parts[0], company: parts[1] };
    }
    if (!TITLE_HINT_REGEX.test(parts[0]) && TITLE_HINT_REGEX.test(parts[1])) {
      return { title: parts[1], company: parts[0] };
    }
  }

  return null;
}

function parseSkillsSection(skillsText: string) {
  const lines = splitNonEmptyLines(skillsText);
  const parsedSkills: ImportedProfileDraft["skills"] = [];
  const leftoverItems: string[] = [];

  for (const line of lines) {
    const [categoryPart, itemsPart] = line.split(/:(.+)/).map((value) => value?.trim());
    if (categoryPart && itemsPart) {
      const items = unique(splitListItems(itemsPart));
      if (items.length) {
        parsedSkills.push({ category: categoryPart, items });
      }
      continue;
    }

    leftoverItems.push(...splitListItems(line));
  }

  if (leftoverItems.length) {
    parsedSkills.push({
      category: parsedSkills.length ? "Additional Skills" : "Technical Skills",
      items: unique(leftoverItems),
    });
  }

  return parsedSkills;
}

function parseSimpleList(text: string) {
  return splitNonEmptyLines(text).map(stripBullet).filter(Boolean);
}

/**
 * When an experience entry has all metadata packed on ONE pipe-separated line
 * (e.g. "Software Engineer | Acme Corp | Jan 2021 – Present | New York")
 * expand it so each component becomes its own header line, making date / location
 * / title / company detection reliable.
 */
function expandInlineHeader(headerLines: string[]): string[] {
  if (headerLines.length !== 1) return headerLines;
  const line = headerLines[0];
  const parts = line.split(/\s*\|\s*/).map(cleanLine).filter(Boolean);
  // Only expand if we have 3+ parts and at least one looks like a date range
  if (
    parts.length >= 3 &&
    parts.some((p) =>
      /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|present|current)/i.test(p) ||
      /\b\d{4}\b.*\b\d{4}\b/.test(p) ||
      /\b\d{4}\b.*(?:present|current)/i.test(p),
    )
  ) {
    return parts;
  }
  return headerLines;
}

function isLikelyBullet(line: string) {
  return /^[•*\-–—]/.test(line) || isSentenceLike(line);
}

function isLikelyEntryHeader(line: string) {
  return !isLikelyBullet(line) && line.split(/\s+/).length <= 8;
}

function parseExperienceSection(experienceText: string) {
  const lines = splitNonEmptyLines(experienceText);
  const entries: Array<{ headerLines: string[]; bullets: string[] }> = [];
  let current: { headerLines: string[]; bullets: string[] } | null = null;

  for (const line of lines) {
    if (!current) {
      current = { headerLines: [line], bullets: [] };
      continue;
    }

    const startsNewEntry =
      current.bullets.length > 0 && isLikelyEntryHeader(line) && !DATE_LINE_REGEX.test(line);

    if (startsNewEntry) {
      entries.push(current);
      current = { headerLines: [line], bullets: [] };
      continue;
    }

    if (isLikelyBullet(line)) {
      current.bullets.push(stripBullet(line));
    } else {
      current.headerLines.push(line);
    }
  }

  if (current) {
    entries.push(current);
  }

  return entries
    .map(({ headerLines, bullets }) => {
      // Expand single-line inline headers before classifying components
      const expandedHeaders = expandInlineHeader(headerLines);
      const dateLine = expandedHeaders.find((line) => DATE_LINE_REGEX.test(line)) ?? "";
      const locationLine =
        expandedHeaders.find((line) => line !== dateLine && extractLocation([line])) ?? "";
      const primaryLines = expandedHeaders.filter(
        (line) => line !== dateLine && line !== locationLine,
      );

      let title = "";
      let company = "";

      if (primaryLines[0]) {
        const combined = splitTitleAndCompany(primaryLines[0]);
        if (combined) {
          title = combined.title;
          company = combined.company;
        } else if (primaryLines[1]) {
          if (TITLE_HINT_REGEX.test(primaryLines[0]) && !TITLE_HINT_REGEX.test(primaryLines[1])) {
            title = primaryLines[0];
            company = primaryLines[1];
          } else if (!TITLE_HINT_REGEX.test(primaryLines[0]) && TITLE_HINT_REGEX.test(primaryLines[1])) {
            company = primaryLines[0];
            title = primaryLines[1];
          } else {
            title = primaryLines[0];
            company = primaryLines[1];
          }
        } else if (TITLE_HINT_REGEX.test(primaryLines[0])) {
          title = primaryLines[0];
        } else {
          company = primaryLines[0];
        }
      }

      return {
        company,
        title,
        dates: dateLine,
        location: locationLine,
        bullets: unique(bullets).filter(Boolean),
      };
    })
    .filter(
      (entry) =>
        entry.company || entry.title || entry.dates || entry.location || entry.bullets.length,
    );
}

function parseProjectsSection(projectsText: string) {
  const lines = splitNonEmptyLines(projectsText);
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const startsNewBlock = current.length > 0 && isLikelyEntryHeader(line) && !isSentenceLike(line);
    if (startsNewBlock) {
      blocks.push(current);
      current = [line];
      continue;
    }

    current.push(line);
  }

  if (current.length) {
    blocks.push(current);
  }

  return blocks
    .map((block) => {
      const [firstLine = "", ...rest] = block;
      const linkLine = block.find((line) => /^https?:\/\//i.test(line) || GITHUB_REGEX.test(line)) ?? "";
      const websiteLine = block.find(
        (line) => /^https?:\/\//i.test(line) && line !== linkLine,
      ) ?? "";
      const techLine = rest.find(
        (line) => /[:,|/]/.test(line) && !/^https?:\/\//i.test(line),
      ) ?? "";
      const bullets = block
        .filter((line) => line !== firstLine && line !== linkLine && line !== websiteLine && line !== techLine)
        .map(stripBullet)
        .filter(Boolean);

      return {
        name: firstLine,
        tech: techLine.replace(/^tech(?: stack)?\s*:/i, "").trim(),
        link: normalizeUrl(linkLine),
        website: normalizeUrl(websiteLine),
        bullets,
      };
    })
    .filter((project) => project.name || project.tech || project.link || project.website || project.bullets.length);
}

function parseEducationSection(educationText: string) {
  const lines = splitNonEmptyLines(educationText);
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const startsNewBlock = current.length > 0 && INSTITUTION_HINT_REGEX.test(line);
    if (startsNewBlock) {
      blocks.push(current);
      current = [line];
      continue;
    }

    current.push(line);
  }

  if (current.length) {
    blocks.push(current);
  }

  return blocks
    .map((block) => {
      const institution = block.find((line) => INSTITUTION_HINT_REGEX.test(line)) ?? block[0] ?? "";
      const year = block.find((line) => /\b(?:19|20)\d{2}\b/.test(line)) ?? "";
      const gpaLine = block.find((line) => /\b(?:gpa|cgpa)\b/i.test(line)) ?? "";
      const degree =
        block.find(
          (line) => line !== institution && line !== year && line !== gpaLine,
        ) ?? "";

      return {
        institution,
        degree,
        year: (year.match(/\b(?:19|20)\d{2}\b/) ?? [""])[0],
        gpa: gpaLine.replace(/^.*?((?:gpa|cgpa)[^\d]*[\d.]+.*)$/i, "$1"),
      };
    })
    .filter((entry) => entry.institution || entry.degree || entry.year || entry.gpa);
}

export function extractProfileFromResumeText(rawText: string): ImportedProfileDraft {
  // Normalize all line-ending variants and control characters before processing
  const normalizedText = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n") // PDF page-feed characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ") // other control chars
    .trim();

  const sections = parseResumeSections(normalizedText);

  // Build contact lines from the dedicated contact bucket; fall back to the
  // first 10 lines of the whole document so the name is still found when the
  // resume begins directly with a recognised section heading.
  const rawFirstLines = splitNonEmptyLines(normalizedText).slice(0, 10);
  const contactLines = sections.contact
    ? splitNonEmptyLines(sections.contact).slice(0, 10)
    : rawFirstLines;

  // Try the contact bucket first, then the raw top-of-document as a safety net
  const name =
    contactLines.find(isLikelyName) ??
    (sections.contact ? rawFirstLines.find(isLikelyName) : undefined) ??
    "";

  const email = (normalizedText.match(EMAIL_REGEX) ?? [""])[0];
  const phone = extractPhone(normalizedText);
  const linkedin = normalizeUrl((normalizedText.match(LINKEDIN_REGEX) ?? [""])[0]);
  const github = normalizeUrl((normalizedText.match(GITHUB_REGEX) ?? [""])[0]);
  const location = extractLocation(contactLines);
  const summary = extractSummary(sections.summary);

  return {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    experience: parseExperienceSection(sections.experience),
    skills: parseSkillsSection(sections.skills),
    projects: parseProjectsSection(sections.projects),
    education: parseEducationSection(sections.education),
    certifications: parseSimpleList(sections.certifications),
    awards: parseSimpleList(sections.other).filter((line) => /award|achievement|honou?r|recognition/i.test(line)),
  };
}

export function hasImportedProfileData(profile: ImportedProfileDraft) {
  return Boolean(
    profile.name ||
      profile.email ||
      profile.phone ||
      profile.location ||
      profile.linkedin ||
      profile.github ||
      profile.summary ||
      profile.experience.length ||
      profile.skills.length ||
      profile.projects.length ||
      profile.education.length ||
      profile.certifications.length ||
      profile.awards.length,
  );
}