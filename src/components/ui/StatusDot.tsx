import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StatusDotProps {
  label?: string;
}

export default function StatusDot({ label = 'Available for work' }: StatusDotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center cursor-help group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-magnet
      id="status-dot-container"
    >
      <div className="relative flex items-center justify-center w-4 h-4" id="status-dot-wrapper">
        {/* Outer Pulsing Ring */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-signal/40"
          animate={{
            scale: [1, 2.4, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          id="status-dot-pulse"
        />
        {/* Inner Solid Core */}
        <div className="relative w-1.5 h-1.5 rounded-full bg-signal" id="status-dot-core" />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 bottom-6 z-50 px-2.5 py-1 text-[10px] font-mono tracking-wider bg-[#0d0d0d] border border-rule/80 text-signal/90 rounded whitespace-nowrap shadow-xl"
            id="status-dot-tooltip"
          >
            [ {label.toUpperCase()} ]
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
