import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import projectsData from "../data/projects.json";
import { getIcon } from "../data/iconMap";

/* Edit src/data/projects.json to add/remove projects.
   The JSON tags are display names. tagIcons reference iconMap strings.
   thumbnail.type can be "image" or "video" — fill the url to show media. */

function renderThumbnail(project: typeof projectsData.projects[number]) {
  const t = project.thumbnail;
  if (!t?.url) {
    return (
      <div className="absolute inset-0 bg-[#0c0c0c] border border-[#f0ece4]/10 flex items-center justify-center select-none">
        <span className="font-mono text-[10px] text-zinc-600">{project.name}</span>
      </div>
    );
  }
  if (t.type === "video") {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={t.url}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return (
    <img
      className="absolute inset-0 w-full h-full object-cover"
      src={t.url}
      alt={project.name}
    />
  );
}

const projectsArchive = projectsData.projects;

const filterCategories = ["All", "CLI Tools", "Backend", "AI-Integrated", "IoT"] as const;

interface ProjectsPageProps {
  currentSlug?: string | null;
  onNavigate: (path: string) => void;
  onTransitionTrigger: (targetPath: string) => void;
}

export default function ProjectsPage({ currentSlug, onNavigate, onTransitionTrigger }: ProjectsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSlug]);

  // Use IntersectionObserver for reliable scroll detection with Lenis
  useEffect(() => {
    if (currentSlug) return;

    const sentinel = headerSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "300px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentSlug]);

  // Handle back to home / back to project index with smooth scrolling & transitions
  const handleBackToWork = () => {
    onTransitionTrigger("/projects");
  };
  const handleBackToHome = () => {
    onTransitionTrigger("/#projects-section");
  };

  const handleHomeContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onTransitionTrigger("/#contact");
  };

  // Filter project archive items:
  // Categorization mapping
  const isMatch = (item: typeof projectsArchive[number], filter: string) => {
    if (filter === "All") return true;
    if (filter === "CLI Tools" && item.type === "CLI Tools") return true;
    if (filter === "Backend" && item.type === "Backend") return true;
    if (filter === "IoT" && item.type === "IoT") return true;
    if (filter === "AI-Integrated" && (item.tags.includes("OpenAI") || item.tags.includes("Gemini") || item.tags.includes("Groq"))) return true;
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
              onClick={handleBackToHome}
              data-cursor="link"
              className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-auto md:top-8 md:left-8 md:translate-x-0 z-45 bg-white/[0.04] backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[100px] px-3.5 py-1.5 md:px-5 md:py-2.5 flex items-center justify-center gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-satoshi text-[13px] tracking-[0.08em] uppercase select-none pointer-events-auto text-[#f0ece4] hover:text-[#C8FF00] hover:border-[#C8FF00]/50 transition-colors"
            >
              <span className="font-mono text-base md:text-sm">←</span>
              <span className="inline font-small text-xs md:text-l md:font-medium leading-none">Back to Home</span>
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
                {renderThumbnail(project)}
              </div>

              {/* Core descriptive text narrative block */}
              <div className="flex flex-col space-y-6 pt-4">
                <span className="font-mono text-[11px] text-[#C8FF00] tracking-widest uppercase">
                  PROJECT DIRECTIVE // OVERVIEW
                </span>
                <p className="font-satoshi text-base text-zinc-400 leading-relaxed font-light">
                  {project.overview}
                </p>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {(project as any).links?.map((link: { label: string; url: string; icon?: string }) => {
                    const LinkIcon = link.icon ? getIcon(link.icon) : null;
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="link"
                        className="font-mono text-[12px] bg-[#C8FF00] hover:bg-[#b0df00] text-[#080808] font-bold uppercase py-3 px-5 tracking-wide transition-all duration-200 inline-flex items-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_-4px_rgba(200,255,0,0.25)] active:translate-y-0"
                      >
                        {LinkIcon && <LinkIcon size={14} />}
                        {link.label} ↗
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Unified project bottom divider sheet & simple exit nudge */}
          <div className="w-full h-[1px] bg-[#1a1a1a] mt-24" />

        </div>
      </div>
    );
  }

  // --- RENDERING "/projects" INDEX LISTING ---
  return (
    <div className="w-full bg-[#080808] text-[#f0ece4] min-h-screen pb-32 pt-28 px-6 md:px-12 lg:px-16 overflow-x-hidden relative select-none">
      
      {/* Floating glassmorphic Return to Home Pill — appears only when scrolled past the header */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onTransitionTrigger("/#projects-section")}
            data-cursor="link"
            className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-auto md:top-8 md:left-8 md:translate-x-0 z-45 bg-white/[0.04] backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[100px] px-2.5 py-2 md:px-5 md:py-2.5 flex items-center justify-center gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-satoshi tracking-[0.08em] uppercase select-none pointer-events-auto text-[#f0ece4] hover:text-[#C8FF00] hover:border-[#C8FF00]/50 transition-colors"
          >
            <span className="font-mono text-xs md:text-sm">←</span>
            <span className="inline text-xs font-medium leading-none">Return to Home</span>
          </motion.button>
        )}
      </AnimatePresence>



      {/* Sentinel for IntersectionObserver — when this leaves viewport, show floating pill */}
      <div ref={headerSentinelRef} className="absolute top-0 left-0 w-full h-[1px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* PAGE HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          {/* Header Left: "Work" custom mask clip text */}
          <div className="overflow-hidden flex items-baseline gap-4 md:gap-6">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic text-[clamp(80px,12vw,160px)] text-[#f0ece4] leading-[0.9] tracking-[-0.03em] block select-none"
            >
              Work
            </motion.h1>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={() => onTransitionTrigger("/#projects-section")}
              data-cursor="link"
              className="font-mono text-[11px] md:text-[21px] text-[#6b6560] hover:text-[#C8FF00] tracking-wider uppercase transition-colors shrink-0 mt-2"
            >
              ← Back to Home
            </motion.button>
          </div>

          {/* Header Right: Project Counts aligned to baseline, delayed fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:text-right font-mono text-[12px] text-[#6b6560] uppercase tracking-[0.12em] space-y-0.5 shrink-0"
          >
            <span>05 projects</span>
            <span className="normal-case">2024 — 2026<span className="text-accent-lime relative -top-1">*</span></span>
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
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 pointer-events-auto select-none touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
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
                    data-cursor="true"
                    data-cursor-label={`VIEW ${project.name}`}
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
                              {renderThumbnail(project)}
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
