import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';


const greetings = [
  'Hello!',
  'नमस्ते!',      // Hindi
  'నమస్కారం!',     // Telugu
  'নমস্কার!',      // Bengali
  'வணக்கம்!',     // Tamil
  'ನಮಸ್ಕಾರ!',     // Kannada
  'ਸਤ ਸ੍ਰੀ ਅਕਾਲ!', // Punjabi
  'નમસ્તે!',       // Gujarati
  'ഹലോ!'         // Malayalam
];

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isProjectPage = location.pathname === '/project/:name';

  const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

 useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % greetings.length);
        setFade(true); // start fade-in
      }, 300); // match this to fade-out duration
    }, 2500); // total delay per greeting

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4 flex justify-between items-center">
         <div
      className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent hover:transition-all cursor-pointer transition-opacity duration-500 ${
        fade ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {greetings[index]}
    </div>
        {isHomePage ? 
          <div className="flex gap-4 md:gap-6">
            <a href="#projects">Projects</a>
            <a href="#work">Work</a>
          </div>
          :

                    <motion.button 
                      className="px-2 py-1  bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-full font-bold hover:bg-[#64ffda] hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href="mailto:hrxsiddharth@gmail.com"}
                    >
                      Get In Touch ↗
                    </motion.button>
        }
        
      </div>
    </nav>
  );
}

export default Navbar;