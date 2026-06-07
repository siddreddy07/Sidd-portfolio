import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [t, setT] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  // Smooth, frame-accurate elapsed timer to sync typewriter and progress bar seamlessly
  useEffect(() => {
    const updateTime = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      setT(elapsed);

      if (elapsed < 3600) {
        frameRef.current = requestAnimationFrame(updateTime);
      } else {
        // Safe exit trigger
        onComplete();
      }
    };

    frameRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [onComplete]);

  // 1. Text Typewriter: begins at 200ms, typing at 40ms intervals
  const textToType = "initializing sidd.dev";
  let displayedText = "";
  if (t >= 200) {
    const charIndex = Math.floor((t - 200) / 40);
    displayedText = textToType.slice(0, Math.max(0, Math.min(textToType.length, charIndex)));
  }

  // 2. Progress Bar: begins at 1300ms, finishes at 2200ms (900ms duration)
  let progressPercent = 0;
  if (t >= 1300) {
    const progressRatio = Math.min(1, (t - 1300) / 900);
    // Ease-in-out formula (standard smooth-step cubic)
    const easedRatio = progressRatio * progressRatio * (3 - 2 * progressRatio);
    progressPercent = easedRatio * 100;
  }

  // 3. Clip upward states
  const clipUp = t >= 2400;

  // 4. Hero Names Slam state (starts at 2500ms)
  const showSlamNames = t >= 2500;

  // 5. Total Loader Wipe state (starts at 2800ms, duration 700ms)
  const isWipingUp = t >= 2800;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#080808] overflow-hidden select-none flex items-center justify-center transition-transform will-change bg-blend-normal"
      style={{
        transform: isWipingUp ? "translateY(-100%)" : "translateY(0%)",
        transition: isWipingUp ? "transform 0.7s cubic-bezier(0.7, 0, 0.3, 1)" : "none",
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Step 1: Typewriter & Progress Bar layout (with upward clipping) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="h-[60px] overflow-hidden flex flex-col items-center justify-end">
            <div
              className="flex flex-col items-center justify-end"
              style={{
                transform: clipUp ? "translateY(-100%)" : "translateY(0%)",
                transition: clipUp ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                opacity: clipUp ? 0 : 1,
              }}
            >
              {/* Mono initializing code text */}
              <div className="font-mono text-[12px] text-[#6b6560] tracking-[0.15em] uppercase h-[18px]">
                {displayedText}
              </div>

              {/* Space gap between text and progress bar */}
              <div className="h-6" />

              {/* Progress bar structure */}
              <div 
                className="w-[160px] h-[1px] bg-[#1a1a1a] relative overflow-hidden transition-opacity duration-300"
                style={{
                  opacity: t >= 1300 ? 1 : 0
                }}
              >
                <div 
                  className="absolute left-0 top-0 h-full bg-[#C8FF00]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: "SIDD" & "REDDY" Slam animation words (starts at 2500ms) */}
        {showSlamNames && (
          <div className="flex flex-col md:flex-row items-center justify-center text-center gap-x-8 md:gap-x-12 select-none tracking-[-0.04em] font-display italic leading-none whitespace-nowrap overflow-hidden">
            {/* Left word: SIDD */}
            <div className="overflow-hidden py-4 px-2">
              <motion.span
                initial={{ x: "-100vw", opacity: 0 }}
                animate={{ x: [ "-100vw", "5px", "0px" ], opacity: 1 }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.8, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block text-text-primary text-[clamp(72px,14vw,180px)] select-none font-display uppercase italic text-[#f0ece4] leading-none"
              >
                SIDD
              </motion.span>
            </div>

            {/* Right word: REDDY */}
            <div className="overflow-hidden py-4 px-2">
              <motion.span
                initial={{ x: "100vw", opacity: 0 }}
                animate={{ x: [ "100vw", "-5px", "0px" ], opacity: 1 }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.8, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block text-text-primary text-[clamp(72px,14vw,180px)] select-none font-display uppercase italic text-[#f0ece4] leading-none"
              >
                REDDY
              </motion.span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
