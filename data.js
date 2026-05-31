const DATA = {
  personal: {
    name: "Serhiy Kolosov",
    greeting: "Hi, I'm",
    titles: [".NET Developer", "Full Stack Developer", "Software Engineer"],
    about: `As a .NET developer, I possess a proven track record of delivering high-quality software solutions. My expertise lies in developing scalable, reliable, and secure web applications using ASP.NET, C#, SQL Server, and other Microsoft technologies.\n\nI have excellent communication skills and a collaborative approach to working with cross-functional teams. Originally from Ukraine, currently based in Norway, working in an international environment.`,
    email: "mynameisserzheo@gmail.com",
    github: "https://github.com/MrSampy",
    location: "Stavanger, Norway",
  },

  skills: [
    {
      category: "Backend & .NET",
      items: ["C#", ".NET", "ASP.NET", "ASP.NET Core", "MVC", "Entity Framework", "LINQ", "Microservices"],
    },
    {
      category: "Architecture & Principles",
      items: ["OOP", "SOLID", "Design Patterns", "Architectural Patterns"],
    },
    {
      category: "Database",
      items: ["SQL", "SQL Server", "PostgreSQL"],
    },
    {
      category: "Frontend",
      items: ["JavaScript", "HTML", "CSS"],
    },
    {
      category: "Testing",
      items: ["Unit Testing", "xUnit", "MSTest", "Selenium", "E2E Tests"],
    },
    {
      category: "DevOps & Tools",
      items: ["Git", "GitHub", "Docker", "CI / CD"],
    },
    {
      category: "AI / ML",
      items: ["Python", "PyTorch", "RAG", "ChromaDB"],
    },
  ],

  languages: [
    { name: "Ukrainian", level: "Native",    bar: 100 },
    { name: "Russian",   level: "C2",        bar: 95  },
    { name: "English",   level: "B2",        bar: 65  },
    { name: "Norwegian", level: "A1",        bar: 15  },
  ],

  expectations: [
    "Opportunities for career growth and learning new technologies",
    "Reliable and supportive team environment",
    "Competitive salary",
    "Modern approaches and best practices in software development",
  ],

  experience: [
    {
      period: "May 2023 — Present",
      role: "Full Stack Developer",
      company: "In-Core",
      current: true,
      description: [
        "Developing scalable web applications using ASP.NET Core and C#",
        "Building RESTful APIs and microservices architecture",
        "Working with SQL Server and Entity Framework for data management",
        "Collaborating in cross-functional international teams",
        "Implementing and maintaining Docker-based CI/CD pipelines",
      ],
    },
    {
      period: "Jan 2023 — May 2023",
      role: "Lead QA Engineer",
      company: "In-Core",
      current: false,
      description: [
        "Led a QA team responsible for end-to-end product quality assurance",
        "Defined testing strategies, standards, and best practices",
        "Coordinated between development and QA teams to improve release quality",
        "Implemented automated test frameworks to increase test coverage",
      ],
    },
    {
      period: "Sep 2022 — Jan 2023",
      role: "Automation QA Engineer",
      company: "In-Core",
      current: false,
      description: [
        "Developed automated test suites for web applications",
        "Implemented unit, integration, and end-to-end tests",
        "Maintained test infrastructure and reporting pipelines",
        "Identified, tracked, and verified bugs using issue tracking systems",
      ],
    },
  ],

  projects: [
    {
      title: "Pr Reviewr for Azure",
      description:
        "An intelligent PR code review assistant that automatically analyzes pull requests using Retrieval-Augmented Generation. Indexes your codebase and past review comments into a vector database, retrieves relevant context for each diff, and posts actionable review comments directly to Azure DevOps — powered by a local LLM via Ollama.",
      tags: ["Python", "ChromaDB", "Ollama", "RAG"],
      github: "https://github.com/MrSampy/Pr-Reviewr",
      demo: null,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    {
      title: "SAR Coordination Platform",
      description:
        "A microservices platform for coordinating search and rescue operations in real time. Manages the full mission lifecycle — from creating and approving events to assigning volunteers, tracking resources, and generating efficiency reports — with an interactive map, role-based access control, and RabbitMQ-backed async messaging across five independent services.",
      tags: ["C#", ".NET 8", "React", "PostgreSQL", "Docker", "RabbitMQ"],
      github: "https://github.com/MrSampy/Platform-for-coordination-of-search-and-rescue-operations",
      demo: null,
      gradient: "linear-gradient(135deg, #0ea5e9, #10b981)",
    }
  ],

  education: [
    {
      period: "Sep 2025 — Present",
      degree: "Master's degree of Software Engineering",
      institution: "Kyiv Polytechnic Institute (KPI)",
      current: true,
      description:
        "Advanced studies in distributed systems, cloud computing, software quality assurance, and IT project management.",    },
    {
      period: "Sep 2021 — Jun 2025",
      degree: "Bachelor of Software Engineering",
      institution: "Kyiv Polytechnic Institute (KPI)",
      current: false,
      description:
        "Core studies in algorithms, data structures, software architecture, operating systems, and modern development practices.",
    },
    {
      period: "Apr 2021 — Jun 2021",
      degree: ".NET UA External University Program",
      institution: "EPAM",
      current: false,
      description:
        "Intensive professional program covering C#, ASP.NET Core, database design, testing, and enterprise software engineering best practices.",
    },
  ],
};
