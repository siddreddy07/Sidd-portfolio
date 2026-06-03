import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StatusDot from '../ui/StatusDot';
import Parallax from '../ui/Parallax';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const roles = [
    'builds distributed backends that scale.',
    'turns plain English into running APIs.',
    'writes systems other engineers maintain.',
    'ships. not just plans.',
  ];

  const statuses = [
    'NODE v20.11',
    'UPTIME: 847d',
    'STATUS: 200 OK',
    'ENV: PRODUCTION',
  ];

  useEffect(() => {
    // Role cycling timer
    const roleTimer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4000);

    // Bottom info cycling timer
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 4500);

    return () => {
      clearInterval(roleTimer);
      clearInterval(statusTimer);
    };
  }, [roles.length, statuses.length]);

  // Entrance variants triggered after load
  const blockTransition = { duration: 0.85, ease: [0.16, 1, 0.3, 1] };

  return (
    <section
      className="relative min-h-[100dvh] bg-[#050505] flex flex-col justify-between px-6 md:px-12 pt-32 pb-8 overflow-hidden select-none"
      id="hero"
    >
      {/* Structural Top Statement */}
      <div className="w-full" id="hero-statement-top">
        <div className="flex items-center gap-6" id="label-role-container">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-mono text-[11px] font-bold tracking-[0.55em] text-[#3a3936] uppercase whitespace-nowrap"
            id="role-label"
          >
            FULL STACK / BACKEND ENGINEER
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="h-px bg-[#1e1e1e] flex-grow select-none origin-left"
            id="role-line-divider"
          />
        </div>

        {/* Cinematic Name Titles - Wrapped in smooth Parallax */}
        <Parallax speed={0.4} className="mt-8">
          <div className="flex flex-col justify-start" id="hero-name-display">
            <div className="overflow-hidden h-[76px] sm:h-[110px] md:h-[160px] leading-none" id="line-1-overflow">
              <motion.h1
                initial={{ y: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
                animate={{ y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                transition={{ ...blockTransition, delay: 0.4 }}
                className="font-display font-extrabold text-[54px] sm:text-[84px] md:text-[124px] lg:text-[144px] text-text-primary uppercase tracking-[-0.035em] leading-none select-text"
                id="title-name-first"
              >
                SIDDHARTH
              </motion.h1>
            </div>

            <div className="overflow-hidden h-[76px] sm:h-[110px] md:h-[160px] leading-none" id="line-2-overflow">
              <motion.h1
                initial={{ y: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
                animate={{ y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                transition={{ ...blockTransition, delay: 0.52 }}
                className="font-display font-extrabold text-[54px] sm:text-[84px] md:text-[124px] lg:text-[144px] text-text-primary uppercase tracking-[-0.035em] leading-none select-text"
                id="title-name-last"
              >
                REDDY<span className="text-signal select-none">.</span>
              </motion.h1>
            </div>
          </div>
        </Parallax>

        {/* Dynamic cycling role descriptors */}
        <div className="mt-12 h-8 flex items-center" id="cycling-words-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={roleIndex}
              initial={{ y: 15, opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
              animate={{ y: 0, opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
              exit={{ y: -15, opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1 sm:gap-2 font-mono text-[13px] sm:text-[15px] text-text-secondary select-text"
              id={`cycling-item-${roleIndex}`}
            >
              <span className="text-signal font-bold select-none mr-1">→</span>
              {roles[roleIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Grid footer data bar */}
      <Parallax speed={-0.15}>
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#1e1e1e] pt-6"
          id="hero-bottom-grid"
        >
          <div className="flex items-center gap-3" id="availability-badge">
            <StatusDot label="Available for work" />
            <span className="font-mono text-[11px] font-semibold text-text-secondary tracking-widest uppercase">
              OPEN TO FULL-TIME — EARLY STAGE STARTUPS
            </span>
          </div>

          {/* Interactive Server Log Panel Accent */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#3a3936] sm:self-center" id="server-stats-log">
            <span className="w-1.5 h-1.5 rounded-full bg-signal/40 animate-pulse select-none" />
            <AnimatePresence mode="wait">
              <motion.span
                key={statusIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.25 }}
                className="text-[#888680] font-medium tracking-widest min-w-[120px] text-right uppercase"
                id={`ticker-log-${statusIndex}`}
              >
                {statuses[statusIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </Parallax>
    </section>
  );
}
