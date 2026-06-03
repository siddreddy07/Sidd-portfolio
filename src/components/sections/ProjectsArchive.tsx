import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  Github,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import SectionMarker from '../ui/SectionMarker';
import { PROJECTS } from '../../data';

interface ProjectCardProps {
  project: any;
  cardVariants: any;
  projectBullets: Record<string, string[]>;
  key?: string | number;
}

function ProjectCard({ project, cardVariants, projectBullets }: ProjectCardProps) {
  const [showSpecs, setShowSpecs] = useState(true);

  // Default collapsed on mobile, expanded on desktop
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    setShowSpecs(media.matches);
    
    const handleMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setShowSpecs(e.matches);
    };
    media.addEventListener('change', handleMatch);
    return () => media.removeEventListener('change', handleMatch);
  }, []);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col bg-[#050505] border border-[#141414] rounded-[5px] hover:border-[#1e1e1e] transition-all duration-300 p-6 sm:p-8 h-full"
      id={`archive-card-${project.id}`}
    >
      {/* Top border glowing line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Left accent glowing status pipe */}
      <div className="absolute left-0 top-0 bottom-0 w-[2.5px] bg-[#141414] group-hover:bg-signal transition-colors duration-300 rounded-l" />

      {/* Header Row: Index label + Year */}
      <div className="flex justify-between items-center mb-4 text-xs font-mono" id={`archive-p-meta-${project.id}`}>
        <span className="text-signal font-bold tracking-widest">{project.index}</span>
        <span className="text-[#3c3a37] tracking-wider uppercase font-semibold">
          BUILD // {project.year}
        </span>
      </div>

      {/* Name */}
      <h4 className="font-display font-black text-xl sm:text-2xl text-text-primary tracking-tight transition-colors duration-300 group-hover:text-signal uppercase mb-3 text-left">
        {project.name}
      </h4>

      {/* Short description */}
      <p className="font-mono text-[12px] text-text-secondary leading-relaxed mb-6 text-left min-h-[44px]">
        {project.description}
      </p>

      {/* Spec details lists with collapsible accordions */}
      {projectBullets[project.id] && (
        <div className="flex flex-col border-t border-[#121212] pt-4 mb-6 text-left" id={`archive-p-specs-${project.id}`}>
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="flex justify-between items-center w-full font-mono text-[9px] text-[#444] hover:text-signal tracking-widest uppercase font-bold text-left cursor-pointer select-none border-none bg-transparent p-0"
          >
            <span>// ARCHITECTURE & SPECIFICATIONS</span>
            <span className="text-[#333] group-hover:text-signal/60 transition-colors">
              {showSpecs ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </span>
          </button>

          <motion.div
            initial={false}
            animate={{ 
              height: showSpecs ? 'auto' : 0, 
              opacity: showSpecs ? 1 : 0,
              marginTop: showSpecs ? 12 : 0,
              marginBottom: showSpecs ? 4 : 0
            }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-2 text-text-secondary text-[11.5px] list-none p-0 m-0">
              {projectBullets[project.id].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle size={12} className="text-signal/80 mt-1 flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}

      {/* Tags strip */}
      <div className="flex flex-wrap gap-1.5 mb-6 text-left" id={`archive-p-tags-${project.id}`}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[9.5px] px-2 py-0.5 bg-[#090909] border border-[#141414] text-[#3c3a37] tracking-wider uppercase rounded-sm group-hover:text-text-secondary group-hover:border-[#1b1b1b] transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Links */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 border-t border-[#121212] pt-4 mt-auto font-mono text-[11px]" id={`archive-p-links-${project.id}`}>
        {project.url && project.url !== '#' && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-signal hover:underline"
            id={`archive-btn-visit-${project.id}`}
          >
            <span>VISIT WEB</span>
            <ExternalLink size={12} />
          </a>
        )}
        {project.npmUrl && (
          <a
            href={project.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-signal hover:underline"
            id={`archive-btn-npm-${project.id}`}
          >
            <span>NPM PACKAGE</span>
            <ExternalLink size={12} />
          </a>
        )}
        <a
          href={project.githubUrl || "https://github.com/siddreddy07"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-semibold text-text-secondary hover:text-text-primary transition-colors"
          id={`archive-btn-code-${project.id}`}
        >
          <Github size={12} />
          <span>CODEBASE</span>
        </a>
      </div>
    </motion.div>
  );
}

export default function ProjectsArchive() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const projectBullets: Record<string, string[]> = {
    'mew-claw': [
      'Engineered multi-channel Telegram webhook controller using Vercel AI SDK and Groq backend orchestration.',
      'Built interactive security gates and approval prompts with inline keyboard callback queries.',
      'Integrated filesystem fuzzy search and real-time system terminal command exec bridging with approval walls.'
    ],
    'db-smash': [
      'Published command-line utility downloadable via npm globally.',
      'Translates natural language descriptions into SQL/NoSQL schemas.',
      'Incorporate Gemini API model capabilities for type formatting.'
    ],
    'shraddha-media': [
      'Engineered session handling with latency-capped Redis caches.',
      'Implemented full multi-tier role-based access checking (RBAC).',
      'Automated midnight clock XML/Sitemap generation and scheduling.'
    ],
    'hook-lens': [
      'Real-time webhook queue parser built for high-throughput loads.',
      'Integrates Vercel AI SDK translation logic to analyze cryptographical schemas.',
      'Styled with intuitive terminal timelines and error logs.'
    ],
    'smart-voter': [
      'Interfaced AS608 optical fingerprint reader with ESP32 over UART GP16/GP17 routing.',
      'Relational transactions tracking prevents duplicate votes in real-time.',
      'Features a responsive administrative control board backing election counts.'
    ]
  };

  const handleBackHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section className="bg-void px-6 md:px-12 py-32 relative select-none min-h-screen" id="projects-archive">
      {/* Absolute clean geometric background lines */}
      <div className="absolute right-1/4 top-0 bottom-0 w-px bg-[#111] pointer-events-none opacity-40" />
      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-[#111] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Back navigation */}
        <div className="mb-10 text-left">
          <a
            href="#"
            onClick={handleBackHome}
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold text-text-secondary hover:text-signal tracking-widest uppercase transition-colors"
            id="back-home-link"
          >
            <ArrowLeft size={14} className="text-signal" />
            <span>BACK TO HOME</span>
          </a>
        </div>

        <SectionMarker number="ARCHIVE" label="ALL PROJECTS" />

        {/* Selected Work Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-[#141414] mt-12 mb-12" id="archive-section-header">
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-text-primary uppercase">
              PROJECT REPOSITORY ARCHIVE
            </h3>
            <p className="font-mono text-[10px] sm:text-[11px] text-text-dim uppercase tracking-widest">
              INDEX OF COMPLETED DESIGNS, APPLICATIONS AND CODE BASES
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0 font-mono text-[11px] text-[#44433e]">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span>{PROJECTS.length.toString().padStart(2, '0')} REPOSITORIES TOTAL</span>
          </div>
        </div>

        {/* Grid of Project Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          id="archive-grid-list"
        >
          {PROJECTS.map((project) => {
            return (
              <ProjectCard
                key={project.id}
                project={project}
                cardVariants={cardVariants}
                projectBullets={projectBullets}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
