import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="scroll-progress">
      <motion.div 
        className="scroll-progress-bar"
        style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
      />
    </div>
  );
}

export default ScrollProgress;