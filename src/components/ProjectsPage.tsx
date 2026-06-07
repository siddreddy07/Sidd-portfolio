import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectItem {
  num: string;
  slug: string;
  name: string;
  descriptor: string;
  tags: string[];
  type: string;
  typePill: "CLI TOOL" | "BACKEND" | "FULLSTACK" | "IOT";
  year: string;
  renderThumbnail: () => React.ReactNode;
  specs: { label: string; value: string }[];
  overview: string;
}

const projectsArchive: ProjectItem[] = [
  {
    num: "01",
    slug: "db-smash",
    name: "dbSmash",
    descriptor: "CLI that scaffolds multi-DB schemas via natural language",
    tags: ["Node.js", "npm", "Gemini AI", "MongoDB", "PostgreSQL", "MySQL"],
    typePill: "CLI TOOL",
    type: "CLI Tools",
    year: "2025",
    specs: [
      { label: "Target Ecosystem", value: "NodeJS / npm registry" },
      { label: "Database Drivers", value: "pg, mongodb, mysql2" },
      { label: "Core LLM Engines", value: "Gemini 2.5 Flash / SDK" },
      { label: "Execution Environment", value: "POSIX compliant shells" }
    ],
    overview: "dbSmash is a developer ergonomics tool designed to accelerate bootstrapping in multi-database environments. By leveraging Google's Gemini SDK in an inline CLI execution cycle, it translates pure natural language requirements into optimized relational schemas or document structures, complete with seed scripts, connection pools, and environmental configuration.",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-[#0c0d12] border border-[#f0ece4]/10 flex flex-col justify-between p-4 overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[9px] text-[#6b6560]">PROJ_SEC_01</span>
          <span className="font-mono text-[9px] text-[#C8FF00] tracking-wider font-bold">READY</span>
        </div>
        <div className="my-auto text-center font-mono space-y-1">
          <div className="text-[12px] font-bold text-[#f0ece4]">$ npx dbsmash init</div>
          <div className="text-[9px] text-zinc-500">generating postgresql tables... [OK]</div>
        </div>
        <div className="flex justify-between font-mono text-[8px] text-zinc-600">
          <span>STUTTGART // REDDY</span>
          <span>COMPILER: V1.2</span>
        </div>
      </div>
    )
  },
  {
    num: "02",
    slug: "hook-lens",
    name: "HookLens",
    descriptor: "AI-powered webhook debugger with npm middleware",
    tags: ["Node.js", "Express", "OpenAI", "Webhooks", "npm"],
    typePill: "BACKEND",
    type: "Backend",
    year: "2025",
    specs: [
      { label: "Integrations", value: "Express.js middle tier" },
      { label: "Telemetry Layer", value: "Server-Sent Events (SSE)" },
      { label: "Rate Limiter", value: "Redis-backed bucket" },
      { label: "Data Store", value: "In-memory circular queues" }
    ],
    overview: "HookLens simplifies asynchronous protocol debugging. It mounts directly as an Express middleware stack, captures inbound webhooks with precise packet headers, evaluates payloads via inline anomaly analysis pipelines, and provides real-time diagnostic reports inside local shell terminals to bypass dashboard fatigue.",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-[#120e0a] border border-[#f0ece4]/10 flex flex-col justify-between p-4 overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[9px] text-[#6b6560]">PROJ_SEC_02</span>
          <span className="font-mono text-[9px] text-amber-500/80 tracking-wider">LISTENING</span>
        </div>
        <div className="my-auto flex flex-col items-center justify-center space-y-1">
          <span className="font-mono text-[14px] text-zinc-400 font-bold">HOOKS_RCV</span>
          <div className="flex gap-1 h-3 items-end">
            <span className="w-[3px] h-3 bg-[#C8FF00] animate-bounce" />
            <span className="w-[3px] h-2 bg-[#C8FF00] animate-bounce delay-75" />
            <span className="w-[3px] h-1 bg-zinc-700" />
            <span className="w-[3px] h-2.5 bg-[#C8FF00] animate-bounce delay-150" />
          </div>
        </div>
        <div className="flex justify-between font-mono text-[8px] text-zinc-600">
          <span>PORT: 8080 // REDIRECTED</span>
          <span>SSL CHECK: ENFORCED</span>
        </div>
      </div>
    )
  },
  {
    num: "03",
    slug: "shraddha-media",
    name: "Shraddha Media",
    descriptor: "Production news CMS with Redis sessions and RBAC",
    tags: ["Node.js", "Redis", "MySQL", "React", "RBAC"],
    typePill: "FULLSTACK",
    type: "Backend",
    year: "2024",
    specs: [
      { label: "Session Engine", value: "Express Session + Redis" },
      { label: "Access Controls", value: "Granular RBAC Policies" },
      { label: "Data Tiering", value: "MySQL pooled read replicas" },
      { label: "Client Layer", value: "React 18 + SPA Core" }
    ],
    overview: "Shraddha Media is an enterprise content orchestration platform built for high-throughput editorial workloads. Features robust multi-tenant role-based access management, optimized template invalidation cache stores via Redis client triggers, and automatic relational clustering to prevent database locking during breaking updates.",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-[#080d1a] border border-[#f0ece4]/10 flex flex-col justify-between p-4 overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[9px] text-[#6b6560]">PROJ_SEC_03</span>
          <span className="font-mono text-[9px] text-blue-400">SESSION_LIVE</span>
        </div>
        <div className="my-auto flex flex-col space-y-1.5">
          <div className="w-[85%] h-[1.5px] bg-[#1a1a1a] relative">
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
          </div>
          <p className="font-satoshi text-[11px] text-zinc-400 leading-tight">Cached: Content Node 48</p>
        </div>
        <div className="flex justify-between font-mono text-[8px] text-zinc-600">
          <span>RBAC POLICIES ACTIVATED</span>
          <span>PING: 14ms</span>
        </div>
      </div>
    )
  },
  {
    num: "04",
    slug: "smart-voter",
    name: "Smart Voter System",
    descriptor: "IoT-based voter verification with real-time dashboard",
    tags: ["ESP32", "Node.js", "MySQL", "React", "WebSocket"],
    typePill: "IOT",
    type: "IoT",
    year: "2024",
    specs: [
      { label: "MCU hardware", value: "ESP-WROOM-32 Dev Kit" },
      { label: "Biometric Protocol", value: "FPM10A optical signature" },
      { label: "Transport Stack", value: "WebSockets + Node server" },
      { label: "Broker Node", value: "Custom JSON Event Pipeline" }
    ],
    overview: "A hardware-software convergence project addressing ballot validation security. Designed with low-power microcontrollers connected to physical biometric scanners, streaming direct cryptographic authentication tokens to safe Express registries via secure standard micro-web sockets.",
    renderThumbnail: () => (
      <div className="absolute inset-0 bg-[#08120a] border border-[#f0ece4]/10 flex flex-col justify-between p-4 overflow-hidden select-none">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[9px] text-[#6b6560]">PROJ_SEC_04</span>
          <span className="font-mono text-[9px] text-[#C8FF00]">MCU_CONNECTED</span>
        </div>
        <div className="my-auto flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border border-[#C8FF00]/40 flex items-center justify-center relative">
            <div className="w-2 h-2 rounded-full bg-[#C8FF00]" />
            <div className="absolute inset-0 rounded-full border border-[#C8FF00] animate-ping opacity-30" />
          </div>
        </div>
        <div className="flex justify-between font-mono text-[8px] text-zinc-600">
          <span>BAUD_RATE: 115200</span>
          <span>HARDWARE STACK ON</span>
        </div>
      </div>
    )
  }
];

const filterCategories = ["All", "CLI Tools", "Backend", "AI-Integrated", "IoT"] as const;

interface ProjectsPageProps {
  currentSlug?: string | null;
  onNavigate: (path: string) => void;
  onTransitionTrigger: (targetPath: string) => void;
}

export default function ProjectsPage({ currentSlug, onNavigate, onTransitionTrigger }: ProjectsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (currentSlug) {
        setIsScrolled(window.scrollY > 100);
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);
        } else {
          setScrollProgress(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSlug]);

  // Handle back to home / back to project index with smooth scrolling & transitions
  const handleBackToWork = () => {
    onTransitionTrigger("/projects");
  };

  const handleHomeContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onTransitionTrigger("/#contact");
  };

  // Filter project archive items:
  // Categorization mapping
  const isMatch = (item: ProjectItem, filter: string) => {
    if (filter === "All") return true;
    if (filter === "CLI Tools" && item.type === "CLI Tools") return true;
    if (filter === "Backend" && item.type === "Backend") return true;
    if (filter === "IoT" && item.type === "IoT") return true;
    if (filter === "AI-Integrated" && (item.tags.includes("OpenAI") || item.tags.includes("Gemini AI"))) return true;
    return false;
  };

  // If we are looking at a specific dynamic project route (/projects/[slug])
  if (currentSlug) {
    const project = projectsArchive.find((p) => p.slug === currentSlug);

    if (!project) {
      return (
        <div className="w-full min-h-screen bg-[#080808] text-[#f0ece4] flex flex-col items-center justify-center font-mono">
          <span className="text-red-500 bg-red-950/20 px-4 py-2 border border-red-900/40 rounded">
            404 — PROJECT NOT FOUND
          </span>
          <button 
            onClick={handleBackToWork}
            className="mt-6 text-[#C8FF00] hover:underline"
          >
            ← BACK TO ARCHIVE
          </button>
        </div>
      );
    }

    return (
      <div className="w-full bg-[#080808] text-[#f0ece4] min-h-screen pb-32 pt-28 px-6 md:px-12 lg:px-16 overflow-x-hidden relative select-none">
        
        {/* Floating responsive Back to Work Pill (appears on scroll, displays back icon on mobile) */}
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleBackToWork}
              data-cursor="link"
              className="fixed bottom-8 left-4 md:bottom-auto md:top-8 md:left-8 z-45 bg-white/[0.04] backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[100px] px-3.5 py-3.5 md:px-5 md:py-2.5 flex items-center justify-center gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-satoshi text-[13px] tracking-[0.08em] uppercase select-none pointer-events-auto text-[#f0ece4] hover:text-[#C8FF00] hover:border-[#C8FF00]/50 transition-colors"
            >
              <span className="font-mono text-base md:text-sm">←</span>
              <span className="hidden md:inline font-medium leading-none">Back to Work</span>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          
          {/* Back button and breadcrumbs row */}
          <div className="flex justify-between items-center z-10">
            <button
              onClick={handleBackToWork}
              data-cursor="link"
              className="font-mono text-[12px] text-[#6b6560] hover:text-[#C8FF00] tracking-wider transition-colors uppercase relative flex items-center gap-1.5 py-1"
            >
              ← Back to Work
            </button>
            <span className="font-mono text-[11px] text-[#6b6560] tracking-widest uppercase">
              ARCHIVE // {project.num}
            </span>
          </div>

          <div className="w-full h-[1px] bg-[#1a1a1a]" />

          {/* Core dynamic content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            
            {/* LEFT 7 columns: Hero title & detailed spec sheet */}
            <div className="lg:col-span-7 flex flex-col space-y-10">
              <div className="flex flex-col space-y-4">
                <span className="font-mono text-[12px] text-[#C8FF00] uppercase tracking-wider">
                  [{project.typePill}]
                </span>
                <h1 className="font-display italic text-[clamp(48px,10vw,120px)] leading-[0.95] tracking-tight">
                  {project.name}
                </h1>
                <p className="font-satoshi text-lg md:text-xl text-zinc-400 max-w-2xl font-light">
                  {project.descriptor}
                </p>
              </div>

              {/* Mini tag labels */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-[#1a1a1a] border border-[#222222] font-satoshi font-semibold text-[11px] text-[#6b6560] px-3 py-1 rounded-[4px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Technical Specifications Columns Table */}
              <div className="border border-[#1a1a1a] bg-[#0c0c0c] p-6 md:p-8 flex flex-col space-y-4">
                <span className="font-mono text-[11px] text-[#6b6560] uppercase tracking-wider block border-b border-[#1a1a1a] pb-3">
                  SYSTEM PROFILE // SPECIFICATIONS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
                  {project.specs.map((item, idx) => (
                    <div key={idx} className="flex flex-col space-y-1">
                      <span className="text-[#6b6560] text-[10px] uppercase">{item.label}</span>
                      <span className="text-[#f0ece4] font-medium text-[13px]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT 5 columns: High fidelity preview and core narrative */}
            <div className="lg:col-span-5 flex flex-col space-y-8 justify-between">
              
              {/* Massive scale 16:9 visualization frame */}
              <div className="w-full aspect-[16/10] relative bg-[#0c0c0c] border border-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center">
                {project.renderThumbnail()}
              </div>

              {/* Core descriptive text narrative block */}
              <div className="flex flex-col space-y-6 pt-4">
                <span className="font-mono text-[11px] text-[#C8FF00] tracking-widest uppercase">
                  PROJECT DIRECTIVE // OVERVIEW
                </span>
                <p className="font-satoshi text-base text-zinc-400 leading-relaxed font-light">
                  {project.overview}
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <a
                    href="https://github.com/hrxsiddharth"
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="font-mono text-[12px] bg-[#C8FF00] hover:bg-[#b0df00] text-[#080808] font-bold uppercase py-3 px-6 tracking-wide transition-colors"
                  >
                    EXPLORE CODEBASE ↗
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Unified project bottom divider sheet & simple exit nudge */}
          <div className="w-full h-[1px] bg-[#1a1a1a] mt-24" />
          
          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pointer-events-auto">
            <button
              onClick={handleBackToWork}
              data-cursor="link"
              className="font-mono text-[12px] text-[#6b6560] hover:text-[#C8FF00] tracking-wider uppercase transition-colors"
            >
              ← BACK TO ALL WORK
            </button>
            <span className="font-mono text-[11px] text-[#6b6560]">
              BUILT BY N. SIDDHARTH REDDY // 2025
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- RENDERING "/projects" INDEX LISTING ---
  return (
    <div className="w-full bg-[#080808] text-[#f0ece4] min-h-screen pb-32 pt-28 px-6 md:px-12 lg:px-16 overflow-x-hidden relative select-none">
      
      {/* Floating glassmorphic Return to Home Pill */}
      <motion.button
        initial={{ opacity: 0, y: 15, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        onClick={() => onTransitionTrigger("/")}
        data-cursor="link"
        className="fixed bottom-8 left-4 md:bottom-auto md:top-8 md:left-8 z-45 bg-white/[0.04] backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[100px] px-3.5 py-3 md:px-5 md:py-2.5 flex items-center justify-center gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-satoshi text-[13px] tracking-[0.08em] uppercase select-none pointer-events-auto text-[#f0ece4] hover:text-[#C8FF00] hover:border-[#C8FF00]/50 transition-colors"
      >
        <span className="font-mono text-base md:text-sm">←</span>
        <span className="hidden md:inline font-medium leading-none">Return to Home</span>
        <span className="inline md:hidden font-medium leading-none">Home</span>
      </motion.button>

      {/* Subtle Horizontal scroll position progress indicator */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-55 pointer-events-none">
        <div 
          className="h-full bg-[#C8FF00] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* PAGE HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          {/* Header Left: "Work" custom mask clip text */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic text-[clamp(80px,12vw,160px)] text-[#f0ece4] leading-[0.9] tracking-[-0.03em] block select-none"
            >
              Work
            </motion.h1>
          </div>

          {/* Header Right: Project Counts aligned to baseline, delayed fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:text-right font-mono text-[12px] text-[#6b6560] uppercase tracking-[0.12em] space-y-0.5 shrink-0"
          >
            <span>04 projects</span>
            <span className="normal-case">2024—2025</span>
          </motion.div>
        </div>

        {/* Scaled line draws left-to-right under the header */}
        <div className="relative w-full h-[1px]">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="absolute inset-0 bg-[#1a1a1a] origin-left"
          />
        </div>

        {/* FILTER TAGS ROW */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 pointer-events-auto select-none"
        >
          {filterCategories.map((cat) => {
            const isFilterActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                data-cursor="link"
                className={`font-mono text-[11px] tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-[2px] border transition-all duration-150 shrink-0 select-none ${
                  isFilterActive
                    ? "bg-[#C8FF00] text-[#080808] border-[#C8FF00]"
                    : "bg-transparent text-[#6b6560] border-[#1a1a1a] hover:text-[#f0ece4] hover:border-[#333333]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* PROJECTS INDEX LIST - STACKED ROWS */}
        <motion.div 
          layout
          className="flex flex-col w-full border-t border-[#1a1a1a] mt-6 select-none pointer-events-auto"
          transition={{
            layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <AnimatePresence mode="popLayout">
            {projectsArchive
              .filter((project) => isMatch(project, selectedFilter))
              .map((project) => {
                const isHovered = hoveredSlug === project.slug;

                return (
                  <motion.div
                    key={project.slug}
                    layout="position"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{
                      opacity: { duration: 0.25 },
                      y: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                    }}
                    onClick={() => onTransitionTrigger(`/projects/${project.slug}`)}
                    onMouseEnter={() => setHoveredSlug(project.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    className="relative w-full overflow-hidden"
                  >
                    <div className="w-full block">
                      {/* Outer active highlight line spanning scaleX on hover */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-[2px] bg-[#C8FF00] origin-left transition-transform duration-250 ease-out z-20 pointer-events-none"
                        style={{
                          transform: isHovered ? "scaleX(1)" : "scaleX(0)"
                        }}
                      />

                      {/* Horizontal row container */}
                      <div 
                        className="w-full grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_200px] border-b border-[#1a1a1a] py-7 gap-y-4 md:gap-x-0 items-center justify-between cursor-none transition-colors duration-200 hover:bg-[#0f0f0f] relative group px-1"
                      >
                        
                        {/* COLUMN 1: Index Number */}
                        <div className="text-left font-mono text-[13px] text-[#6b6560] pl-1 md:pl-2">
                          {project.num}
                        </div>

                        {/* COLUMN 2: Identity summary */}
                        <div className="flex flex-col space-y-1.5 text-left pl-1">
                          {/* Name shuffles 10px translate on hover */}
                          <h3 
                            className="font-satoshi font-bold text-[clamp(22px,3.5vw,44px)] text-[#f0ece4] leading-tight transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{
                              transform: isHovered ? "translateX(10px)" : "translateX(0px)"
                            }}
                          >
                            {project.name}
                          </h3>
                          
                          {/* Subtitle tag indicators separated by middot */}
                          <div className="text-[10px] font-mono text-[#6b6560] tracking-wide select-none">
                            {project.tags.join(" · ")}
                          </div>

                          {/* Brief description text limit to 60 chars */}
                          <p className="font-satoshi font-normal text-[14px] text-[#6b6560] max-w-xl select-none leading-relaxed">
                            {project.descriptor.length > 60 ? `${project.descriptor.substring(0, 57)}...` : project.descriptor}
                          </p>
                        </div>

                        {/* COLUMN 3: Metadata pill, year vertically stacked centered */}
                        <div className="flex flex-col items-start md:items-center justify-center gap-1.5 md:text-center pl-1">
                          {/* Year is hidden on mobile inside col-3, only displays on md */}
                          <span className="hidden md:inline font-mono text-[11px] text-[#6b6560]">
                            {project.year}
                          </span>
                          
                          {/* Type Pill */}
                          <span className="font-mono text-[10px] bg-[#0c0c0c] border border-zinc-800 text-[#6b6560] px-2 py-0.5 rounded-[2px] uppercase select-none tracking-widest font-semibold">
                            {project.typePill}
                          </span>
                        </div>

                        {/* COLUMN 4: Visual Miniature frame */}
                        <div className="hidden md:flex justify-end pr-2">
                          <div className="w-[200px] aspect-[3/2] bg-[#0c0c0c] border border-zinc-800 relative z-10 overflow-hidden shrink-0 select-none pointer-events-none">
                            <div 
                              className="w-full h-full relative transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
                              style={{
                                opacity: isHovered ? 1.0 : 0.6,
                                transform: isHovered ? "scale(1.04)" : "scale(1.0)",
                              }}
                            >
                              {project.renderThumbnail()}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>

        {/* BOTTOM OF PAGE — THE CONTACT NUDGE */}
        <div className="pt-24 mt-4 select-none pointer-events-auto flex justify-start">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="/#contact"
              onClick={handleHomeContact}
              data-cursor="link"
              className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display italic text-[clamp(28px,5vw,64px)] text-[#f0ece4] hover:text-[#C8FF00] group transition-colors duration-200"
            >
              <span>Have a project in mind?</span>
              <span className="text-[#C8FF00] inline-flex items-baseline gap-1">
                Let's talk 
                <span className="inline-block transform origin-center transition-transform duration-200 group-hover:rotate-45">
                  →
                </span>
              </span>
            </a>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
