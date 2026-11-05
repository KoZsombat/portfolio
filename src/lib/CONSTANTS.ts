// Resolves a public/ file against the deploy base (e.g. /portfolio/ on GitHub Pages).
const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export const STACK = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Go", "C#", "Rust"],
  },
  {
    label: "Frontend",
    items: ["React", "Svelte", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express",
      "NestJS",
      "Go (net/http)",
      "Socket.IO",
      "Axum",
    ],
  },
  { label: "Tools", items: ["Docker", "Git"] },
];

export const SOCIALS = [
  {
    name: "GitHub",
    color: "#bc8cff",
    href: "https://github.com/kozsombat",
    handle: "@kozsombat",
  },
  {
    name: "LinkedIn",
    color: "#70b5f9",
    href: "https://www.linkedin.com/in/zsombor--kovacs/",
    handle: "in/zsombor--kovacs",
  },
  {
    name: "Email",
    color: "#f28b82",
    href: "mailto:kovacszsombor1234@gmail.com",
    handle: "kovacszsombor1234@gmail.com",
  },
];

export const PROJECTS = [
  {
    name: "aat",
    images: [] as string[],
    description:
      "Aptitude Assessment Tests, a web platform for running timed skill assessments, built during my dual training at Webvalto. Admins create and open tests made of tasks, users take them against a countdown, and the app shows attempt summaries and results on separate user and admin dashboards. The task content lives in its own repository and is synced into the database by a small Go CLI. The Go backend ships as a single binary and is deployed through GitLab CI.",
    role: "Worked on both sides of the app. On the frontend I built the user and admin dashboards, the navigation, the brand and zinc theme, responsive layouts, empty states and the task page's expired state when the timer runs out. On the backend I hardened auth by moving the user ID into the JWT and checking admin roles against the database, added the admin route checks, and wrote the endpoints for task counts and attempt summaries.",
    tags: ["Go", "TypeScript", "React 19"],
    repo: "",
    live: "",
  },
  {
    name: "nutrition-app",
    images: [asset("projects/nutrition.png")],
    description:
      "A full-stack nutrition tracker for logging meals and hitting your macro and water goals. You add the ingredients you eat with their macros, combine them into reusable meals and log them with a tap, while calories, protein, carbs and fat are tracked against targets you set yourself. It also tracks water and optional creatine with a daily streak, supports email or Google sign-in, and installs as a PWA with light and dark themes.",
    role: "My own project, built end to end: the PostgreSQL schema, the Express API routes, authentication, the React frontend and the production deployment behind Caddy.",
    tags: ["TypeScript", "React 19", "Express 5"],
    repo: "https://github.com/KoZsombat/nutrition-app",
    live: "https://nutrition.zsombor.dev",
  },
  {
    name: "filc",
    images: [asset("projects/filc.png")],
    description:
      "The application stack behind my school's digital platform. Chronos is the API server, with auth, scheduled jobs and the database, and Iris is the web frontend. Together they handle timetables, lesson substitutions, announcements, user management and door-lock activity, in Hungarian and English, plus kiosk displays and a 3D campus navigator. It's a Bun and Turborepo monorepo with a shared, typed API contract.",
    role: "Contributed to the frontend: the substitution dialog (including merging lessons), the timetable import dialog, announcement visibility, user management with cohorts and sorting, filters, the door-lock chart, the mobile timetable view and the Hungarian translations.",
    tags: ["TypeScript", "React 19"],
    repo: "https://github.com/filcdev/filc",
    live: "https://filc.petrik.hu",
  },
  {
    name: "QuitLARP",
    images: [],
    description:
      "A platform for running coding assessments. Candidates work in the browser with a Monaco editor, and their code runs inside sandboxed containers isolated with gVisor. The Go backend handles auth, sessions, assessments and email, and the React frontend covers the dashboard, assessment creation, repositories and previews.",
    role: "Built much of the frontend: the dashboard, landing and pricing pages, navbars, the assessment preview page, the branding and ASCII desert backgrounds, and the Monaco theme. I made every page responsive on mobile, and set up the gVisor sandbox daemon with a pinned, checksum-verified release.",
    tags: ["Go", "TypeScript", "React"],
    repo: "https://github.com/Church-of-the-LARP/QuitLARP",
  },
  {
    name: "give-go",
    images: [asset("projects/give-go.png"), asset("projects/give-go-full.png")],
    description:
      "A Hungarian volunteering platform that connects organizations with volunteers. People can browse and search events, apply to them and sign up for a newsletter, and organizations can publish their own events through a three-step creation wizard with images and job types. It runs on Next.js with Better Auth and a Neon Postgres database, and is deployed on Vercel.",
    role: "Built the authentication flow (login, registration, validation), the event creation UI with picture upload, the organizer dashboard, the email template and the contact and impressum pages.",
    tags: ["TypeScript", "Next.js 16"],
    repo: "https://github.com/give-go-2026/give-go",
    live: "https://givego.hu",
  },
];

export const BACKGROUND = [
  {
    label: "Experience",
    items: [
      {
        title: "Digitalent / Webvalto",
        meta: "Dual training student",
      },
    ],
  },
  {
    label: "Awards",
    items: [
      {
        title: "EuroSkills 2027 — National Selection",
        meta: "Qualified for the National Finals",
      },
    ],
  },
];
