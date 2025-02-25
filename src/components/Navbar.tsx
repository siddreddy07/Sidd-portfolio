import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isProjectPage = location.pathname === '/project/:name';

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent">
          HELLO!
        </div>
        {isHomePage ? 
          <div className="flex gap-4 md:gap-6">
            <a href="#work">Work</a>
            <a href="#projects">Projects</a>
          </div>
          :

                    <motion.button 
                      className="px-2 py-2 -mt-2 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-full font-bold hover:bg-[#64ffda] hover:text-black transition-all duration-300"
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