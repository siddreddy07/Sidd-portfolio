import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface RevealLineProps {
  children: ReactNode;
  delay?: number;
}

export default function RevealLine({ children, delay = 0 }: RevealLineProps) {
  return (
    <div className="relative overflow-hidden block py-0.5" id="reveal-line-wrapper">
      <motion.div
        initial={{ y: '100%', clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
        whileInView={{ y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1], // Custom power4/expo out curve
          delay,
        }}
        className="origin-top"
        id="reveal-line-content"
      >
        {children}
      </motion.div>
    </div>
  );
}
