import { z } from "zod";

export const acceptedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
] as const;

export const clientEvaluationSchema = z.object({
  jdText: z
    .string()
    .min(120, "Paste a fuller job description to get a reliable score.")
    .max(12000, "Job description is too long for the MVP evaluator."),
  resumeFileName: z.string().min(1, "Upload a resume file."),
  resumeFileSize: z
    .number()
    .positive()
    .max(5 * 1024 * 1024, "Resume file must be under 5 MB.")
});

export const serverEvaluationSchema = z.object({
  jdText: z
    .string()
    .min(120)
    .max(12000)
    .transform((value) => value.trim())
});

export type ClientEvaluationInput = z.infer<typeof clientEvaluationSchema>;
export type ServerEvaluationInput = z.infer<typeof serverEvaluationSchema>;
