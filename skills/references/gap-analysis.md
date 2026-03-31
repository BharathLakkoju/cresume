# Gap Analysis — Scoring Rubric & Format

---

## How to Conduct a Gap Analysis

When the user shares their profile, extract:
- Current tech stack and tools
- Years of experience
- Role they're targeting
- Companies/tiers they're targeting
- Projects built (tech used, deployed or not, open source or not)
- Any certs or courses completed

Then compare against the relevant tier + role checklist from tier1.md / tier2.md / tier3.md.

---

## Scoring Rubric

For each skill area, assign one of three statuses:

| Status | Criteria |
|---|---|
| ✅ Strong | User has clear hands-on experience, can discuss deeply, has used in projects |
| ⚠️ Partial | User has exposure but shallow — used in tutorials, not production; knows the concept but can't go deep |
| ❌ Missing | Not mentioned, no evidence of experience |

---

## Gap Analysis Output Format

```
## 🔍 Gap Analysis — [Role] SDE-[Level] targeting [Tier]

### ✅ Strong Areas
- [Skill]: [1-line reason why it's strong based on their profile]

### ⚠️ Partial Gaps — Needs Deepening
- [Skill]: [What they have + what's missing + 1 concrete action]

### ❌ Missing Skills — Priority Gaps
- [Skill]: [Why it matters for their target + how to close it]

### 🗺️ Prioritized Roadmap

**Month 1 — Foundation gaps**
- [Most critical missing skill]: [Specific resource or action]
- [Second priority]: [Specific resource or action]

**Month 2 — Depth building**
- [Partial gap to deepen]: [How]

**Month 3+ — Differentiation**
- [Nice-to-have that would stand out]: [How]

### 🚀 Start Here This Week
[Single most impactful action they can take in the next 7 days — be specific]
```

---

## Tone Guide for Gap Analysis

- Be honest, not brutal. "This is a significant gap" not "you're nowhere near ready"
- Be specific, not vague. "Do NeetCode's Blind 75 starting with arrays" not "practice LeetCode"
- Acknowledge strengths genuinely before gaps
- Don't pad with filler encouragement — just be direct and useful
- If the user is clearly SDE-2 level targeting Tier-1, acknowledge that the bar is high but achievable with specific steps
- If the user has unusual strengths (e.g., strong AI/ML background targeting full stack), flag that as a differentiator

---

## Red Flags to Call Out Diplomatically

If you notice these, mention them clearly but constructively:
- No deployed projects (GitHub only, no live demos)
- Only tutorial/course projects, no original ideas
- Zero DSA practice mentioned when targeting Tier-1/2
- No system design exposure when targeting SDE-2
- Tech stack is entirely outdated (e.g., only jQuery, AngularJS 1.x)
- Only service company experience with no product thinking exposure