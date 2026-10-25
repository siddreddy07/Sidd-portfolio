import { motion, useReducedMotion } from "motion/react";
import { getIcon } from "../../data/iconMap";
import { toolColors } from "../../data/toolIcons";
import Section from "../ui/Section";
import Tooltip from "../ui/Tooltip";

// Every item appears in the resume skills or in a project in projects.json.
export const tools = [
  { name: "Node.js", icon: "SiNodedotjs" },
  { name: "Express", icon: "SiExpress" },
  { name: "MongoDB", icon: "SiMongodb" },
  { name: "PostgreSQL", icon: "SiPostgresql" },
  { name: "MySQL", icon: "SiMysql" },
  { name: "Redis", icon: "SiRedis" },
  { name: "React", icon: "SiReact" },
  { name: "Next.js", icon: "SiNextdotjs" },
  { name: "Tailwind CSS", icon: "SiTailwindcss" },
  { name: "Prisma", icon: "SiPrisma" },
  { name: "Drizzle", icon: "SiDrizzle" },
  { name: "LangChain", icon: "SiLangchain" },
  { name: "Vercel AI SDK", icon: "SiVercel" },
  { name: "Gemini", icon: "SiGooglegemini" },
  { name: "OpenAI", icon: "SiOpenai" },
  { name: "Supabase", icon: "SiSupabase" },
  { name: "Firebase", icon: "SiFirebase" },
  { name: "npm", icon: "SiNpm" },
  { name: "Git", icon: "SiGit" },
  { name: "GitHub", icon: "SiGithub" },
];

export default function Toolkit() {
  const reduce = useReducedMotion();

  return (
    <></>
  );
}
