# atsprecise

> AI-powered ATS resume evaluator — upload your resume, paste a job description, and get a precise compatibility score with keyword gap analysis and improvement guidance.

---

## About

atsprecise is a deterministic resume evaluation tool built to help job seekers understand exactly how their resume scores against a specific job description using the same logic Applicant Tracking Systems apply. Unlike vague AI feedback, it delivers a structured, weighted breakdown of keyword matches, section quality, and formatting gaps — with actionable role-specific suggestions.

## Features

- **Resume Upload** — Supports PDF and DOCX formats (parsed with mammoth + unpdf)
- **Job Description Input** — Paste any job description for targeted evaluation
- **ATS Score Engine** — Weighted scoring across keyword match, skills alignment, section completeness, and formatting quality
- **Keyword Gap Analysis** — Highlights missing keywords and over-used filler phrases
- **Section-by-Section Feedback** — Detailed breakdown for Summary, Experience, Skills, and Education sections
- **Improvement Suggestions** — Role-specific, prioritized recommendations to raise your score
- **Download Report** — Export the evaluation as a PDF (jspdf + html2canvas)
- **Evaluation History** — Local history of past evaluations with Supabase-ready auth scaffolding
- **Animated UI** — Framer Motion-powered landing page and evaluation flow

## Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Framework        | Next.js 16 (App Router)     |
| UI Library       | React 19                    |
| Styling          | Tailwind CSS v4             |
| Language         | TypeScript                  |
| State Management | Zustand                     |
| Auth + DB        | Supabase (SSR), Drizzle ORM |
| Resume Parsing   | mammoth (DOCX), unpdf (PDF) |
| Export           | jspdf, html2canvas, docx    |
| Validation       | Zod                         |
| Animations       | Framer Motion               |
| UI Primitives    | Radix UI (Label, Progress)  |

## Local Development

### Prerequisites

- Node.js 18+
- Supabase project (optional — only required for auth and history features)

```bash
git clone https://github.com/BharathLakkoju/atsprecise
cd atsprecise
npm install
# Optional: copy .env.example to .env.local and add Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## App Structure

```
app/
├── (marketing)/     # Landing page
├── app/             # Protected evaluation dashboard
├── auth/            # Login / signup
└── api/             # Server-side API routes
components/          # Shared React components
store/               # Zustand global state
lib/                 # ATS scoring engine, parsers, DB schema
types/               # TypeScript type definitions
```

## License

MIT
