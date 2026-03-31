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

  console.log(
    `[parser] Received file: "${file.name}" | size: ${(file.size / 1024).toFixed(1)} KB | type: "${file.type || "unknown"}"`
  );

  if (!extension) {
    console.error(`[parser] Unsupported extension for file: "${file.name}"`);
    throw new Error("Please upload a PDF or DOCX resume.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  console.log(`[parser] Buffer created: ${buffer.byteLength} bytes | format: ${extension}`);

  if (extension === ".pdf") {
    console.time("[parser] PDF extraction");
    const document = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(document, { mergePages: true });
    console.timeEnd("[parser] PDF extraction");
    console.log(
      `[parser] PDF extracted: ${text?.length ?? 0} chars | preview: "${text?.slice(0, 300).replace(/\n/g, " ")}..."`
    );
    return text ?? "";
  }

  console.time("[parser] DOCX extraction");
  const parsed = await mammoth.extractRawText({ buffer });
  console.timeEnd("[parser] DOCX extraction");
  console.log(
    `[parser] DOCX extracted: ${parsed.value?.length ?? 0} chars | preview: "${parsed.value?.slice(0, 300).replace(/\n/g, " ")}..."`
  );
  return parsed.value ?? "";
}
