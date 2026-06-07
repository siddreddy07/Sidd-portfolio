import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onScrollToSpec?: () => void;
  onScrollToSandbox?: () => void;
}

export default function HeroSection({}: HeroSectionProps) {
  const headlineLines = [
    { text: "Backend", color: "text-[#f0ece4]" },
    { text: "Engineer", color: "text-[#f0ece4]" },
    { text: "& Builder", color: "text-[#C8FF00]" }
  ];

  return (
    <section
      id="hero-studio-section"
      className="relative w-full overflow-hidden select-none bg-[#080808] text-[#f0ece4] px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between"
      style={{ minHeight: "100vh", height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scrollDotAnim {
          0% {
            transform: translate(-50%, 0);
            top: 0px;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 0);
            top: 40px;
            opacity: 0;
          }
        }
        .animate-hero-pulse {
          animation: heroPulse 2s infinite;
        }
        .animate-scroll-dot {
          animation: scrollDotAnim 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* LEFT ZONE: 58% width on desktop */}
      <div className="w-full md:w-[58%] h-full flex flex-col justify-between py-12 md:py-20 relative z-10">
        
        {/* Top-left: Name tag */}
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-satoshi font-medium text-[13px] text-[#6b6560] tracking-[0.1em] uppercase"
          >
            N. Siddharth Reddy
          </motion.div>
        </div>

        {/* Center-left: Main headline */}
        <div className="my-auto text-left py-8">
          <div className="flex flex-col space-y-1">
            {headlineLines.map((line, index) => (
              <div className="overflow-hidden" key={index}>
                <motion.span
                  className={`block font-display italic text-[clamp(52px,8.5vw,110px)] leading-[0.9] tracking-tight ${line.color}`}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + index * 0.12,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {line.text}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Descriptor Line below headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-satoshi font-normal text-[15px] text-[#6b6560] mt-5"
          >
            Node.js · APIs · Real-time systems · AI integrations
          </motion.p>
        </div>

        {/* Space reserving block for alignment */}
        <div className="h-8 md:h-12" />
      </div>

      {/* RIGHT ZONE: 42% width on desktop */}
      <div className="w-full md:w-[42%] h-full flex items-center justify-end md:justify-center relative z-10 py-8 md:py-16">
        <div className="relative w-full max-w-[340px] md:max-w-md aspect-[3/4] h-[65vh] md:h-[70vh] bg-[#0c0c0c] overflow-hidden border border-[#f0ece4]/5">
          
          {/* Static high-contrast background container instead of dynamic parallax */}
          <div 
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            {/* Deep rich dark procedural vector illustration as high-end background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#0b0c10] to-[#121319]" />
            
            {/* Glowing system matrix point */}
            <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#C8FF00]/5 rounded-full blur-xl" />

            {/* Micro subtle grain layer only inside the image card */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none mix-blend-overlay">
              <filter id="cardNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#cardNoise)" />
            </svg>
          </div>

          {/* Overlaid Data block pinned to bottom of card */}
          <div className="absolute bottom-0 left-0 w-full border-t border-[#f0ece4]/15 p-4 backdrop-blur-md bg-[#080808]/50 flex justify-between items-center z-10 font-satoshi">
            <span className="font-mono text-[11px] text-[#6b6560]">2025</span>
            <span className="font-medium text-[13px] text-[#f0ece4] tracking-tight">
              B.Tech CSE · Andhra University
            </span>
          </div>

        </div>
      </div>

      {/* BOTTOM-LEFT: pinned coordinates */}
      <div className="absolute bottom-[40px] left-6 md:left-12 lg:left-16 flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-8 font-mono text-[11px] z-20">
        <div className="flex items-center gap-2 text-[#9eb800]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#9eb800] opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#9eb800] animate-hero-pulse"></span>
          </span>
          <span>Currently open to roles</span>
        </div>
        <div className="text-[#6b6560]">
          Visakhapatnam, India · GMT+5:30
        </div>
      </div>

      {/* BOTTOM-CENTER: scroll indicator */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex items-center gap-3 h-12 z-20">
        <span className="font-mono text-[9px] text-[#6b6560] uppercase select-none tracking-[0.2em] origin-center rotate-90 inline-block translate-x-1 translate-y-[2px]">
          scroll
        </span>
        <div className="w-[1px] h-[36px] bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-[#C8FF00] rounded-full animate-scroll-dot" />
        </div>
      </div>

    </section>
  );
}
