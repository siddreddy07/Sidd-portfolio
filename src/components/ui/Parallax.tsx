import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // Ratio multiplier for depth speed (e.g., -0.5, 0.5, 1, -1.2)
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
}

export default function Parallax({ children, speed = 0.5, className = "", style = {} }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const handleMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    handleMatch(media);
    media.addEventListener('change', handleMatch);
    return () => media.removeEventListener('change', handleMatch);
  }, []);

  // Tracks the scroll state across viewport entry to exit
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate subtle translation offset (disabled on mobile screens)
  const yTransform = useTransform(scrollYProgress, [0, 1], [-30 * speed, 30 * speed]);
  const y = isMobile ? 0 : yTransform;

  return (
    <motion.div ref={ref} style={{ ...style, y }} className={className}>
      {children}
    </motion.div>
  );
}
