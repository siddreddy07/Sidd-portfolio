import React from 'react';
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center z-[9999]"
    >
      <div className="relative w-full max-w-[850px] px-4">
        <motion.svg
          viewBox="0 0 800 200"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          initial="hidden"
          animate="visible"
        >
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="none"
            stroke="#64ffda"
            strokeWidth="1"
            fontSize="80"
            fontWeight="bold"
            initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            N SIDDHARTH REDDY
          </motion.text>
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#64ffda"
            fontSize="80"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            N SIDDHARTH REDDY
          </motion.text>
        </motion.svg>
        <motion.div
          className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 text-[#64ffda] text-sm md:text-base tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          LOADING
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;