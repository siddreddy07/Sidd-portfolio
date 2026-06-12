import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LyricLine {
  text: string;
  delay?: number;
  duration?: number;
}

const PLACEHOLDER_LYRICS: LyricLine[] = [
  { text: "Under the lights", delay: 0, duration: 2000 },
  { text: "Where everyone's watching", delay: 2500, duration: 2200 },
  { text: "We'll sing through the night", delay: 5500, duration: 2000 },
  { text: "Like stars we keep on shining", delay: 8500, duration: 2500 },
  { text: "The beat goes on and on", delay: 12000, duration: 2000 },
  { text: "We're never growing tired", delay: 15000, duration: 2200 },
  { text: "This moment's ours to keep", delay: 18000, duration: 2000 },
  { text: "A memory set on fire", delay: 21000, duration: 2500 },
  { text: "So raise your voice with me", delay: 25000, duration: 2000 },
  { text: "Let the whole world hear us sing", delay: 28000, duration: 3000 },
];

function LyricLine({ line, state }: { line: LyricLine; state: "upcoming" | "current" | "done"; key?: number }) {
  return (
    <div className="relative overflow-hidden py-0.5">
      <span
        className={`block font-display italic text-[clamp(13px,3vw,20px)] leading-snug tracking-tight transition-all duration-500 ${
          state === "done"
            ? "text-text-primary"
            : state === "current"
              ? "text-text-secondary/30"
              : "text-text-secondary/15"
        }`}
      >
        {line.text}

        {state === "current" && (
          <motion.span
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ x: "-101%" }}
            animate={{ x: "0%" }}
            transition={{ duration: line.duration ? line.duration / 1000 : 2, ease: "linear" }}
          >
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(90deg, #C8FF00 0%, #FFD700 50%, #FF6B00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "brightness(1.3)",
              }}
            >
              {line.text}
            </span>
          </motion.span>
        )}

        {state === "done" && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #C8FF00 0%, #FFD700 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.5,
            }}
          >
            {line.text}
          </span>
        )}
      </span>
    </div>
  );
}

interface KaraokePopupProps {
  lyrics?: LyricLine[];
  active: boolean;
  onStop: () => void;
  onClose: () => void;
}

export default function KaraokePopup({ lyrics = PLACEHOLDER_LYRICS, active, onStop, onClose }: KaraokePopupProps) {
  const [currentLine, setCurrentLine] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    setCurrentLine(0);

    lyrics.forEach((line, i) => {
      const timer = setTimeout(() => {
        setCurrentLine(i);
      }, line.delay ?? i * 3000);
      timersRef.current.push(timer);
    });

    const last = lyrics[lyrics.length - 1];
    const finalTimer = setTimeout(() => {
      setCurrentLine(lyrics.length);
    }, (last?.delay ?? lyrics.length * 3000) + (last?.duration ?? 2000) + 500);

    timersRef.current.push(finalTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [lyrics]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_16px_48px_0_rgba(0,0,0,0.5)] p-3 md:p-4 w-[clamp(240px,72vw,360px)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-accent-lime block flex-shrink-0"
            style={{
              boxShadow: active ? "0 0 6px #C8FF00, 0 0 12px #C8FF0066" : "none",
              animation: active ? "karaokePulse 1.2s ease-in-out infinite" : "none",
            }}
          />
          <style>{`
            @keyframes karaokePulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.3); opacity: 0.6; }
            }
          `}</style>
          <div>
            <h3 className="font-satoshi text-[10px] tracking-[0.15em] uppercase text-text-primary leading-tight">
              Now Playing
            </h3>
            <p className="font-display italic text-xs text-accent-lime leading-tight mt-0.5">
              Disco Fever
            </p>
          </div>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-accent-lime bg-accent-lime/10 px-2 py-0.5 rounded-full">
          LIVE
        </span>
      </div>

      {/* Lyrics */}
      <div className="relative mb-2 min-h-[60px] md:min-h-[70px] flex flex-col justify-center">
        <div className="space-y-0.5">
          {lyrics
            .filter((_, i) => i === currentLine || i === currentLine + 1)
            .map((line, i) => {
              const actualIndex = currentLine + i;
              let state: "upcoming" | "current" | "done";
              if (actualIndex < currentLine) state = "done";
              else if (actualIndex === currentLine) state = "current";
              else state = "upcoming";

              return <LyricLine key={actualIndex} line={line} state={state} />;
            })}
        </div>

        <div className="mt-2 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #C8FF00, #FFD700, #FF6B00)" }}
            animate={{ width: `${Math.max(0, (currentLine / lyrics.length) * 100)}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={onStop}
        data-cursor="true"
        data-cursor-label="STOP"
        className="w-full font-mono text-[9px] tracking-[0.15em] uppercase text-text-secondary hover:text-text-primary transition-colors border border-white/10 hover:border-white/25 rounded-full py-1.5 bg-white/[0.03] hover:bg-white/[0.06]"
      >
        Stop Party
      </button>
    </motion.div>
  );
}
