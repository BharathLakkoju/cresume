export { roleGuidesHubPath } from "@/lib/route-paths";

type RoleCompanionArticle = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

export type RoleLandingPage = {
  slug: string;
  headline: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  audience: string;
  path: string;
  keywords: string[];
  matchSignals: string[];
  rewritePriorities: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  companionArticle: RoleCompanionArticle;
};

export const roleLandingPages: RoleLandingPage[] = [
  {
    slug: "ats-resume-checker-for-software-engineers",
    headline: "ATS resume checker for software engineers",
    eyebrow: "Engineering resumes",
    metaTitle: "ATS Resume Checker for Software Engineers",
    metaDescription:
      "Check how well your software engineering resume matches backend, frontend, full-stack, and platform job descriptions with role-specific keyword and proof-of-impact guidance.",
    intro:
      "Software engineering resumes are filtered on stack relevance, system ownership, and delivery evidence. This page helps candidates tune project bullets, keywords, and architecture language to the roles they actually want.",
    audience: "Software engineers targeting IC or senior engineering roles",
    path: "/ats-resume-checker-for-software-engineers",
    keywords: [
      "ATS resume checker for software engineers",
      "software engineer resume checker",
      "software engineer resume keyword scanner",
      "ATS checker for developer resume",
    ],
    matchSignals: [
      "Programming languages, frameworks, and cloud tooling that overlap with the target job description",
      "System design, API ownership, platform scale, and production reliability language",
      "Impact-backed bullets showing shipped features, latency gains, cost reductions, or quality improvements",
    ],
    rewritePriorities: [
      "Replace generic bullets with shipped systems, performance outcomes, and architecture decisions",
      "Align titles and summary language to the exact engineering scope in the job description",
      "Surface repositories, developer tools, and platform work that prove depth beyond keyword repetition",
    ],
    faq: [
      {
        question:
          "What should a software engineer prioritize in an ATS resume check?",
        answer:
          "Prioritize exact stack overlap, role-level ownership, production impact, and clean technical section naming so the resume reads clearly to both screeners and hiring teams.",
      },
      {
        question:
          "Do software engineering resumes need every tool from the job description?",
        answer:
          "No. You need strong overlap on the core stack and strong evidence that your projects, systems, or services map to the team's actual problems.",
      },
    ],
    companionArticle: {
      slug: "software-engineer-resume-keywords-examples-interview-prep",
      title:
        "Software engineer resume keywords, resume examples, and interview prep",
      metaTitle:
        "Software Engineer Resume Keywords, Examples, and Interview Prep",
      metaDescription:
        "Use this guide to sharpen software engineer resume examples, cover the right technical keywords, and prepare for interviews using the same project stories recruiters screen for.",
      keywords: [
        "software engineer resume examples",
        "software engineer resume keywords",
        "software engineer interview prep",
        "developer resume example",
      ],
      intro:
        "Software engineer hiring funnels connect resume screening and interviews tightly. The projects, systems, and architecture details that increase ATS match rates are usually the same details that drive technical interviews and recruiter screens.",
      sections: [
        {
          title: "What strong software engineer resume examples actually show",
          body:
            "The best engineering resumes do not just list stacks. They show shipped services, architecture choices, system constraints, and measurable outcomes such as reliability gains, latency improvements, developer productivity wins, or revenue impact. If your examples only say you worked on features, they leave too much for the recruiter to infer.",
        },
        {
          title: "Keyword clusters that matter for engineering resumes",
          body:
            "Use exact job-description language for core technologies, deployment environments, and ownership patterns. That includes languages, frameworks, cloud platforms, CI or observability tooling, and phrases like distributed systems, APIs, microservices, performance optimization, or platform reliability when those themes match your background.",
        },
        {
          title: "How resume bullets feed technical interview prep",
          body:
            "Every major resume bullet should turn into a concise interview story covering problem, approach, tradeoffs, and outcome. If a bullet says you improved API performance, you should be ready to explain the bottleneck, instrumentation, architectural decision, and how you validated the result under production constraints.",
        },
        {
          title: "A fast tailoring checklist for each application",
          body:
            "Start by matching your title, summary, and top two experience blocks to the role's scope. Then move the most relevant projects higher, tighten impact metrics, and remove lower-signal technologies that distract from the stack the employer is actually hiring for.",
        },
      ],
    },
  },
  {
    slug: "resume-keyword-scanner-for-product-managers",
    headline: "Resume keyword scanner for product managers",
    eyebrow: "Product resumes",
    metaTitle: "Resume Keyword Scanner for Product Managers",
    metaDescription:
      "Scan a product manager resume for roadmap, experimentation, stakeholder, analytics, and execution language that matches modern PM job descriptions.",
    intro:
      "Product manager resumes win when they connect strategy to delivery. This page focuses on roadmap ownership, cross-functional leadership, experimentation, and measurable product outcomes instead of vague collaboration claims.",
    audience: "Associate, product, senior product, and growth product managers",
    path: "/resume-keyword-scanner-for-product-managers",
    keywords: [
      "resume keyword scanner for product managers",
      "product manager resume checker",
      "ATS resume checker for product managers",
      "product manager resume keywords",
    ],
    matchSignals: [
      "Roadmap, prioritization, experimentation, launch, and metrics language tied to specific product outcomes",
      "Stakeholder alignment across engineering, design, GTM, and leadership teams",
      "Customer insight, retention, growth, and analytics evidence showing product judgment",
    ],
    rewritePriorities: [
      "Turn ownership bullets into outcome bullets with adoption, revenue, retention, or efficiency metrics",
      "Mirror the exact PM specialization in the target job such as growth, platform, core product, or B2B SaaS",
      "Use feature launches, discovery work, and operating cadence details to prove execution depth",
    ],
    faq: [
      {
        question:
          "What keywords matter most for product manager resumes?",
        answer:
          "The strongest keywords are the ones that describe the product domain, ownership scope, operating cadence, analytics tools, and measurable outcomes the team hires for.",
      },
      {
        question:
          "How should PM candidates avoid keyword stuffing?",
        answer:
          "Use the job's language inside real launch, roadmap, experimentation, and collaboration examples rather than listing disconnected product terms in isolation.",
      },
    ],
    companionArticle: {
      slug: "product-manager-resume-examples-keywords-interview-prep",
      title:
        "Product manager resume examples, keyword list, and interview prep",
      metaTitle:
        "Product Manager Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "See how strong product manager resumes communicate roadmap ownership, product metrics, and cross-functional execution while supporting interview prep for PM hiring loops.",
      keywords: [
        "product manager resume examples",
        "product manager resume keywords",
        "product manager interview prep",
        "PM resume example",
      ],
      intro:
        "A product manager resume is strongest when it previews the same judgment a panel wants to test later. Clear positioning around roadmap ownership, prioritization, experimentation, and results improves ATS match quality and gives you cleaner stories for case-style interviews.",
      sections: [
        {
          title: "What good PM resume examples include",
          body:
            "High-performing PM resumes connect customer problems, product decisions, and business outcomes. Instead of saying you collaborated cross-functionally, show what you prioritized, how you influenced tradeoffs, what you shipped, and what moved afterward in activation, retention, conversion, or efficiency.",
        },
        {
          title: "Keywords that signal real PM scope",
          body:
            "Use domain-relevant language for discovery, roadmaps, experimentation, analytics, launches, stakeholder alignment, and the specific product environment you work in. Growth PM, platform PM, B2B SaaS PM, and consumer PM resumes should not read the same because the signal mix is different.",
        },
        {
          title: "How to translate resume bullets into PM interview stories",
          body:
            "Each bullet should prepare you for a product sense, execution, or leadership conversation. If you mention an experiment, be ready to explain the hypothesis, success metric, constraints, and why the result changed roadmap direction or team priorities.",
        },
        {
          title: "How to tailor faster without losing clarity",
          body:
            "Move the most relevant product domain examples to the top, tighten the summary around the target PM specialization, and strip generic collaboration filler. The goal is a resume that reads like a focused product narrative, not a backlog of responsibilities.",
        },
      ],
    },
  },
  {
    slug: "ats-resume-checker-for-data-analysts",
    headline: "ATS resume checker for data analysts",
    eyebrow: "Analytics resumes",
    metaTitle: "ATS Resume Checker for Data Analysts",
    metaDescription:
      "Evaluate how well a data analyst resume matches SQL, BI, experimentation, reporting, and stakeholder communication requirements in analytics job descriptions.",
    intro:
      "Data analyst resumes need more than a tools list. Recruiters and ATS filters look for business questions, analysis methods, dashboards, experimentation support, and decisions influenced by your work.",
    audience: "Data analysts, business analysts, and analytics specialists",
    path: "/ats-resume-checker-for-data-analysts",
    keywords: [
      "ATS resume checker for data analysts",
      "data analyst resume checker",
      "data analyst resume keyword scanner",
      "ATS scanner for analytics resume",
    ],
    matchSignals: [
      "SQL, spreadsheets, BI tools, experimentation, forecasting, and dashboard terms mapped to the job description",
      "Evidence that your analysis changed decisions, improved reporting, or uncovered growth and efficiency insights",
      "Clear communication of metrics definitions, business context, and stakeholder collaboration",
    ],
    rewritePriorities: [
      "Rewrite tool-heavy bullets into decision-heavy bullets with reporting impact and metric movement",
      "Match domain terms such as product analytics, marketing analytics, finance analytics, or operations reporting",
      "Show end-to-end workflow from data extraction and cleaning to dashboard delivery and stakeholder adoption",
    ],
    faq: [
      {
        question:
          "How should a data analyst resume score higher with ATS filters?",
        answer:
          "Use the job's analytics stack and business domain language while proving that your dashboards, models, or reports changed decisions or improved KPIs.",
      },
      {
        question:
          "Should data analysts list every dashboard tool they have used?",
        answer:
          "Only list tools that matter for the target role and support them with project or stakeholder outcomes so the resume stays relevant instead of bloated.",
      },
    ],
    companionArticle: {
      slug: "data-analyst-resume-examples-keywords-interview-prep",
      title:
        "Data analyst resume examples, keyword list, and interview prep",
      metaTitle:
        "Data Analyst Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Build a stronger data analyst resume with better examples, analytics keyword coverage, and interview stories tied to dashboards, experiments, and business decisions.",
      keywords: [
        "data analyst resume examples",
        "data analyst resume keywords",
        "data analyst interview prep",
        "analytics resume example",
      ],
      intro:
        "Strong data analyst applications connect tooling to business thinking. Recruiters want to see the questions you answered, the data workflow you owned, and how your work influenced reporting, product decisions, or operational performance.",
      sections: [
        {
          title: "What better data analyst resume examples look like",
          body:
            "The strongest examples explain the business question, analysis method, dataset or dashboard work, and decision impact. A bullet about building a Tableau dashboard gets stronger when it also explains which metric it clarified, who used it, and what changed because stakeholders could trust the reporting.",
        },
        {
          title: "Keyword groups recruiters expect for analytics roles",
          body:
            "Use the stack and workflow language that matches the role, including SQL, Excel, Python, dashboards, experimentation, forecasting, KPI reporting, or stakeholder analysis. Domain fit matters too, so marketing analytics, product analytics, and finance analytics roles should use different supporting language.",
        },
        {
          title: "Interview prep starts with your strongest bullets",
          body:
            "Any bullet about experimentation, reporting, or forecasting should become a short interview case you can explain clearly. Practice describing the business problem, data quality issues, logic choices, and how you communicated findings to non-technical stakeholders.",
        },
        {
          title: "A better way to tailor analytics resumes",
          body:
            "Prioritize the datasets, dashboards, and KPIs that match the target team. Then tighten low-signal tool lists and surface the examples where your analysis directly improved a decision, process, or metric that the employer cares about.",
        },
      ],
    },
  },
  {
    slug: "resume-keyword-scanner-for-customer-success-managers",
    headline: "Resume keyword scanner for customer success managers",
    eyebrow: "Customer success resumes",
    metaTitle: "Resume Keyword Scanner for Customer Success Managers",
    metaDescription:
      "Scan a customer success manager resume for retention, renewals, onboarding, expansion, risk management, and account strategy language aligned to CSM roles.",
    intro:
      "Customer success resumes are strongest when they connect relationships to revenue and retention. This page targets onboarding, renewals, expansion, executive communication, and churn-risk management language that hiring teams look for.",
    audience: "Customer success managers, account managers, and post-sales leads",
    path: "/resume-keyword-scanner-for-customer-success-managers",
    keywords: [
      "resume keyword scanner for customer success managers",
      "customer success manager resume checker",
      "ATS resume checker for customer success",
      "CSM resume keywords",
    ],
    matchSignals: [
      "Renewal, retention, onboarding, adoption, expansion, and health-score language that fits the target book of business",
      "Cross-functional work with sales, support, product, and implementation teams",
      "Revenue-linked proof such as churn reduction, NRR expansion, time-to-value, or renewal improvements",
    ],
    rewritePriorities: [
      "Shift from relationship adjectives to renewal, expansion, and adoption outcomes",
      "Match account segment language such as SMB, mid-market, enterprise, or strategic accounts",
      "Show customer lifecycle ownership from onboarding through renewal planning and escalation handling",
    ],
    faq: [
      {
        question:
          "What do ATS-friendly customer success resumes emphasize?",
        answer:
          "They emphasize retention metrics, account ownership, implementation and onboarding scope, and the commercial outcomes tied to customer health and expansion.",
      },
      {
        question:
          "How can a CSM resume use keywords without sounding generic?",
        answer:
          "Anchor every keyword in a real customer lifecycle example with measurable adoption, renewal, expansion, or churn outcomes.",
      },
    ],
    companionArticle: {
      slug: "customer-success-manager-resume-examples-keywords-interview-prep",
      title:
        "Customer success manager resume examples, keyword list, and interview prep",
      metaTitle:
        "Customer Success Manager Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Improve a customer success manager resume with better retention and expansion examples, stronger CSM keywords, and interview prep tied to renewals, onboarding, and account strategy.",
      keywords: [
        "customer success manager resume examples",
        "customer success manager resume keywords",
        "customer success interview prep",
        "CSM resume example",
      ],
      intro:
        "Customer success hiring teams want resumes that connect relationship management to commercial outcomes. Better resume positioning also helps you prepare for interviews about executive communication, renewal risk, onboarding, and account growth.",
      sections: [
        {
          title: "What strong CSM resume examples prove",
          body:
            "The best examples show ownership across onboarding, adoption, renewal planning, and escalation management. They connect customer interaction to outcomes like improved retention, lower churn risk, faster time-to-value, or expansion revenue instead of stopping at phrases like managed relationships.",
        },
        {
          title: "Keywords that matter in customer success resumes",
          body:
            "Use language that matches the book of business and lifecycle scope in the job description. That often includes onboarding, renewals, expansion, customer health, executive business reviews, account strategy, risk mitigation, and collaboration with sales, support, and product.",
        },
        {
          title: "How resume bullets turn into interview answers",
          body:
            "If you say you reduced churn risk or improved adoption, practice the story behind it. Interviewers will want to hear how you spotted the issue, influenced the account plan, coordinated internally, and kept the customer moving toward a measurable business outcome.",
        },
        {
          title: "Tailoring moves that increase relevance quickly",
          body:
            "Match your title, summary, and top bullets to the customer segment and lifecycle complexity in the target role. Enterprise, SMB, and strategic-account roles call for different keywords and examples, so surface the closest-fit experience early.",
        },
      ],
    },
  },
  {
    slug: "ats-resume-checker-for-sales-representatives",
    headline: "ATS resume checker for sales representatives",
    eyebrow: "Sales resumes",
    metaTitle: "ATS Resume Checker for Sales Representatives",
    metaDescription:
      "Check sales representative resumes for quota attainment, pipeline generation, discovery, closing, CRM, and territory language that matches modern sales job descriptions.",
    intro:
      "Sales resumes need to prove consistent performance fast. Recruiters and ATS filters look for quota coverage, deal motion, pipeline generation, customer segment fit, and the ability to move opportunities through a repeatable process.",
    audience: "Sales development reps, account executives, and revenue reps",
    path: "/ats-resume-checker-for-sales-representatives",
    keywords: [
      "ATS resume checker for sales representatives",
      "sales resume checker",
      "sales resume keyword scanner",
      "account executive resume keywords",
    ],
    matchSignals: [
      "Quota attainment, pipeline creation, conversion, closing, and CRM process language tied to the target role",
      "Segment fit such as SMB, mid-market, enterprise, inbound, outbound, or full-cycle sales",
      "Proof of revenue impact through bookings, win rate, expansion, or sales efficiency improvements",
    ],
    rewritePriorities: [
      "Replace vague sales support bullets with attainment, pipeline, and deal progression metrics",
      "Mirror the target sales motion and customer segment in the summary and experience sections",
      "Use tools, territory, and process language only when it supports a clear revenue story",
    ],
    faq: [
      {
        question: "What should sales resumes emphasize for ATS screening?",
        answer:
          "They should emphasize measurable attainment, pipeline generation, segment fit, and evidence that you can run the sales motion the employer needs.",
      },
      {
        question: "How can sales candidates use keywords without sounding inflated?",
        answer:
          "Use sales keywords inside real quota, conversion, and customer-segment examples instead of listing generic revenue terms without outcomes.",
      },
    ],
    companionArticle: {
      slug: "sales-resume-examples-keywords-interview-prep",
      title:
        "Sales resume examples, keyword list, and interview prep",
      metaTitle: "Sales Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Improve a sales resume with better quota-focused examples, stronger keyword coverage, and interview prep for discovery, objection handling, and deal strategy.",
      keywords: [
        "sales resume examples",
        "sales resume keywords",
        "sales interview prep",
        "account executive resume example",
      ],
      intro:
        "Sales hiring teams want clarity on how you generate pipeline, progress deals, and hit targets. A sharper sales resume also creates cleaner talking points for recruiter screens and interviews about territory, methodology, and attainment.",
      sections: [
        {
          title: "What strong sales resume examples include",
          body:
            "The best sales examples show quota attainment, pipeline creation, average deal size, conversion improvements, and customer segment context. A bullet becomes stronger when it shows the motion you ran and the revenue result it produced instead of only saying you managed accounts or closed business.",
        },
        {
          title: "Keywords that signal the right sales motion",
          body:
            "Use language that matches the target role, including outbound prospecting, discovery, qualification, full-cycle selling, renewals, expansion, MEDDICC, Salesforce, or territory planning when those themes reflect real experience. Keywords work best when they reinforce a clear pattern of execution.",
        },
        {
          title: "How your resume should support interview prep",
          body:
            "Every performance bullet should prepare you for deeper questions about process and decision-making. If you mention pipeline creation, be ready to explain list building, messaging, follow-up cadence, objections, and how you improved conversion quality over time.",
        },
        {
          title: "How to tailor a sales resume faster",
          body:
            "Lead with the segment, motion, and metric profile closest to the target role. Then tighten older or lower-signal achievements so your resume reads like a focused revenue story, not a generic account history.",
        },
      ],
    },
  },
  {
    slug: "resume-keyword-scanner-for-digital-marketers",
    headline: "Resume keyword scanner for digital marketers",
    eyebrow: "Marketing resumes",
    metaTitle: "Resume Keyword Scanner for Digital Marketers",
    metaDescription:
      "Scan digital marketing resumes for campaign, growth, content, SEO, performance marketing, analytics, and funnel language aligned to modern marketing roles.",
    intro:
      "Marketing resumes perform best when they connect channels and campaigns to pipeline, revenue, or growth outcomes. Hiring teams want to see more than platform familiarity; they want proof of audience insight, experimentation, and execution quality.",
    audience: "Digital marketers, growth marketers, and performance marketers",
    path: "/resume-keyword-scanner-for-digital-marketers",
    keywords: [
      "resume keyword scanner for digital marketers",
      "digital marketing resume checker",
      "marketing resume keywords",
      "ATS resume checker for marketers",
    ],
    matchSignals: [
      "Campaign, channel, content, SEO, paid media, lifecycle, and analytics language matched to the target role",
      "Clear metrics such as pipeline, ROAS, CAC efficiency, lead generation, conversion, or audience growth",
      "Evidence of experimentation, messaging, positioning, and cross-functional execution",
    ],
    rewritePriorities: [
      "Replace activity-heavy bullets with campaign goals, test logic, and business outcomes",
      "Match the exact marketing specialization such as growth, lifecycle, content, SEO, or performance",
      "Use platform and channel keywords only when they support a measurable growth story",
    ],
    faq: [
      {
        question: "What do hiring teams look for in marketing resumes?",
        answer:
          "They look for channel relevance, campaign ownership, experimentation quality, and metrics that prove your work moved demand, revenue, or efficiency.",
      },
      {
        question: "How should marketers use resume keywords effectively?",
        answer:
          "Use marketing keywords inside real campaign stories with channel context, testing decisions, and measurable outcomes rather than listing platforms in isolation.",
      },
    ],
    companionArticle: {
      slug: "digital-marketer-resume-examples-keywords-interview-prep",
      title:
        "Digital marketer resume examples, keyword list, and interview prep",
      metaTitle:
        "Digital Marketer Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Strengthen a digital marketing resume with better campaign examples, role-specific keyword coverage, and interview prep around funnels, testing, and growth strategy.",
      keywords: [
        "digital marketing resume examples",
        "marketing resume keywords",
        "digital marketing interview prep",
        "growth marketer resume example",
      ],
      intro:
        "Digital marketing resumes should make channel execution and growth thinking easy to scan. The same clarity also helps during interviews, where hiring teams usually test experimentation, campaign strategy, and how you connect marketing work to business results.",
      sections: [
        {
          title: "What strong marketing resume examples reveal",
          body:
            "The best examples show target audience, channel strategy, campaign objective, and measurable outcomes such as pipeline, conversion, ROAS, lead quality, or organic growth. Generic claims about running campaigns are weaker than examples that show why a tactic worked and what it changed.",
        },
        {
          title: "Keyword clusters that matter for digital marketing roles",
          body:
            "Use exact role language for SEO, paid acquisition, content strategy, lifecycle, email, demand generation, analytics, and experimentation when it reflects real work. A lifecycle marketing resume should not lean on the same keyword mix as a paid acquisition or content role.",
        },
        {
          title: "How resume bullets support interview stories",
          body:
            "If you say you improved conversion or increased pipeline, you should be ready to explain segmentation, creative or messaging choices, test design, and what you learned from the result. Resume bullets should set up crisp answers, not create fuzzy claims you cannot defend.",
        },
        {
          title: "How to tailor marketing resumes more efficiently",
          body:
            "Lead with the channel mix and funnel outcomes closest to the role, then move secondary platforms lower. This keeps the narrative focused on the employer's growth problem instead of turning your resume into a long software inventory.",
        },
      ],
    },
  },
  {
    slug: "ats-resume-checker-for-ux-designers",
    headline: "ATS resume checker for UX designers",
    eyebrow: "Design resumes",
    metaTitle: "ATS Resume Checker for UX Designers",
    metaDescription:
      "Check UX designer resumes for user research, interaction design, prototyping, accessibility, design systems, and cross-functional product language that matches design roles.",
    intro:
      "UX resumes need to bridge craft and business context. Hiring teams want evidence of research, interaction design, accessibility thinking, collaboration, and the ability to influence product outcomes through design decisions.",
    audience: "UX designers, product designers, and interaction designers",
    path: "/ats-resume-checker-for-ux-designers",
    keywords: [
      "ATS resume checker for UX designers",
      "UX designer resume checker",
      "UX resume keyword scanner",
      "product designer resume keywords",
    ],
    matchSignals: [
      "Research, flows, wireframes, prototyping, usability, accessibility, and design-system language aligned to the job description",
      "Evidence of collaboration with product managers, engineers, researchers, and stakeholders",
      "Outcomes showing improved usability, engagement, task success, conversion, or design consistency",
    ],
    rewritePriorities: [
      "Rewrite deliverable-only bullets into problem, process, and outcome narratives",
      "Match the target role's emphasis on research, systems, visual craft, or product strategy",
      "Use portfolio and design tool keywords only when they support a clear case-study style story",
    ],
    faq: [
      {
        question: "What should UX resumes emphasize for ATS screening?",
        answer:
          "They should emphasize research-to-design workflow, collaboration, accessibility, and measurable impact rather than only listing tools or screens produced.",
      },
      {
        question: "Do UX designers need both portfolio and resume keywords?",
        answer:
          "Yes. The resume needs the right terminology to get screened in, while the portfolio proves the depth behind those terms.",
      },
    ],
    companionArticle: {
      slug: "ux-designer-resume-examples-keywords-interview-prep",
      title: "UX designer resume examples, keyword list, and interview prep",
      metaTitle:
        "UX Designer Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Improve a UX designer resume with stronger case-style examples, better design keyword coverage, and interview prep for portfolio walkthroughs and product collaboration.",
      keywords: [
        "UX designer resume examples",
        "UX designer resume keywords",
        "UX designer interview prep",
        "product designer resume example",
      ],
      intro:
        "UX hiring is usually a chain of screens, portfolio reviews, and collaboration interviews. A strong resume should preview the research, design thinking, and product impact that you will later defend through case studies and stakeholder conversations.",
      sections: [
        {
          title: "What better UX resume examples communicate",
          body:
            "The best examples show the user problem, research or insight source, design move, and measurable outcome. A bullet becomes much stronger when it explains how a workflow, information architecture, or prototype improved usability, conversion, adoption, or accessibility.",
        },
        {
          title: "Keywords that matter for UX and product design roles",
          body:
            "Use language that matches the job's design maturity and focus, including user research, interaction design, prototyping, design systems, accessibility, usability testing, or stakeholder collaboration. Tool names matter less than whether the process and outcome align to the role.",
        },
        {
          title: "How your resume should prepare you for portfolio interviews",
          body:
            "Every meaningful resume bullet should map to a story you can expand in a portfolio walkthrough. If you mention a redesign, be ready to explain the problem framing, tradeoffs, research signal, collaboration dynamics, and what you learned after launch.",
        },
        {
          title: "How to tailor a UX resume quickly",
          body:
            "Bring the closest-fit domain and workflow examples higher, especially if the role is more research-heavy, systems-heavy, or growth-oriented. That helps recruiters see relevance fast before they even open a portfolio link.",
        },
      ],
    },
  },
  {
    slug: "ats-resume-checker-for-qa-engineers",
    headline: "ATS resume checker for QA engineers",
    eyebrow: "Quality engineering resumes",
    metaTitle: "ATS Resume Checker for QA Engineers",
    metaDescription:
      "Evaluate QA engineer resumes for manual testing, automation, regression, defect management, quality strategy, and release confidence language aligned to testing roles.",
    intro:
      "QA resumes should make quality ownership visible. Hiring teams want to see test strategy, automation depth, release support, defect prevention, and the ability to improve confidence across real engineering workflows.",
    audience: "QA engineers, SDETs, and software test engineers",
    path: "/ats-resume-checker-for-qa-engineers",
    keywords: [
      "ATS resume checker for QA engineers",
      "QA engineer resume checker",
      "test engineer resume keyword scanner",
      "software testing resume keywords",
    ],
    matchSignals: [
      "Manual testing, test automation, regression, test cases, defect tracking, and release validation language matched to the role",
      "Evidence of framework ownership, automation coverage, bug prevention, and cross-functional release work",
      "Quality outcomes such as escape reduction, faster validation, better coverage, or improved deployment confidence",
    ],
    rewritePriorities: [
      "Replace activity lists with quality outcomes, automation depth, and release impact",
      "Match the target role's mix of manual, automation, API, UI, performance, or mobile testing",
      "Use tooling and framework keywords only when they reinforce how you improved confidence or speed",
    ],
    faq: [
      {
        question: "What should QA resumes focus on for ATS filters?",
        answer:
          "They should focus on the testing scope, automation depth, release process, and measurable quality improvements that match the target team's workflow.",
      },
      {
        question: "How can QA candidates stand out beyond tool lists?",
        answer:
          "Show how your testing strategy reduced bugs, accelerated releases, or improved coverage and team confidence rather than relying on framework names alone.",
      },
    ],
    companionArticle: {
      slug: "qa-engineer-resume-examples-keywords-interview-prep",
      title: "QA engineer resume examples, keyword list, and interview prep",
      metaTitle:
        "QA Engineer Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Make a QA engineer resume stronger with better test-ownership examples, sharper automation keywords, and interview prep for test strategy and release-quality conversations.",
      keywords: [
        "QA engineer resume examples",
        "QA engineer resume keywords",
        "QA interview prep",
        "test engineer resume example",
      ],
      intro:
        "Quality engineering resumes should show how you reduce risk and improve release confidence. Those same examples also support interviews where teams test your judgment around coverage, automation tradeoffs, bug severity, and collaboration with developers.",
      sections: [
        {
          title: "What strong QA resume examples show",
          body:
            "The best examples show what you tested, how you tested it, and what quality result followed. A strong bullet might connect automation work to fewer regressions, faster release cycles, or stronger API and UI confidence across critical flows.",
        },
        {
          title: "Keywords that matter for QA and SDET roles",
          body:
            "Use the exact testing scope from the job description, including manual testing, automation, API testing, regression, performance, CI, release validation, or defect triage when those themes match your work. The right keyword mix depends on whether the role leans more toward QA execution or engineering-heavy automation.",
        },
        {
          title: "How resume bullets support QA interview prep",
          body:
            "Every important bullet should become a crisp story about risk, scope, approach, and outcome. If you mention a flaky test suite or release issue, be ready to explain your debugging process, prioritization logic, and how you improved stability going forward.",
        },
        {
          title: "How to tailor a testing resume efficiently",
          body:
            "Bring the testing environments and automation depth closest to the target role to the top. Then trim older or less relevant tools so the resume emphasizes the quality problems that team is actually trying to solve.",
        },
      ],
    },
  },
  {
    slug: "ats-resume-checker-for-devops-engineers",
    headline: "ATS resume checker for DevOps engineers",
    eyebrow: "Platform and DevOps resumes",
    metaTitle: "ATS Resume Checker for DevOps Engineers",
    metaDescription:
      "Check DevOps engineer resumes for cloud, CI/CD, infrastructure as code, observability, incident response, and reliability language that matches platform roles.",
    intro:
      "DevOps resumes need to show infrastructure depth and operational judgment. Hiring teams look for cloud systems, automation, deployment workflows, observability, security awareness, and measurable improvements to speed and reliability.",
    audience: "DevOps engineers, platform engineers, and site reliability engineers",
    path: "/ats-resume-checker-for-devops-engineers",
    keywords: [
      "ATS resume checker for DevOps engineers",
      "DevOps resume checker",
      "DevOps resume keyword scanner",
      "platform engineer resume keywords",
    ],
    matchSignals: [
      "Cloud, CI/CD, IaC, Kubernetes, observability, automation, and incident response language aligned to the role",
      "Evidence of reliability, deployment speed, cost optimization, security hygiene, and developer enablement",
      "Ownership over tooling, pipelines, infrastructure, or operational practices that scale across teams",
    ],
    rewritePriorities: [
      "Replace tool-only bullets with system ownership, reliability outcomes, and automation impact",
      "Match the employer's environment such as AWS, Azure, GCP, Kubernetes, Terraform, or CI systems where relevant",
      "Surface incidents, migrations, and platform improvements that prove judgment under real operational pressure",
    ],
    faq: [
      {
        question: "What do ATS-friendly DevOps resumes emphasize?",
        answer:
          "They emphasize cloud and automation relevance, but also operational outcomes like reliability, deployment speed, cost control, and developer enablement.",
      },
      {
        question: "Should DevOps resumes be tool-heavy?",
        answer:
          "Only enough to prove environment fit. The stronger signal is how those tools changed reliability, speed, scale, or incident response quality.",
      },
    ],
    companionArticle: {
      slug: "devops-engineer-resume-examples-keywords-interview-prep",
      title: "DevOps engineer resume examples, keyword list, and interview prep",
      metaTitle:
        "DevOps Engineer Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Build a stronger DevOps resume with better infrastructure examples, sharper cloud and CI/CD keywords, and interview prep for reliability, automation, and incident response topics.",
      keywords: [
        "DevOps engineer resume examples",
        "DevOps resume keywords",
        "DevOps interview prep",
        "platform engineer resume example",
      ],
      intro:
        "DevOps and platform hiring loops often move from resume screening straight into architecture, incident, and automation discussions. A stronger resume makes those conversations easier because it surfaces your best infrastructure stories before the interview starts.",
      sections: [
        {
          title: "What stronger DevOps resume examples include",
          body:
            "The best examples explain the infrastructure or deployment problem, the automation or platform change you drove, and the measurable result. That might be faster deploys, lower cloud cost, fewer incidents, better observability, or improved developer self-service.",
        },
        {
          title: "Keywords that matter for platform and DevOps roles",
          body:
            "Use environment-specific language such as Terraform, Kubernetes, AWS, GCP, CI/CD, monitoring, incident response, security hardening, or infrastructure as code only when it reflects real ownership. Keywords land better when they describe the systems you shaped, not just tools you touched.",
        },
        {
          title: "How resume bullets prepare you for technical interviews",
          body:
            "If you say you improved reliability or deployment speed, expect deeper questions about bottlenecks, tradeoffs, rollout risk, and operational controls. Resume bullets should be written so you can defend the design and the impact behind them without stretching.",
        },
        {
          title: "How to tailor a DevOps resume for each role",
          body:
            "Match the target environment first, then emphasize the operational problems most relevant to the team, such as scale, observability, compliance, or developer experience. This makes the resume feel close to the role before a recruiter even reaches a technical screener.",
        },
      ],
    },
  },
  {
    slug: "resume-keyword-scanner-for-financial-analysts",
    headline: "Resume keyword scanner for financial analysts",
    eyebrow: "Finance resumes",
    metaTitle: "Resume Keyword Scanner for Financial Analysts",
    metaDescription:
      "Scan financial analyst resumes for modeling, forecasting, budgeting, variance analysis, reporting, and stakeholder decision-support language aligned to finance roles.",
    intro:
      "Finance resumes perform best when they connect analytical rigor to business decisions. Hiring teams look for modeling, forecasting, reporting accuracy, planning discipline, and the ability to translate numbers into recommendations for leadership.",
    audience: "Financial analysts, FP&A analysts, and corporate finance candidates",
    path: "/resume-keyword-scanner-for-financial-analysts",
    keywords: [
      "resume keyword scanner for financial analysts",
      "financial analyst resume checker",
      "finance resume keywords",
      "FP&A resume checker",
    ],
    matchSignals: [
      "Modeling, forecasting, budgeting, variance analysis, reporting, and planning language matched to the target role",
      "Evidence of decision support, executive reporting, scenario analysis, and financial process ownership",
      "Outcomes tied to forecast quality, planning speed, margin insight, or operational clarity",
    ],
    rewritePriorities: [
      "Shift from spreadsheet task lists to decision-support and accuracy outcomes",
      "Match finance specialization such as FP&A, corporate finance, strategic finance, or reporting",
      "Use ERP, BI, and modeling keywords only when they reinforce business impact and analytical depth",
    ],
    faq: [
      {
        question: "What keywords matter most for finance resumes?",
        answer:
          "The best finance keywords describe the analytical workflow, planning cadence, reporting audience, and business decisions the role supports.",
      },
      {
        question: "How should financial analysts avoid keyword stuffing?",
        answer:
          "Anchor finance terms in real forecasting, reporting, variance, and planning examples with measurable decision-making value.",
      },
    ],
    companionArticle: {
      slug: "financial-analyst-resume-examples-keywords-interview-prep",
      title:
        "Financial analyst resume examples, keyword list, and interview prep",
      metaTitle:
        "Financial Analyst Resume Examples, Keywords, and Interview Prep",
      metaDescription:
        "Improve a financial analyst resume with better modeling and reporting examples, stronger finance keyword coverage, and interview prep for forecasting and decision-support discussions.",
      keywords: [
        "financial analyst resume examples",
        "financial analyst resume keywords",
        "financial analyst interview prep",
        "FP&A resume example",
      ],
      intro:
        "Financial analyst resumes need to show analytical rigor and business judgment together. A sharper resume also makes interview prep easier because the same bullets that improve ATS relevance should become clean stories about planning, forecasting, and decision support.",
      sections: [
        {
          title: "What strong finance resume examples include",
          body:
            "The best finance examples show the planning or reporting problem, the analytical method, and the business value created. A bullet about forecasting becomes stronger when it explains the model, the stakeholder use case, and how the work improved visibility, accuracy, or speed of decision-making.",
        },
        {
          title: "Keywords that matter in financial analyst resumes",
          body:
            "Use role-relevant language such as forecasting, budgeting, variance analysis, modeling, financial reporting, scenario planning, and executive support when it reflects the job and your background. The right keyword mix depends heavily on whether the role is FP&A, strategic finance, reporting, or operational finance.",
        },
        {
          title: "How resume bullets support finance interview prep",
          body:
            "Every important bullet should prepare you for questions about assumptions, data sources, tradeoffs, and stakeholder impact. If you mention variance analysis or a forecast model, practice explaining how you built it, how you validated it, and what decisions it changed.",
        },
        {
          title: "How to tailor finance resumes efficiently",
          body:
            "Move the planning, reporting, or modeling work closest to the target role to the top and cut low-signal spreadsheet task language. Recruiters should be able to see your finance specialization and the decisions you support within seconds.",
        },
      ],
    },
  },
];

export function getRoleLandingPage(slug: string) {
  return roleLandingPages.find((page) => page.slug === slug);
}

export function getRoleLandingPageByArticleSlug(articleSlug: string) {
  return roleLandingPages.find(
    (page) => page.companionArticle.slug === articleSlug,
  );
}

export function getRoleCompanionArticlePath(articleSlug: string): `/blog/${string}` {
  return `/blog/${articleSlug}`;
}