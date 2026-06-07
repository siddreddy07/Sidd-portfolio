import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  SiNodedotjs, SiExpress, SiSocketdotio, SiRedis,
  SiPostgresql, SiMongodb, SiMysql, SiPrisma, SiDrizzle,
  SiReact, SiNextdotjs, SiTailwindcss, SiHtml5,
  SiLangchain, SiGooglegemini, SiOpenai, SiHuggingface,
  SiVercel, SiSupabase, SiFirebase,
  SiNpm, SiGit, SiGithub,
} from "react-icons/si";
import { FiCloud } from "react-icons/fi";


const chars = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useTextScramble(finalText: string) {
  const [displayText, setDisplayText] = useState(finalText);
  const frameRef = useRef<number>(null);
  const intervalRef = useRef<number>(null);
  const isHovering = useRef(false);

  const startScramble = useCallback(() => {
    isHovering.current = true;
    const totalSteps = 8;
    let step = 0;

    intervalRef.current = window.setInterval(() => {
      step++;
      if (step >= totalSteps) {
        clearInterval(intervalRef.current!);
        setDisplayText(finalText);
        return;
      }
      const progress = step / totalSteps;
      const revealCount = Math.floor(progress * finalText.length);
      const scrambled = finalText.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < revealCount) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      setDisplayText(scrambled);
    }, 50);
  }, [finalText]);

  const stopScramble = useCallback(() => {
    isHovering.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setDisplayText(finalText);
  }, [finalText]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return { displayText, startScramble, stopScramble };
}

interface HeroSectionProps {
  onScrollToSpec?: () => void;
  onScrollToSandbox?: () => void;
}

import type { IconType } from "react-icons/lib";

interface TechLogo {
  name: string;
  icon: IconType;
}

const techLogos: TechLogo[] = [
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express", icon: SiExpress },
  { name: "Socket.io", icon: SiSocketdotio },
  { name: "Redis", icon: SiRedis },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "MySQL", icon: SiMysql },
  { name: "Prisma", icon: SiPrisma },
  { name: "Drizzle ORM", icon: SiDrizzle },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "HTML5", icon: SiHtml5 },
  { name: "LangChain", icon: SiLangchain },
  { name: "Gemini", icon: SiGooglegemini },
  { name: "OpenAI", icon: SiOpenai },
  { name: "Hugging Face", icon: SiHuggingface },
  { name: "Vercel", icon: SiVercel },
  { name: "Supabase", icon: SiSupabase },
  { name: "Firebase", icon: SiFirebase },
  { name: "npm", icon: SiNpm },
  { name: "Git", icon: SiGit },
  { name: "GitHub", icon: SiGithub },
  { name: "Cloud", icon: FiCloud },
];

const col1Logos = techLogos.filter((_, i) => i % 2 === 0);
const col2Logos = techLogos.filter((_, i) => i % 2 !== 0);
const NUM_COPIES = 10;

function multiplyLogos(logos: TechLogo[]): TechLogo[] {
  return Array.from({ length: NUM_COPIES }, () => logos).flat();
}

export default function HeroSection({}: HeroSectionProps) {
  const { displayText, startScramble, stopScramble } = useTextScramble("N. Siddharth Reddy");
  const headlineLines = [
    { text: "Full Stack / Backend", color: "text-[#f0ece4]", size: "text-[clamp(34px,5vw,72px)]" },
    { text: "Developer", color: "text-[#f0ece4]", size: "text-[clamp(34px,5vw,72px)]" },
    { text: "& AI-Powered Apps", color: "text-[#C8FF00]", size: "text-[clamp(26px,4vw,56px)]" }
  ];

  return (
    <section
      id="hero-studio-section"
      className="relative w-full overflow-hidden select-none bg-[#080808] text-[#f0ece4] px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between"
      style={{ minHeight: "100vh", height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <style>{`
        @keyframes marqueeUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marqueeDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .marquee-up { animation: marqueeUp 50s linear infinite; }
        .marquee-down { animation: marqueeDown 60s linear infinite; }
      `}</style>

      {/* LEFT ZONE: 55% width on desktop */}
      <div className="w-full md:w-[55%] h-full flex flex-col justify-between py-4 sm:py-12 md:pt-8 md:pb-20 relative z-10">
        
        {/* Top-left: Name tag */}
        <div className="text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={startScramble}
            onMouseLeave={stopScramble}
            className="font-satoshi font-medium text-[13px] text-[#6b6560] tracking-[0.1em] uppercase cursor-none inline-block"
          >
            {displayText}
          </motion.div>
        </div>

        {/* Center-left: Main headline */}
        <div className="my-auto text-center md:text-left py-2 sm:py-8">
          <div className="flex flex-col space-y-2 sm:space-y-3">
            {headlineLines.map((line, index) => (
              <div className="overflow-hidden" key={index}>
                <motion.span
                  className={`block font-display italic ${line.size} leading-[0.9] tracking-tight ${line.color}`}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.12,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {line.text}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Descriptor Line below headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-satoshi font-normal text-[13px] sm:text-[15px] text-[#6b6560] mt-4 sm:mt-5 max-w-xl mx-auto md:mx-0"
          >
            Building backend systems, AI-powered applications, and developer tools
          </motion.p>

          {/* Status + Location */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-3 sm:gap-5 mt-6"
          >
            <span className="flex items-center gap-1.5 font-satoshi text-[13px] sm:text-[14px] text-[#6b6560]">
              <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse font-bold shrink-0" style={{ animationDuration: "2s" }} />
              Open to fulltime roles
            </span>
            
          </motion.div>
        </div>

        {/* Space reserving block for alignment */}
        <div className="hidden md:block h-12" />
      </div>

      {/* RIGHT ZONE: hidden on mobile, 45% width on desktop — tech logo marquee */}
      <div className="hidden md:flex w-full md:w-[45%] h-full items-stretch justify-center relative z-10" style={{ maskImage: "linear-gradient(to bottom, transparent 5%, black 20%, black 80%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 5%, black 20%, black 80%, transparent 95%)" }}>
        {/* Column 1: scrolls downward */}
        <div className="flex-1 overflow-hidden relative py-8">
          <div className="marquee-down flex flex-col items-center will-change-transform gap-3">
            {multiplyLogos(col1Logos).map((logo, i) => (
              <div key={i}><logo.icon size={40} color="#6b6560" /></div>
            ))}
          </div>
        </div>
        {/* Column 2: scrolls upward */}
        <div className="flex-1 overflow-hidden relative py-8">
          <div className="marquee-up flex flex-col items-center will-change-transform gap-3">
            {multiplyLogos(col2Logos).map((logo, i) => (
              <div key={i}><logo.icon size={40} color="#6b6560" /></div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
