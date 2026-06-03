import { Project, ExperienceEntry, StackSection } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'mew-claw',
    index: 'P-01',
    name: 'Mew-Claw',
    description: 'Intelligent software agent bridging remote mobile devices with secure, interactive workstation control. Orchestrated via custom execution engines, secure shell tunneling, and approval gates.',
    tags: ['Node.js', 'Telegram API', 'Vercel AI SDK', 'Groq AI', 'PostgreSQL', 'Express'],
    year: '2026',
    githubUrl: 'https://github.com/siddreddy07/Mew-Claw'
  },
  {
    id: 'db-smash',
    index: 'P-02',
    name: 'dbSmash',
    description: 'Generative schema designer available as both a web workbench and global npm CLI. Translates plain English into formatted database schemas.',
    tags: ['Node.js', 'CLI', 'npm', 'Gemini API', 'React'],
    year: '2025',
    url: 'https://dbsmash.netlify.app/',
    npmUrl: 'https://www.npmjs.com/package/dbsmash'
  },
  {
    id: 'shraddha-media',
    index: 'P-03',
    name: 'Shraddha Media',
    description: 'Production-ready news CMS and server infrastructure. Engineered with high-performance caching and role-based validation.',
    tags: ['Node.js', 'MongoDB', 'Redis', 'Express', 'React'],
    year: '2024',
    url: 'https://shraddhamedia.com/'
  },
  {
    id: 'hook-lens',
    index: 'P-04',
    name: 'HookLens',
    description: 'High-throughput Webhook analytical inspector featuring real-time diagnostic pipelines, active live dashboard portal, and structured Node.js middleware logging.',
    tags: ['Next.js', 'TypeScript', 'Vercel AI SDK', 'Webhooks', 'npm'],
    year: '2025',
    url: 'https://hooklens-eta.vercel.app/',
    npmUrl: 'https://www.npmjs.com/package/hooklens-node'
  },
  {
    id: 'smart-voter',
    index: 'P-05',
    name: 'Smart Voter Verification',
    description: 'IoT biometric credentials authenticator utilizing ESP32 UART mapping accompanied by an administrative analytics dashboard.',
    tags: ['Node.js', 'MySQL', 'ESP32', 'REST API', 'React'],
    year: '2024',
    githubUrl: 'https://github.com/siddreddy07'
  }
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'ten-intern',
    company: 'TEN, India',
    date: 'Jan 2025 – May 2025',
    title: 'MERN Stack Developer Intern',
    bullets: [
      'designed and shipped 6+ HRMS API endpoints (employee onboarding, role assignment, access control); enforced role checks at the middleware layer rather than scattering auth logic across route handlers.',
      'built shopping cart, wishlist, and product filter in React.js — extracted shared filter state into a single context to eliminate prop-drilling across 3 component levels.',
      'wrote reusable request-validation middleware with structured error responses, eliminating repetitive try/catch blocks across route files.'
    ]
  },
  {
    id: 'reaidy-intern',
    company: 'reaidy.io, India',
    date: 'Aug 2024 – Oct 2024',
    title: 'Backend Developer Intern',
    bullets: [
      'implemented TopScores route using MongoDB aggregation pipeline ($group, $sort, $limit) instead of application-level sorting — moving compute to the database layer.',
      'refactored interview scheduling routes — consolidated redundant DB calls from 4 queries per request to 2 using $lookup, reducing response overhead measurably.',
      'migrated auth from header-based tokens to httpOnly cookie tokens; added CSRF validation and a Redis-backed rate limiter on auth routes — hardening the full auth surface in one refactor.'
    ]
  }
];

export const STACK_MANIFEST: StackSection = {
  runtime: {
    node: ['Node.js', 'Express.js', 'REST APIs'],
    realtime: ['Socket.io', 'WebSockets', 'BullMQ'],
    auth: ['JWT', 'OAuth 2.0', 'Better Auth', 'Sessions']
  },
  database: {
    document: ['MongoDB', 'Mongoose'],
    relational: ['PostgreSQL', 'MySQL', 'Drizzle ORM'],
    cache: ['Redis', 'Upstash', 'Neon']
  },
  frontend: {
    framework: ['React.js', 'Next.js'],
    styling: ['Tailwind CSS'],
    mobile: ['React Native', 'Expo']
  },
  infrastructure: {
    cloud: ['AWS EC2'],
    devops: ['Git'],
    deploy: ['Vercel']
  },
  integrations: {
    orchestration: ['Gemini API', 'Vercel AI SDK', 'LangChain', 'Hugging Face', 'OpenRouter']
  }
};

// CHANGE THIS TO YOUR ACTUAL GOOGLE DRIVE RESUME/CV LINK:
export const RESUME_URL = 'https://drive.google.com/file/d/11ntGBLpD-yDpaFH12NJruytr0uE3PjbN/view?usp=drivesdk';

