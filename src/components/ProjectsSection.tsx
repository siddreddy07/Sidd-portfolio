import React, { useState } from "react";
import { motion } from "motion/react";

interface Project {
  num: string;
  id: string;
  slug: string;
  name: string;
  desc: string;
  tags: string[];
  viewLink: string;
  // Custom procedural SVG visual inside the 16:9 portrait/landscape container
  renderGraphic: () => React.ReactNode;
}

const projectsData: Project[] = [
  {
    num: "01",
    id: "dbsmash",
    slug: "db-smash",
    name: "dbSmash",
    desc: "Multi-DB Schema CLI",
    tags: ["Node.js", "npm", "MongoDB", "PostgreSQL", "MySQL", "Gemini AI"],
    viewLink: "/projects/db-smash",
    renderGraphic: () => (
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#0b0c10] to-[#121319] p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="font-mono text-[9px] text-[#C8FF00] tracking-widest uppercase opacity-80">
            [ CLI ENGINE_V2.0 ]
          </div>
          <span className="font-mono text-[10px] text-zinc-600">01 / SERIALIZER</span>
        </div>
        {/* Abstract DB Nodes & schemas wireframe */}
        <div className="relative my-auto flex justify-center items-center h-20">
          <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#C8FF00]/20 to-transparent" />
          <div className="flex gap-x-6 z-10">
            {["PG", "MONGO", "MYSQL"].map((db, i) => (
              <div 
                key={db}
                className="w-14 h-14 border border-zinc-800 bg-[#080808] flex flex-col items-center justify-center text-center font-mono relative"
              >
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#C8FF00]/40 rounded-full" />
                <span className="text-[10px] text-zinc-400 font-bold tracking-tight">{db}</span>
                <span className="text-[7px] text-zinc-600">READY</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-end font-mono text-[9px] text-zinc-500">
          <span>SCHEMA COMPILER ON_THREAD</span>
          <span>STUTTGART // S-REDDY</span>
        </div>
      </div>
    )
  },
  {
    num: "02",
    id: "hooklens",
    slug: "hook-lens",
    name: "HookLens",
    desc: "AI Webhook Debugger",
    tags: ["Node.js", "Express", "npm middleware", "AI"],
    viewLink: "/projects/hook-lens",
    renderGraphic: () => (
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#100e0b] to-[#1a140d] p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="font-mono text-[9px] text-amber-500/80 tracking-widest uppercase">
            [ STREAMING REALTIME RECV ]
          </div>
          <span className="font-mono text-[10px] text-zinc-600">02 / ENDPOINT</span>
        </div>
        {/* Dynamic network waves */}
        <div className="my-auto flex flex-col space-y-1.5">
          <div className="h-2 w-full bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[45%] bg-amber-500/50" />
          </div>
          <div className="h-2 w-full bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <div className="absolute left-[35%] top-0 h-full w-[35%] bg-[#C8FF00]/50" />
          </div>
          <div className="h-2 w-full bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <div className="absolute left-[10%] top-0 h-full w-[60%] bg-zinc-700" />
          </div>
        </div>
        <div className="flex justify-between items-end font-mono text-[9px] text-zinc-500">
          <span>PROXIED PORT:8080 SSL</span>
          <span>AI_ANALYST COMPILATION</span>
        </div>
      </div>
    )
  },
  {
    num: "03",
    id: "shraddhamedia",
    slug: "shraddha-media",
    name: "Shraddha Media",
    desc: "Production News CMS",
    tags: ["Node.js", "Redis", "RBAC", "MySQL", "React"],
    viewLink: "/projects/shraddha-media",
    renderGraphic: () => (
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#0c0d12] to-[#111726] p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="font-mono text-[9px] text-blue-400 tracking-widest uppercase opacity-80">
            [ CACHING REDIS CLUSTER ]
          </div>
          <span className="font-mono text-[10px] text-zinc-600">03 / MAIN_CMS</span>
        </div>
        {/* Abstract news cards list structure */}
        <div className="my-auto grid grid-cols-2 gap-3">
          <div className="border border-zinc-800 bg-[#080808]/80 p-3 flex flex-col justify-between h-14">
            <div className="w-8 h-1 bg-blue-400" />
            <div className="w-full h-2 bg-zinc-900" />
            <div className="w-[60%] h-1 bg-zinc-900" />
          </div>
          <div className="border border-zinc-800 bg-[#080808]/80 p-3 flex flex-col justify-between h-14">
            <div className="w-8 h-1 bg-[#C8FF00]" />
            <div className="w-full h-2 bg-zinc-900" />
            <div className="w-[40%] h-1 bg-zinc-900" />
          </div>
        </div>
        <div className="flex justify-between items-end font-mono text-[9px] text-zinc-500">
          <span>HIGH THROUGHPUT CDN</span>
          <span>ROLE-BASED PORTALS Active</span>
        </div>
      </div>
    )
  },
  {
    num: "04",
    id: "smartvoter",
    slug: "smart-voter",
    name: "Smart Voter System",
    desc: "IoT + Web Verification",
    tags: ["ESP32", "React", "MySQL", "IoT"],
    viewLink: "/projects/smart-voter",
    renderGraphic: () => (
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#090f09] to-[#0f1d13] p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="font-mono text-[9px] text-[#C8FF00] tracking-widest uppercase">
            [ ESP32 SECURE SIGNATURE ]
          </div>
          <span className="font-mono text-[10px] text-zinc-600">04 / HARDWARE</span>
        </div>
        {/* Hardware nodes/circuits */}
        <div className="my-auto flex justify-center items-center py-2">
          <div className="relative w-16 h-12 border border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center">
            <div className="absolute -top-1 w-2 h-1 bg-zinc-600" />
            <div className="absolute -bottom-1 w-2 h-1 bg-zinc-600" />
            <div className="absolute -left-1 h-2 w-1 bg-zinc-600" />
            <div className="absolute -right-1 h-2 w-1 bg-zinc-600" />
            <span className="font-mono text-[10px] text-[#C8FF00]">MCU_CORE</span>
            <div className="w-3 h-3 rounded-full bg-emerald-500/30 animate-ping absolute" />
          </div>
        </div>
        <div className="flex justify-between items-end font-mono text-[9px] text-zinc-500">
          <span>BIOMETRIC PARITY OK</span>
          <span>WAKE: PROXIMITY_LOCK_0</span>
        </div>
      </div>
    )
  }
];

interface ProjectsSectionProps {
  onNavigateProject?: (path: string) => void;
}

export default function ProjectsSection({ onNavigateProject }: ProjectsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section 
      id="projects-section"
      className="w-full bg-[#080808] text-[#f0ece4] py-24 select-none relative z-20 pointer-events-auto overflow-hidden px-6 md:px-12 lg:px-16"
    >
      {/* Structural Top Header Line */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-baseline">
          <h2 className="font-display italic text-[clamp(40px,6vw,80px)] text-[#f0ece4] leading-none">
            Selected Work
          </h2>
          <span className="font-mono text-[13px] text-[#6b6560] tracking-wider">
            04
          </span>
        </div>
        {/* Separator Line beneath heading */}
        <div className="w-full h-[1px] bg-[#1a1a1a]" />
      </div>

      {/* Projects List Container */}
      <div className="mt-8 flex flex-col w-full">
        {projectsData.map((project, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={project.id}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              onClick={() => onNavigateProject?.(project.viewLink)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative w-full border-b border-[#1a1a1a] flex flex-col md:flex-row items-stretch transition-colors duration-200 hover:bg-[#0f0f0f] group cursor-none"
            >
              {/* Dot Indicator Left Side */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-[#C8FF00] rounded-full transition-opacity duration-200 pointer-events-none"
                style={{
                  opacity: isHovered ? 1 : 0
                }}
              />

              {/* Stacked Layout Item - Left 40% Width Area */}
              <div className="w-full md:w-[40%] flex flex-col justify-between py-8 md:py-10 pl-4 md:pl-8 pr-4 relative z-10 select-none">
                <div className="flex flex-col space-y-3">
                  {/* Proj Number */}
                  <span className="font-mono text-[11px] text-[#6b6560]">
                    {project.num}
                  </span>

                  {/* Project Name & Brief Title */}
                  <h3 
                    className="font-satoshi font-bold text-[clamp(24px,4vw,48px)] text-[#f0ece4] leading-tight transition-transform duration-300 ease-out"
                    style={{
                      transform: isHovered ? "translateX(12px)" : "translateX(0px)"
                    }}
                  >
                    {project.name}
                  </h3>

                  <p className="font-satoshi text-sm text-[#8c857e] tracking-wide mt-1">
                    {project.desc}
                  </p>
                </div>

                {/* Technical Stack Pills */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-[#1a1a1a] border border-[#222222] font-satoshi font-medium text-[11px] text-[#6b6560] px-2.5 py-1 rounded-[4px] select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stacked Layout Item - Right 60% Width Area containing hover thumbnail */}
              <div className="w-full md:w-[60%] flex items-center justify-center p-4 md:p-8 pb-8 md:pb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-transparent pointer-events-none" />
                
                {/* 16:9 Thumbnail frame */}
                <div 
                  className="w-full max-w-sm md:max-w-lg aspect-[16/9] bg-[#0c0c0c] overflow-hidden relative z-10 border border-[#f0ece4]/5 shadow-2xl transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-104 md:group-hover:scale-100"
                >
                  {project.renderGraphic()}
                </div>

                {/* View link indicator appearing on hover at the far bottom right edge */}
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-25 flex items-center col-span-1">
                  <a 
                    href={project.viewLink}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onNavigateProject?.(project.viewLink);
                    }}
                    data-cursor="link"
                    className="font-mono text-[12px] text-[#6b6560] hover:text-text-primary tracking-wide relative group-hover:block transition-colors duration-200 py-1"
                  >
                    View →
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#C8FF00] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </a>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
