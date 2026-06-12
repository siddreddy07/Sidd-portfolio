import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import KaraokeOverlay from "./KaraokeOverlay";

function Ball({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      onClick={onClick}
      data-cursor="true"
      data-cursor-label={active ? "STOP" : "PARTY"}
      className="w-9 h-9 lg:w-11 lg:h-11 aspect-square rounded-full flex items-center justify-center transition-shadow duration-300 flex-shrink-0 relative"
      style={{
        background: active
          ? "radial-gradient(circle at 35% 30%, #f0f0f0, #aaa 50%, #555)"
          : "radial-gradient(circle at 35% 30%, #555, #2a2a2a 50%, #111)",
        boxShadow: active
          ? "0 0 8px #C8FF00, 0 0 16px #FF0066, 0 0 24px #00D4FF, 0 0 32px #FF6B00, inset 0 -2px 4px rgba(0,0,0,0.4)"
          : "0 0 4px rgba(255,255,255,0.06), inset 0 -2px 4px rgba(0,0,0,0.5)",
      }}
    >
      {active && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <style>{`
            @keyframes sparkle {
              0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
              50% { opacity: 1; transform: scale(1) rotate(180deg); }
            }
          `}</style>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * 360;
            const dist = 22 + (i % 3) * 6;
            const colors = ["#C8FF00", "#FF0066", "#00D4FF", "#FF6B00", "#B400FF", "#FFD700"];
            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: colors[i % colors.length],
                  left: `${Math.cos((angle * Math.PI) / 180) * dist}px`,
                  top: `${Math.sin((angle * Math.PI) / 180) * dist}px`,
                  animation: `sparkle ${0.6 + (i % 3) * 0.3}s ease-in-out ${i * 0.15}s infinite`,
                  boxShadow: `0 0 4px ${colors[i % colors.length]}`,
                }}
              />
            );
          })}
        </div>
      )}
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full p-[1px]"
        style={{
          animation: active ? "discoSpin 3s linear infinite" : "none",
        }}
      >
        <style>{`
          @keyframes discoSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <defs>
          <clipPath id="sphere-clip">
            <circle cx="12" cy="12" r="11" />
          </clipPath>
        </defs>
        <g clipPath="url(#sphere-clip)">
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => {
              const x = col * 4;
              const y = row * 4;
              const bright = (row + col) % 2 === 0;
              const shade = active
                ? bright
                  ? "rgba(255,255,255,0.6)"
                  : `rgba(${200 + (row * 10) % 56}, ${255 - (col * 30) % 100}, ${(row * col * 20) % 80}, 0.25)`
                : bright
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.04)";
              return <rect key={`${row}-${col}`} x={x} y={y} width="4" height="4" fill={shade} />;
            })
          )}
          <ellipse cx="9" cy="8" rx="4" ry="2.5" fill="rgba(255,255,255,0.18)" transform="rotate(-20, 9, 8)" />
        </g>
      </svg>
    </motion.button>
  );
}

export default function DiscoBall() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Karaoke lyrics overlay */}
      <KaraokeOverlay active={active} />

      {/* Mobile/tablet: portaled to body */}
      {mounted && createPortal(
        <div className="lg:hidden fixed top-4 right-4 z-50 flex flex-col items-end gap-1">
          <Ball active={active} onClick={() => setActive((a) => !a)} />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.1em] uppercase whitespace-nowrap pointer-events-none select-none transition-colors duration-300 text-right"
            style={{ color: active ? "rgba(200,255,0,0.7)" : "rgba(107,101,96,0.65)" }}>
            {active ? "Tap to stop" : "Wanna karaoke?"}
          </span>
        </div>,
        document.body
      )}

      {/* Desktop: inline inside the nav */}
      <div className="hidden lg:flex items-center">
        <Ball active={active} onClick={() => setActive((a) => !a)} />
      </div>
    </>
  );
}
