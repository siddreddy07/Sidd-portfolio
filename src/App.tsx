import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Import UI modules
import Preloader from './components/ui/Preloader';
import Cursor from './components/ui/Cursor';

// Import Section modules
import Nav from './components/sections/Nav';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Work from './components/sections/Work';
import Stack from './components/sections/Stack';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import ProjectsArchive from './components/sections/ProjectsArchive';

import FloatingResume from './components/ui/FloatingResume';

export default function App() {

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return (path === '/projects' || hash === '#/projects') ? '/projects' : '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/projects' || hash === '#/projects') {
        setCurrentPath('/projects');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-void text-text-primary" id="applet-root">
      {/* 1. Custom Magnet dual cursor pointer */}
      <Cursor />

      {/* 2. OS Initial boot sequence preloader */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* 3. Main Web Application Content Mount */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col min-h-screen"
            id="main-app-content"
          >
            {/* Nav ribbon fixed */}
            <Nav />

            {/* Layout core sections block */}
            <main className="flex-grow flex flex-col" id="sections-content-main">
              {currentPath === '/projects' ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  key="projects-archive-route"
                  id="projects-archive-route-wrapper"
                >
                  <ProjectsArchive />
                </motion.div>
              ) : (
                <div key="root-homepage-route" id="root-homepage-route-wrapper">
                  <Hero />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    id="about-animated-section"
                  >
                    <About />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    id="work-animated-section"
                  >
                    <Work />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    id="stack-animated-section"
                  >
                    <Stack />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    id="experience-animated-section"
                  >
                    <Experience />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    id="contact-animated-section"
                  >
                    <Contact />
                  </motion.div>
                </div>
              )}
            </main>

            {/* Live clock footer */}
            <Footer />

            <FloatingResume />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
