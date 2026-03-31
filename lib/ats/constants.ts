/**
 * ATS constants — minimal set retained for parsing only.
 * All scoring, keyword matching, and analysis is done by the AI.
 */

/** MIME types accepted for resume upload */
export const ACCEPTED_RESUME_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
] as const;

/** Maximum resume file size in bytes (5 MB) */
export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
