import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isWiped, setIsWiped] = useState(false);

  // Smooth progress count up
  useEffect(() => {
    let currentProgress = 0;
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds for cinematic tension

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      
      // Luxurious ease-out cubic-like count
      const easeT = 1 - Math.pow(1 - t, 3); 
      currentProgress = Math.floor(easeT * 100);
      setProgress(currentProgress);

      if (t < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Completed - trigger beautiful wipe reveal animation
        setTimeout(() => {
          setIsWiped(true);
          setTimeout(() => {
            onComplete();
          }, 850); // Exact exit duration
        }, 600);
      }
    };

    const rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  // Letters of the main display title
  const titleText = "N. SIDDHARTH REDDY";
  const letters = titleText.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.03,
      filter: 'blur(10px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, rotateX: -30 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <AnimatePresence>
      {!isWiped && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-void select-none flex flex-col justify-between p-8 sm:p-16"
          id="luxe-preloader-overlay"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,85,0.02)_0%,transparent_65%)] pointer-events-none" />

          {/* Top Decorative Row */}
          <div className="flex justify-between items-center border-b border-[#0f0f0f] pb-6 font-mono text-[10px] tracking-[0.2em] text-text-dim" id="luxe-preloader-top">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              <span>SIDDHARTH REDDY</span>
            </div>
            <div>
              [ WELCOME ]
            </div>
          </div>

          {/* Center Display: Gorgeous Typographical Focus */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-grow flex flex-col justify-center items-center py-16"
            id="luxe-preloader-body"
          >
            {/* Main Name Reveal */}
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-[0.3em] uppercase mr-[-0.3em] flex flex-wrap justify-center overflow-hidden" id="luxe-brand-logo">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className={`inline-block ${char === " " ? "w-4 sm:w-6" : ""}`}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* Creative Tagline Reveal */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.45, y: 0 }}
              transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] sm:text-[11px] text-text-secondary tracking-[0.4em] uppercase mt-4 mr-[-0.4em] text-center"
              id="luxe-tagline"
            >
              FULL STACK DEVELOPER / BACKEND DEVELOPER
            </motion.p>
          </motion.div>

          {/* Bottom Display: Progress & High Precision Counter */}
          <div className="flex flex-col gap-6" id="luxe-preloader-bottom">
            {/* Symmetric line slider progressing outwards from center */}
            <div className="relative w-full h-[1px] bg-[#101010]" id="h-line-track">
              <motion.div 
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 h-full bg-signal shadow-[0_0_10px_#00FF55] origin-center"
                style={{ width: `${progress}%` }}
                id="h-line-progress"
              />
            </div>

            <div className="flex justify-between items-end" id="luxe-bottom-row">
              {/* Left Fine Print */}
              <div className="font-mono text-[10px] text-text-dim flex flex-col gap-1 tracking-wider uppercase" id="luxe-metadata">
                <span>INITIALIZING</span>
                <span className="text-[#3c3a37]">SECURE CONNECT</span>
              </div>

              {/* Majestic Massive Monospace Number Counter */}
              <div className="flex items-baseline" id="luxe-counter">
                <span className="font-mono text-4xl sm:text-6xl font-light tracking-tighter text-text-primary select-none">
                  {String(progress).padStart(3, '0')}
                </span>
                <span className="font-mono text-[14px] text-signal font-semibold tracking-widest ml-1">
                  %
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
