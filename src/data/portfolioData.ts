export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  client?: string;
  description: string[];
  technologies: string[];
}

export interface ProjectItem {
  title: string;
  subtitle?: string;
  description: string;
  highlights: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface CertificationItem {
  title: string;
  code: string;
  issuer: string;
  date?: string;
  badgeColor?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const portfolioData = {
  personal: {
    name: "Prajjval Pathak",
    title: "Software Developer 2 at Oracle",
    tagline:
      "I engineer high-scale enterprise platforms, resilient cloud backends, and modern full-stack web applications.",
    email: "prajjvalpathak@gmail.com",
    phone: "+91-8827849718",
    location: "Bengaluru / Indore, India",
    social: {
      github: "https://github.com/prajjvalpathak",
      linkedin: "https://linkedin.com/in/prajjvalpathak",
      leetcode: "https://leetcode.com/u/prajjvalpathak",
      email: "mailto:prajjvalpathak@gmail.com",
    },
  },

  about: {
    paragraphs: [
      "I'm a Full-Stack Software Developer passionate about building robust, scalable enterprise systems and cloud-native solutions that solve complex operational challenges. Currently at Oracle, I design and scale multi-tenant platforms serving enterprise clients and thousands of active users.",
      "My core technical foundation spans C# (.NET Framework/Core), ReactJS, TypeScript, SQL Server, and Oracle 19c (PL/SQL). I specialize in architecting layered backend systems (Controllers → Services → Repositories), designing high-throughput RESTful APIs, engineering strict Role-Based Access Control (RBAC) for data isolation, and heavily optimizing complex SQL queries and stored procedures.",
      "Beyond enterprise systems, I actively explore cutting-edge AI integrations—such as embedding Google Gemini models into financial analytics platforms—and building clean, component-driven frontend architectures. I am also certified as an Azure Developer Associate (AZ-204) and Azure Fundamentals (AZ-900).",
    ],
  },

  experiences: [
    {
      period: "MAR 2025 — PRESENT",
      role: "Software Developer 2",
      company: "Oracle",
      companyUrl: "https://www.oracle.com",
      location: "Bengaluru, India",
      description: [
        "Scaled a multi-tenant Design & Risk Management platform with ASP.NET Core, React/Redux, and SQL Server for 500+ enterprise clients, 8,000+ users, and 4,000+ daily active users.",
        "Engineered secure REST APIs and tenant-level RBAC through a Controllers → Services → Repositories → SQL architecture for critical decision and compliance workflows.",
        "Optimized high-volume SQL queries and stored procedures, improving production backend processing performance by 70%.",
      ],
      technologies: [
        "C#",
        "ASP.NET Core",
        "ReactJS",
        "Redux Toolkit",
        "SQL Server",
        "Oracle 19c (PL/SQL)",
        "Oracle APEX",
        "RBAC",
        "REST APIs",
      ],
    },
    {
      period: "JUL 2022 — FEB 2025",
      role: "Software Engineer",
      company: "Tata Consultancy Services",
      companyUrl: "https://www.tcs.com",
      client: "Humana",
      location: "Indore, India",
      description: [
        "Built C#/.NET Core Web API modules and validation pipelines for a large-scale healthcare authorization system.",
        "Delivered responsive React interfaces for dynamic API-driven content while evolving a componentized frontend architecture.",
        "Resolved production issues across the stack and maintained stable releases with xUnit and Moq test coverage above 80%.",
      ],
      technologies: [
        "C#",
        ".NET Core Web API",
        "ReactJS",
        "JavaScript (ES6+)",
        "HTML5 / CSS3",
        "xUnit",
        "Moq",
        "RESTful Services",
        "Agile / Scrum",
      ],
    },
  ] as ExperienceItem[],

  projects: [
    {
      title: "WealthWise – Finance App",
      subtitle:
        "Full-Stack Financial Platform with AI-Driven Equity Intelligence",
      description:
        "A full-stack finance application that combines RESTful equity data with Gemini-powered analysis for 50+ tickers.",
      highlights: [
        "Integrated Google Gemini 3.1 Flash-Lite to generate automated fundamental-analysis and risk-assessment reports.",
        "Built ASP.NET Core rate-limiting and input sanitization to protect public endpoints from quota abuse and prompt injection.",
        "Implemented a typed TypeScript frontend over a layered Controller-Service-Repository backend.",
      ],
      technologies: [
        "ASP.NET Core",
        "React",
        "TypeScript",
        "Google Gemini API",
        "SQL Server",
        "Tailwind CSS",
        "REST API",
      ],
      githubUrl: "https://github.com/prajjval-pathak/Fin_App",
      liveUrl: "https://fin-app-jade.vercel.app/",
      featured: true,
    },
    {
      title: "Game Discovery App",
      subtitle: "Modern Video Game Discovery Platform",
      description:
        "A React and TypeScript game-discovery experience built around data-driven UI and reusable API abstractions.",
      highlights: [
        "Centralized API logic with TypeScript generics and custom hooks, reducing redundant code by 60%.",
        "Built dark mode, genre filtering, search, sorting, and tailored platform icons for 7+ gaming ecosystems.",
        "Applied strict typing to API responses and component props to improve reliability and maintainability.",
      ],
      technologies: [
        "ReactJS",
        "TypeScript",
        "Custom Hooks",
        "Generics",
        "RESTful APIs",
        "CSS3 / Tailwind",
      ],
      githubUrl: "https://github.com/prajjval-pathak/Game-Discovery",
      liveUrl: "https://game-discover.vercel.app/",
      featured: true,
    },
  ] as ProjectItem[],

  certifications: [
    {
      title: "Microsoft Certified: Azure Developer Associate",
      code: "AZ-204",
      issuer: "Microsoft",
      badgeColor: "from-blue-500 to-cyan-400",
    },
    {
      title: "Microsoft Certified: Azure Fundamentals",
      code: "AZ-900",
      issuer: "Microsoft",
      badgeColor: "from-blue-600 to-indigo-500",
    },
  ] as CertificationItem[],

  skillCategories: [
    {
      category: "Languages & Core",
      skills: [
        "C# (.NET 8/Core/Framework)",
        "TypeScript",
        "JavaScript (ES6+)",
        "SQL",
        "PL/SQL",
        "HTML5",
        "CSS3",
      ],
    },
    {
      category: "Frameworks & Libraries",
      skills: [
        "ASP.NET Core Web API",
        "ASP.NET MVC",
        "ReactJS",
        "Redux Toolkit",
        "Oracle APEX",
        "jQuery",
        "AJAX",
      ],
    },
    {
      category: "Databases & Cloud",
      skills: [
        "SQL Server",
        "Oracle 19c",
        "Microsoft Azure (AZ-204/AZ-900)",
        "Azure DevOps",
        "REST Microservices",
      ],
    },
    {
      category: "Architecture & Testing",
      skills: [
        "Controller-Service-Repository Pattern",
        "Multi-Tenant Architecture",
        "RBAC",
        "Headless CMS",
        "xUnit",
        "Moq",
        "Design Patterns",
      ],
    },
    {
      category: "AI & Modern Tools",
      skills: [
        "Google Gemini API",
        "OpenAI API",
        "ChatGPT",
        "GitHub Copilot",
        "Cursor AI",
        "Git",
        "VS Code",
        "Postman",
        "Swagger",
      ],
    },
  ] as SkillCategory[],

  education: [
    {
      degree: "B.Tech, Computer Science Engineering",
      institution: "Shri Vaishnav Vidyapeeth Vishwavidyalaya",
      location: "Indore, India",
      period: "2018 – 2022",
    },
    {
      degree: "High School",
      institution: "Springwood School",
      location: "Indore, India",
      period: "2017 – 2018",
    },
  ],
};
