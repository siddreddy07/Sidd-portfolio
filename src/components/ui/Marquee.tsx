interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
}

export default function Marquee({ items, direction = 'left', speed = 30 }: MarqueeProps) {
  const doubledItems = [...items, ...items];
  const uid = `mq-${direction}-${speed}`;

  return (
    <div className="relative flex overflow-x-hidden w-full border-b border-[#1e1e1e] py-4 select-none">
      <style>{`
        @keyframes ${uid}-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ${uid}-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          min-width: 100%;
          gap: 1.5rem;
          will-change: transform;
        }
        .${uid} {
          animation: ${uid}-${direction} ${speed}s linear infinite;
        }
        .${uid}:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className={`marquee-track ${uid}`}>
        {doubledItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-6 font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-[#888680]/50"
          >
            <span className="text-text-secondary/70">{item}</span>
            <span className="text-signal/40 text-[14px] select-none">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
