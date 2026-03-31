# ATS Precision

ATS Precision is a Next.js App Router MVP for evaluating how well a resume aligns with a job description using a deterministic ATS-style scoring model.

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- Zustand
- Supabase Auth hooks
- Zod validation
- Drizzle schema scaffolding

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add Supabase public credentials if you want email login.
3. Start the app with `npm run dev`.

## MVP coverage

- Resume upload for PDF and DOCX
- Job description input with validation
- ATS score with weighted breakdown
- Missing keywords, gaps, and suggestions
- Animated landing page and evaluation flow
- Local evaluation history with Supabase-ready auth scaffolding
