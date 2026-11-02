import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

// Scroll-linked reveal: content rises and fades in as it enters from the bottom of the screen, and eases out as it
// leaves through the top, in both scroll directions. Driven by motion values (no re-renders) and smoothed with a
// spring. Renders plain content under prefers-reduced-motion.
const SPRING = { stiffness: 140, damping: 26, mass: 0.6, restDelta: 0.001 };

export default function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 0 → 1 while the top edge travels from the bottom of the viewport to 80% of the way up it.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 80%"] });
  // 0 → 1 while the bottom edge travels from 25% down the viewport to the very top.
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["end 25%", "end start"] });

  const inP = useSpring(enter, SPRING);
  const outP = useSpring(leave, SPRING);

  const opacity = useTransform<number, number>([inP, outP], ([i, o]) => Math.min(i, 1 - o * 0.85));
  const y = useTransform<number, number>([inP, outP], ([i, o]) => (1 - i) * 48 - o * 28);
  const scale = useTransform<number, number>([inP, outP], ([i, o]) => 0.97 + 0.03 * i - 0.02 * o);
  const filter = useTransform<number, string>([inP, outP], ([i, o]) => {
    const blur = (1 - i) * 6 + o * 4;
    return blur < 0.05 ? "none" : `blur(${blur.toFixed(2)}px)`;
  });

  if (reduce)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  return (
    <motion.div ref={ref} className={className} style={{ opacity, y, scale, filter, willChange: "transform, opacity" }}>
      {children}
    </motion.div>
  );
}
