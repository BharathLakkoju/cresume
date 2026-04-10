/**
 * Resume file parser — extracts raw text from PDF and DOCX files.
 *
 * All analysis, scoring, and keyword extraction is done by the AI.
 * This module is responsible ONLY for converting files to plain text.
 */

import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

const SUPPORTED_EXTENSIONS = [".pdf", ".docx"];

/**
 * Parses a resume file (PDF or DOCX) and returns the raw text content.
 * @throws Error if the file format is unsupported.
 */
export async function parseResumeFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const extension = SUPPORTED_EXTENSIONS.find((entry) => fileName.endsWith(entry));
  const arrayBuffer = await file.arrayBuffer();

  if (!extension) {
    throw new Error("Please upload a PDF or DOCX resume.");
  }

  if (extension === ".pdf") {
    const document = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text } = await extractText(document, { mergePages: true });
    return text ?? "";
  }

  const parsed = await mammoth.extractRawText({ arrayBuffer } as any);
  return parsed.value ?? "";
}
