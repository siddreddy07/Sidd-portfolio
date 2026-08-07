import type { IconType } from "react-icons/lib";
import {
  SiNodedotjs, SiExpress, SiSocketdotio, SiRedis,
  SiPostgresql, SiMongodb, SiMysql, SiPrisma, SiDrizzle,
  SiReact, SiNextdotjs, SiTailwindcss, SiShadcnui, SiHtml5,
  SiLangchain, SiGooglegemini, SiOpenai, SiHuggingface,
  SiSupabase, SiFirebase,
  SiNpm, SiGit, SiGithub, SiTelegram, SiNetlify,
} from "react-icons/si";
import {
  FiCloud, FiCpu, FiDatabase, FiCreditCard, FiShield, FiExternalLink,
  FiGitBranch, FiMousePointer, FiGlobe, FiZap, FiKey, FiUsers,
} from "react-icons/fi";

const VercelIcon: IconType = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 -17 256 256"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polygon fill={color} points="128 0 256 221.705007 0 221.705007" />
  </svg>
);

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
  SiVercel: VercelIcon,
  SiSupabase,
  SiFirebase,
  SiNpm,
  SiGit,
  SiGithub,
  SiTelegram,
  FiCloud,
  FiCpu,
  FiDatabase,
  FiCreditCard,
  FiShield,
  FiExternalLink,
  FiGitBranch,
  FiMousePointer,
  FiGlobe,
  FiZap,
  FiKey,
  FiUsers,
  SiNetlify,
};

export function getIcon(name: string): IconType | null {
  return iconMap[name] ?? null;
}
