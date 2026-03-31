# Projects & Portfolio Guidance

---

## What MNCs Look For in Projects

| Tier | What impresses | What doesn't |
|---|---|---|
| Tier-1 | Scale, impact, novel problem-solving, open source contributions | CRUD todo apps, tutorial clones |
| Tier-2 | Real use cases, measurable impact, production deployment | Only personal hobby projects with no users |
| Tier-3 | Working software, clean code, documentation | Incomplete projects, private repos |

---

## Project Quality Rubric

A strong project answers "yes" to most of these:
- ✅ Solves a real problem (ideally one you personally faced)
- ✅ Has a production deployment (Vercel, Railway, Render, AWS)
- ✅ Has a public GitHub repo with clean README
- ✅ README includes: what it does, architecture diagram, how to run it, tech stack
- ✅ Shows one interesting technical decision or challenge
- ✅ Has some form of users or usage (even if small)

---

## Role-Specific Project Recommendations

### Full Stack Developer

**SDE-1 projects (build at least 2)**
- A real-time collaborative tool (think: shared notes, live whiteboard) — shows WebSockets, state sync
- A job board / marketplace with auth, search, filters — shows full CRUD, auth, SQL
- A personal finance tracker / expense tracker — shows data modeling, charts, multi-user

**SDE-2 projects / contributions**
- Contribute to an open source project (even small PRs count)
- Build a CLI tool or VS Code extension used by others
- Multi-tenant SaaS with billing integration (Stripe)

### AI / ML Engineer

**SDE-1 projects**
- RAG-powered document Q&A system — shows LLMs, vector DBs, LangChain/LlamaIndex
- Fine-tuned model for a specific task (sentiment, classification) on Hugging Face
- AI agent that automates a real workflow (job scraper + AI analysis, etc.)

**SDE-2 projects / contributions**
- MLOps pipeline: training → tracking → serving → monitoring
- Open source model on Hugging Face with downloads
- Technical blog post / paper on a specific AI problem you solved

### Backend / SDE

**SDE-1 projects**
- URL shortener with analytics — shows system design basics, caching
- Task queue / job scheduler — shows async processing, worker patterns
- REST API with auth, rate limiting, pagination — shows production API design

**SDE-2 projects**
- Distributed rate limiter or cache implementation
- Build and document a mini Kafka-like message queue from scratch
- Contribute to open source backend libraries

### Frontend Developer

**SDE-1 projects**
- Component library published to npm — shows reusable UI engineering
- Real-time dashboard with WebSocket updates — shows async UI state
- PWA with offline support — shows service workers, caching

**SDE-2 projects**
- Micro-frontend demo (Module Federation) — shows architecture thinking
- Accessibility audit tool or a11y-first design system
- Performance optimization case study (before/after Lighthouse scores)

---

## GitHub Profile Checklist
- [ ] Profile README with intro, skills, and contact
- [ ] Pinned repos: your 4–6 best projects
- [ ] Green contribution graph (daily commits signal active engagement)
- [ ] Each repo has: description, topics/tags, live demo link if applicable
- [ ] No repos with just "initial commit" and nothing else

---

## Portfolio Website (optional but recommended at SDE-2)
- Keep it simple: About, Projects, Blog (optional), Contact
- Show metrics where possible: "10k+ requests/day", "50+ GitHub stars"
- Link to GitHub, LinkedIn, and deployed projects
- For AI engineers: link to Hugging Face profile if you have models/spaces