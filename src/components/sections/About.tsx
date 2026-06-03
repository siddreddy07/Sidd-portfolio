import { motion } from 'motion/react';
import SectionMarker from '../ui/SectionMarker';
import RevealLine from '../ui/RevealLine';
import Marquee from '../ui/Marquee';
import Parallax from '../ui/Parallax';

export default function About() {
  const row1Skills = [
    'NODE.JS',
    'EXPRESS',
    'VERCEL AI SDK',
    'RAG PIPELINES',
    'POSTGRESQL',
    'REDIS',
    'VECTOR DBs',
    'SOCKET.IO',
  ];

  const row2Skills = [
    'SYSTEM INTEGRATIONS',
    'SOFTWARE AGENTS',
    'MONGODB',
    'DRIZZLE ORM',
    'NEON',
    'VERCEL',
    'TYPESCRIPT',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="bg-void px-6 md:px-12 py-24 select-text" id="selected-about">
      <SectionMarker number="01" label="WHO" />

      {/* Grid container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mt-12"
        id="about-content-grid"
      >
        {/* Left Column: Bold Statement */}
        <Parallax speed={0.4} className="lg:col-span-7">
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-start"
            id="about-left-statement"
          >
            <div className="flex flex-col mb-10 select-none" id="headline-reveal-stack">
  <RevealLine delay={0.0}>
    <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-text-primary leading-[1.12] tracking-tight">
      I’m a developer who
    </h2>
  </RevealLine>
  <RevealLine delay={0.12}>
    <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-text-primary leading-[1.12] tracking-tight">
      builds and learns by shipping
    </h2>
  </RevealLine>
  <RevealLine delay={0.24}>
    <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-text-primary leading-[1.12] tracking-tight">
      real-world applications.
    </h2>
  </RevealLine>
</div>

            {/* Academic or Location Tags */}
            <div className="flex flex-col gap-3 font-mono text-[13px] text-text-secondary select-all" id="academic-details">
              <div className="flex items-center gap-2" id="academics-row-1">
                <span className="text-signal/80 select-none">✦</span>
                <span>Andhra University · B.Tech CSE · 2025 · 7.99 CGPA</span>
              </div>
              <div className="flex items-center gap-2" id="academics-row-2">
                <span className="text-signal/80 select-none">→</span>
                <span>Hyderabad, IN → Wherever the work is good.</span>
              </div>
            </div>
          </motion.div>
        </Parallax>

        {/* Right Column: Interactive Styled Terminal visualizer */}
        <Parallax speed={-0.3} className="lg:col-span-12 xl:col-span-5">
          <motion.div
            variants={itemVariants}
            className="bg-surface-1 border border-[#1e1e1e] rounded-[4px] p-6 font-mono text-[12px] text-text-secondary leading-relaxed shadow-xl relative overflow-hidden"
            id="terminal-box"
          >
            {/* Faux terminal ribbon */}
            <div className="absolute top-2 right-4 flex items-center gap-1.5 select-none" id="terminal-dots">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e]" />
            </div>

            <div className="flex flex-col gap-4 select-text" id="terminal-log-flow">
              <div>
                <span className="text-[#888680]/60 mr-2 select-none">~</span>
                <span className="text-text-primary">cat about.txt</span>
              </div>
              <div className="pl-4 flex flex-col gap-1 border-l border-[#1e1e1e]" id="cat-about-stdout">
                <span className="text-text-secondary/90">Specialized in autonomous agents & distributed orchestration.</span>
                <span className="text-text-secondary/90">Design secure, low-latency, context-aware RAG pipelines.</span>
                <span className="text-text-secondary/90">Skilled in Vector Databases, Node/Express, and React/Next.js.</span>
                <span className="text-text-secondary/90">2 backend engineering internships completed successfully.</span>
              </div>

              <div>
                <span className="text-[#888680]/60 mr-2 select-none">~</span>
                <span className="text-text-primary">cat status.txt</span>
              </div>
              <div className="pl-4 flex flex-col gap-1 border-l border-rule" id="cat-status-stdout">
                <span className="text-signal">→ looking for full-stack & backend developer roles</span>
                <span className="text-signal">→ building with and around AI</span>
                <span className="text-[#888]">→ integrating AI ecosystems</span>
              </div>

              <div className="flex items-center gap-1 mt-1" id="cat-prompt-blink">
                <span className="text-[#888680]/60 select-none">~</span>
                <span className="w-2 h-4 bg-signal animate-[pulse_0.8s_infinite] select-none" />
              </div>
            </div>
          </motion.div>
        </Parallax>
      </motion.div>

      {/* Marquee double band strips */}
      <div className="mt-24 border-t border-[#1e1e1e] pt-12 flex flex-col gap-4" id="skills-stripes">
        <Marquee items={row1Skills} direction="left" speed={32} />
        <Marquee items={row2Skills} direction="right" speed={40} />
      </div>
    </section>
  );
}
