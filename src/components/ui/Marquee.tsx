interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number; // duration in seconds
}

export default function Marquee({ items, direction = 'left', speed = 30 }: MarqueeProps) {
  // Triple the items to ensure seamless wrapping on fast or large screens
  const doubledItems = [...items, ...items, ...items];

  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div className="relative flex overflow-x-hidden w-full border-b border-[#1e1e1e] py-4 select-none" id={`marquee-outer-${direction}`}>
      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          min-width: 100%;
          gap: 1.5rem;
        }
        .animate-marquee {
          animation: ${animationName} ${speed}s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-track animate-marquee" id={`marquee-track-${direction}`}>
        {doubledItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-6 font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-[#888680]/50"
            id={`marquee-item-${idx}`}
          >
            <span className="text-text-secondary/70">{item}</span>
            <span className="text-signal/40 text-[14px] select-none">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
