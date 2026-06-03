import { motion } from 'motion/react';
import { FileDown, FileUser } from 'lucide-react';
import { RESUME_URL } from '../../data';

export default function FloatingResume() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 pointer-events-auto"
      id="floating-resume-root"
    >
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 bg-[#050505]/90 hover:bg-[#080808] border border-[#1a1a1a] hover:border-signal/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_40px_rgba(0,255,85,0.08)] transition-all duration-300"
        id="floating-resume-link"
      >
        {/* Glow backdrop behind it */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-signal/0 via-signal/1 to-signal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Pulse beacon dot */}
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal"></span>
        </span>

        {/* Action Title */}
        <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-text-primary uppercase flex items-center gap-1.5">
          RESUME
          <span className="text-[#444] font-normal group-hover:text-signal/80 transition-colors duration-200">.PDF</span>
        </span>

        {/* Action Icon container with rotation */}
        <div className="w-5 h-5 rounded-full bg-[#111] group-hover:bg-signal/10 border border-[#222] group-hover:border-signal/30 flex items-center justify-center transition-all duration-300">
          <FileDown size={10} className="text-text-secondary group-hover:text-signal group-hover:translate-y-0.5 transition-all duration-300" />
        </div>
      </a>
    </motion.div>
  );
}
