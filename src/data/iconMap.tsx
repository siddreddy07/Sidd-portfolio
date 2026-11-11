import type { IconType } from "react-icons/lib";
import {
  SiNodedotjs, SiExpress, SiSocketdotio, SiRedis,
  SiPostgresql, SiMongodb, SiMysql, SiPrisma, SiDrizzle,
  SiReact, SiNextdotjs, SiTailwindcss, SiShadcnui, SiHtml5,
  SiLangchain, SiGooglegemini, SiOpenai, SiHuggingface,
  SiSupabase, SiFirebase,
  SiNpm, SiCloudflare, SiGit, SiGithub, SiTelegram, SiNetlify,
} from "react-icons/si";
import {
  FiCloud, FiCpu, FiDatabase, FiCreditCard, FiShield, FiExternalLink,
  FiGitBranch, FiMousePointer, FiGlobe, FiZap, FiKey, FiUsers, FiTerminal,
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

// ImageKit's "i" mark (from their logo), single colour so it follows the text / brand colour like the other icons.
const ImageKitIcon: IconType = ({ size = 24, color = "currentColor", ...props }) => (
  <svg width={size} height={size} viewBox="-1 -1 14 28" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill={color} d="M3.53 5a2.65 2.65 0 0 1-.72-2 2.82 2.82 0 0 1 .8-1.9A2.67 2.67 0 0 1 5.55.34a2.43 2.43 0 0 1 1.86.8A2.54 2.54 0 0 1 8.25 3a2.59 2.59 0 0 1-.84 2 2.74 2.74 0 0 1-1.94.75A2.67 2.67 0 0 1 3.53 5Zm7.73 13.6c-2.7 7.34-12.93 9.32-11-.2l2.2-10.8h4.68c-1.07 5.75-1.87 9.25-2.66 13.25s4.28 1.07 5.43-2.26h1.35Z" />
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
  FiTerminal,
  SiNetlify,
  SiCloudflare,
  SiImagekit: ImageKitIcon,
};

export function getIcon(name: string): IconType | null {
  return iconMap[name] ?? null;
}
