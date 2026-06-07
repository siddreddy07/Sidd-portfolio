import { useEffect, useRef, useState } from "react";

export default function MarqueeStrip() {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const speedRef = useRef(40); // starts at 40px/s
  const lastTimeRef = useRef<number | null>(null);

  const textSegment = "AVAILABLE FOR HIRE · FULL STACK DEVELOPER · BACKEND DEVELOPER · AI AGENTS · GEN AI · AI INTEGRATIONS · OPEN TO FULL-TIME · ";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animateMarquee = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = timestamp;

      // Target speed calculation
      const targetSpeed = isHovered ? 12 : 40;
      
      // Smooth 0.4s ease transitions between 40px/s and 12px/s
      // Using exponential decaying interpolation: speed = speed + (target - speed) * (1 - e^(-k * t))
      // For ~0.4s response, k = 8 is perfect
      speedRef.current = speedRef.current + (targetSpeed - speedRef.current) * (1 - Math.exp(-8 * deltaTime));

      // Update position
      xRef.current -= speedRef.current * deltaTime;

      // Wrap around cleanly. Let's measure the exact half width
      // Since we duplicate the row exactly twice, half of scrollWidth is the loop point
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0 && Math.abs(xRef.current) >= halfWidth) {
        xRef.current += halfWidth;
      }

      track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      requestAnimationFrame(animateMarquee);
    };

    let animationFrameId = requestAnimationFrame(animateMarquee);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div
      id="marquee-carrier-bar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="link"
      className="w-full h-12 bg-[#C8FF00] border-t border-b border-[#9eb800] overflow-hidden flex items-center select-none relative z-20 pointer-events-auto"
    >
      {/* Scrollable text container */}
      <div 
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform py-1"
      >
        {/* We duplicate the repeated segment plenty of times to cover full width plus loop capacity */}
        <div className="flex gap-x-0 whitespace-nowrap font-satoshi font-bold text-[14px] text-[#080808] tracking-[0.05em] uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`t1-${i}`} className="inline-block pr-4">
              {textSegment}
            </span>
          ))}
        </div>
        {/* Mirror copy for seamless wrap around animation */}
        <div className="flex gap-x-0 whitespace-nowrap font-satoshi font-bold text-[14px] text-[#080808] tracking-[0.05em] uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`t2-${i}`} className="inline-block pr-4">
              {textSegment}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
