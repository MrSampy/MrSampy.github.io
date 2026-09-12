const DATA = {
  personal: {
    name: "Serhii Kolosov",
    title: "Full Stack .NET Developer",
    email: "mynameisserzheo@gmail.com",
    phone: "+47 96 86 95 07",
    github: "https://github.com/MrSampy",
    linkedin: "https://www.linkedin.com/in/serhiy-kolosov-00118124b",
    telegram: "https://t.me/MrSampy",
    location: "Stavanger, Norway",
    cvFile: "assets/CV.pdf",
    cvName: "Serhii-Kolosov-CV.pdf",
  },

  metrics: [
    { value: 4, suffix: " yrs", label: "on one insurance platform" },
    { value: 7, suffix: "", label: "insurers in production" },
    { value: 140, suffix: "+", label: "features shipped" },
    { value: 800, suffix: "+", label: "database migrations" },
    { value: 1100, suffix: "+", label: "pull requests merged" },
    { value: 7, suffix: "×", label: "test-suite growth" },
  ],

  now: {
    doing: [
      "Shipping policy-lifecycle features at In-Core",
      "M.Sc. in Software Engineering at KPI",
      "Building Lexify — vocabulary with spaced repetition and AI",
      "Learning Norwegian (A1)",
    ],
    lookingFor:
      "A product team shipping .NET at scale, where quality is owned by the people who write the code. Remote or hybrid across Europe.",
  },

  skills: [
    { key: "backend", label: "Backend", items: ["C#", "ASP.NET Core / MVC", "Entity Framework Core", "Microservices", "Design & architecture patterns", "Go"] },
    { key: "data", label: "Data", items: ["MS SQL Server", "T-SQL", "Stored procedures", "Migrations", "Performance tuning"] },
    { key: "frontend", label: "Frontend & APIs", items: ["JavaScript", "REST", "SOAP", "Partner & registry integrations"] },
    { key: "quality", label: "Quality", items: ["xUnit", "Moq", "SpecFlow", "Selenium", "UI / API test automation", "Integration & e2e testing", "Test strategy"] },
    { key: "tooling", label: "Tooling", items: ["Azure DevOps", "Git", "Docker", "CI / CD"] },
    { key: "exploring", label: "Exploring", exploring: true, items: ["Python", "RAG", "Ollama", "ChromaDB", "React", "PostgreSQL", "RabbitMQ"] },
  ],

  languages: [
    { name: "Ukrainian", level: "native" },
    { name: "English", level: "B2" },
    { name: "Norwegian", level: "A1, learning" },
    { name: "Russian", level: "C2" },
  ],

  experience: {
    company: "In-Core",
    period: "Sep 2022 — Present",
    intro:
      "Policy administration platform for 7 insurance companies — one product, four years, from test automation through QA leadership into feature development.",
    roles: [
      {
        period: "May 2023 — Present",
        role: "Software Engineer",
        location: "Kyiv → Stavanger",
        current: true,
        summary:
          "Own policy-lifecycle features end to end — from domain logic and SQL to the web UI — so insurers launch new products through configuration rather than custom code.",
        stack: ["C#", ".NET / ASP.NET Core", "EF Core", "MS SQL Server", "JavaScript", "Azure DevOps"],
        highlights: [
          { value: "140+", text: "features across 7 insurers and a bank channel" },
          { value: "6", text: "external integrations — registries, e-signature, payments, bank API" },
          { value: "800+", text: "versioned migrations across 5 customer databases" },
          { value: "600 → 4,100", text: "tests in the platform suite, 430 of them mine" },
        ],
        bullets: [
          "Own end-to-end delivery of policy-lifecycle features — product configuration, underwriting rules, commission and tariff plans, sales-channel restrictions, prolongation and cross-sale flows — from domain logic and SQL to web UI, so insurers launch new products through configuration rather than custom code. 140+ features shipped across 7 insurer deployments and a bank partner channel.",
          "Integrated the platform with a national motor-insurance bureau, the state business registry, the central bank's intermediaries registry, an e-signature provider, a payment provider and a bank's partner API, and extended the platform's own REST Gateway API — removing manual registry lookups and document hand-offs from policy issuance.",
          "Author of 800+ versioned database migrations that keep five customer databases in sync with product configuration.",
          "Brought unit testing to modules that had none: 430 xUnit/Moq tests across 12 test projects and Jest coverage for the legacy JavaScript front end, contributing to a 7× growth of the platform test suite (600 → 4,100 tests) while modernising legacy code on current .NET.",
          "Serve as a first-line owner for production issues raised by insurers and business users: 600+ defects resolved in 2025–2026 with the root cause fixed, not patched, keeping policy issuance uninterrupted.",
          "1,100+ pull requests merged in a sprint-driven Azure DevOps flow; 93% of committed work closed within its sprint.",
        ],
      },
      {
        period: "Jan 2023 — May 2023",
        role: "QA Team Lead",
        location: "Kyiv",
        current: false,
        summary:
          "Led the platform QA team and owned the release quality gate on a two-week sprint cadence.",
        stack: ["Azure Test Plans", "SpecFlow", "SQL", "Test strategy"],
        highlights: [
          { value: "3", text: "engineers led, release gate owned" },
          { value: "5×", text: "fewer critical-severity defects year over year" },
          { value: "100+", text: "backlog items with acceptance criteria" },
          { value: "400+", text: "fixes verified before release, ~1-day median" },
        ],
        bullets: [
          "Led the platform QA team (3 engineers) and owned the release quality gate on a two-week sprint cadence; the year closed with 5× fewer critical-severity defects than the previous one.",
          "Set the test strategy: acceptance criteria on 100+ backlog items, Azure Test Plans suites, and SpecFlow regression scenarios covering the policy lifecycle for six insurer configurations.",
          "Ran defect triage and prioritisation for the team — planned 1,000+ work items, verified 400+ fixes before release with a median turnaround of about a day — and onboarded two new testers.",
          "Verified commission and underwriting calculations directly in SQL against customer-scale databases, catching pricing errors before they reached policies.",
        ],
      },
      {
        period: "Sep 2022 — Jan 2023",
        role: "Automation QA Engineer",
        location: "Kyiv",
        current: false,
        summary:
          "Co-built the automated regression suite for six insurer deployments and the reusable framework it runs on.",
        stack: ["Selenium", "MSTest", "SpecFlow", "C#", "Azure Test Plans"],
        highlights: [
          { value: "1,300", text: "Selenium/MSTest UI tests and 330 SpecFlow scenarios" },
          { value: "950+", text: "commits as one of two framework owners" },
          { value: "50+", text: "test-data builders and 90+ shared helpers" },
        ],
        bullets: [
          "Co-built the automated regression suite for six insurer deployments — 1,300 Selenium/MSTest UI tests, 330 SpecFlow scenarios and an API test project — covering the most business-critical policy flows; one of the two main framework contributors (950+ commits).",
          "Designed reusable framework layers: test-data builders (50+), page objects, shared helpers (90+), per-customer configuration and a REST client — cutting the cost of adding a new insurer's suite to configuration plus scenarios.",
          "Complemented automation with exploratory testing of new features, documenting 70+ test cases and 90 test suites in Azure Test Plans.",
        ],
      },
    ],
  },

  projects: [
    {
      slug: "policy-platform",
      title: "Policy Administration Platform",
      kind: "Client work · In-Core · closed source",
      role: "Software Engineer",
      year: "2022 — now",
      stack: ["C#", "ASP.NET Core", "EF Core", "MS SQL Server", "JavaScript", "Azure DevOps"],
      summary: "Policy administration platform for 7 insurance companies — the full policy lifecycle from product configuration to issuance.",
      problem:
        "Seven insurers and a bank channel need new products, tariffs and underwriting rules without waiting for custom code — while the platform exchanges data with state registries, payment and e-signature providers.",
      built:
        "Policy-lifecycle features end to end: product configuration, underwriting rules, commission and tariff plans, sales-channel restrictions, prolongation and cross-sale flows. Six external integrations and the platform's REST Gateway API. 800+ versioned migrations and unit-test coverage where there was none.",
      outcome:
        "140+ features shipped across 7 insurer deployments and a bank partner channel; the test suite grew 7× (600 → 4,100); manual registry lookups and document hand-offs are gone from issuance.",
      github: null,
      demo: null,
      confidential: true,
    },
    {
      slug: "lexify",
      title: "Lexify",
      kind: "Side project · live",
      role: null,
      year: null,
      stack: ["AI", "Spaced repetition", "Web app"],
      summary: "A production web app for learning vocabulary in any language, scheduled by spaced repetition and explained by AI.",
      problem:
        "Vocabulary apps drill words on fixed schedules, so learners over-review what they already know and forget what they don't.",
      built:
        "A web app that schedules every word with a spaced-repetition algorithm so each review lands right before it would be forgotten, while an AI layer generates example sentences, explanations and quizzes at the learner's level. Progress tracking and daily streaks keep the habit going.",
      outcome:
        "Live at lexify-app.com — learners stay consistent over months, not days.",
      github: null,
      demo: "https://lexify-app.com/",
    },
    {
      slug: "pr-reviewr",
      title: "Pr Reviewr for Azure",
      kind: "Open source",
      role: null,
      year: null,
      stack: ["Python", "ChromaDB", "Ollama", "RAG", "Azure DevOps"],
      summary: "A PR review assistant that reads your codebase and past review comments before it comments on a diff.",
      problem:
        "Pull-request reviews in Azure DevOps repeat the same feedback and lose the context of what was already discussed in earlier reviews.",
      built:
        "A retrieval-augmented assistant that indexes the codebase and past review comments into ChromaDB, retrieves the relevant context for each diff and posts actionable comments straight to Azure DevOps — powered by a local LLM via Ollama.",
      outcome:
        "Reviews arrive with project-specific context, and the code never leaves the machine.",
      github: "https://github.com/MrSampy/Pr-Reviewr",
      demo: null,
    },
    {
      slug: "sar-platform",
      title: "SAR Coordination Platform",
      kind: "Open source",
      role: null,
      year: null,
      stack: ["C#", ".NET 8", "React", "PostgreSQL", "RabbitMQ", "Docker"],
      summary: "A microservices platform for coordinating search-and-rescue operations in real time.",
      problem:
        "Search-and-rescue operations coordinate volunteers, resources and approvals over chat and spreadsheets, with no single view of a mission.",
      built:
        "Five independent .NET 8 microservices behind a React front end: the full mission lifecycle — creating and approving events, assigning volunteers, tracking resources, generating efficiency reports — with an interactive map, role-based access control and RabbitMQ-backed async messaging.",
      outcome:
        "One system for the whole mission lifecycle; services deploy and scale independently.",
      github: "https://github.com/MrSampy/Platform-for-coordination-of-search-and-rescue-operations",
      demo: null,
    },
  ],

  education: [
    { period: "2025 — 2026", degree: "M.Sc. Computer Science, Software Engineering", institution: "Kyiv Polytechnic Institute", current: true },
    { period: "2021 — 2025", degree: "B.Sc. Computer Science, Software Engineering", institution: "Kyiv Polytechnic Institute", current: false },
    { period: "2021", degree: ".NET UA External University Program", institution: "EPAM", current: false },
  ],
};
