import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Cpu } from 'lucide-react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [istTime, setIstTime] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    // Live India Standard Time clock (IST)
    const updateTime = () => {
      try {
        const timeString = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setIstTime(`${timeString} IST`);
      } catch (e) {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        setIstTime(`${hrs}:${mins} UTC`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Intersection Observer Scroll Spy
  useEffect(() => {
    const sectionIds = ['selected-work', 'manifest', 'work-log', 'connect'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    elements.forEach((el) => observer.observe(el));

    // Reset when at the top
    const handleScrollTop = () => {
      if (window.scrollY < 120) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScrollTop);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleScrollTop);
    };
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isProjectsArchive = window.location.pathname === '/projects' || window.location.hash === '#/projects';
    if (isProjectsArchive) {
      e.preventDefault();
      window.history.pushState(null, '', `/${href}`);
      window.dispatchEvent(new Event('popstate'));
      
      setTimeout(() => {
        const el = document.getElementById(href.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isProjectsArchive = window.location.pathname === '/projects' || window.location.hash === '#/projects';
    if (isProjectsArchive) {
      e.preventDefault();
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new Event('popstate'));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const navLinks = [
    { label: 'Work', href: '#selected-work' },
    { label: 'Stack', href: '#manifest' },
    { label: 'Experience', href: '#work-log' },
    { label: 'Contact', href: '#connect' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 select-none ${
          scrolled 
            ? 'py-3 px-4 md:px-8' 
            : 'py-5 px-6 md:px-12'
        }`}
        id="site-header"
      >
        <div
          className={`max-w-7xl mx-auto rounded-full border transition-all duration-300 flex items-center justify-between px-6 h-[54px] ${
            scrolled
              ? 'bg-[#040404]/80 backdrop-blur-md border-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
              : 'bg-[#040404]/40 backdrop-blur-sm border-[#121212] shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
          }`}
          id="nav-inner-container"
        >
          {/* Logo / Brand Signature */}
          <div className="flex items-center" id="brand-cluster">
            <a
              href="#"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group"
              data-cursor="pointer"
              id="nav-logo"
            >
              <div className="relative w-6 h-6 rounded-full bg-signal/10 border border-signal/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-signal">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              </div>
              <span className="font-display font-black text-[13px] tracking-[0.1em] text-text-primary group-hover:text-signal transition-colors duration-200">
                siddharth_dev/
              </span>
            </a>
          </div>

          {/* Clean Minimalist Navigation Links Row */}
          <nav className="hidden lg:flex items-center gap-8" id="nav-tabs">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="font-mono text-[11px] tracking-widest uppercase transition-all duration-300 relative py-1 px-0.5 group"
                  id={`nav-link-${link.label.toLowerCase()}`}
                >
                  <span className={`transition-colors duration-200 ${isActive ? 'text-signal font-semibold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                    {link.label}
                  </span>
                  
                  {/* Subtle Elegant Slash Dot Underline for Active state */}
                  {isActive ? (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-signal shadow-[0_0_8px_#00FF55]"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1a1a1a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Mobile responsive toggle */}
          <div className="lg:hidden flex items-center" id="mobile-trigger-container">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary transition-colors p-2 bg-[#090909] border border-[#151515] rounded-full"
              aria-label="Toggle menu"
              id="hamburger-btn"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Canvas */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[99] bg-[#030303]/98 backdrop-blur-xl border-b border-[#141414] py-20 md:py-28 px-8 lg:hidden flex flex-col justify-between"
            id="mobile-fullscreen-menu"
          >
            <div className="flex flex-col gap-6" id="mobile-routing-list">
              <span className="font-mono text-[9px] text-[#333] tracking-[0.3em] uppercase">NAVIGATION</span>
              <div className="flex flex-col gap-5" id="mobile-links-stack">
                {navLinks.map((link, idx) => {
                  const isActive = activeSection === link.href;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleNavLinkClick(e, link.href);
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`font-display text-[26px] font-black tracking-tight leading-none ${
                        isActive ? 'text-signal' : 'text-text-primary hover:text-signal'
                      }`}
                      id={`mobile-link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Bottom info row without telemetry text */}
            <div className="border-t border-[#121212] pt-6 flex justify-end items-center text-[10px] font-mono text-text-dim mt-12" id="mobile-menu-footer">
              <span>N Siddharth Reddy</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
