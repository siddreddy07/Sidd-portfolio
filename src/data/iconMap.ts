import type { IconType } from "react-icons/lib";
import {
  SiNodedotjs, SiExpress, SiSocketdotio, SiRedis,
  SiPostgresql, SiMongodb, SiMysql, SiPrisma, SiDrizzle,
  SiReact, SiNextdotjs, SiTailwindcss, SiShadcnui, SiHtml5,
  SiLangchain, SiGooglegemini, SiOpenai, SiHuggingface,
  SiVercel, SiSupabase, SiFirebase,
  SiNpm, SiGit, SiGithub, SiTelegram,
} from "react-icons/si";
import {
  FiCloud, FiCpu, FiDatabase,
} from "react-icons/fi";

const iconMap: Record<string, IconType> = {
  SiNodedotjs,
  SiExpress,
  SiSocketdotio,
  SiRedis,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiPrisma,
  SiDrizzle,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiShadcnui,
  SiHtml5,
  SiLangchain,
  SiGooglegemini,
  SiOpenai,
  SiHuggingface,
  SiVercel,
  SiSupabase,
  SiFirebase,
  SiNpm,
  SiGit,
  SiGithub,
  SiTelegram,
  FiCloud,
  FiCpu,
  FiDatabase,
};

export function getIcon(name: string): IconType | null {
  return iconMap[name] ?? null;
}
