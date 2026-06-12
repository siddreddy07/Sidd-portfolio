/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import Lenis from "lenis";
import CustomCursor from "./components/CustomCursor";
import Onboarding from "./components/Onboarding";
import DiscoBall from "./components/DiscoBall";
import HeroSection from "./components/HeroSection";
import MarqueeStrip from "./components/MarqueeStrip";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import ContactSection from "./components/ContactSection";
import ProjectsPage from "./components/ProjectsPage";

export default function App() {
  const [showNav, setShowNav] = useState(false);
  const isScrollingToSection = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Prevent browser scroll restoration from interfering with transitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Client-side state based routing
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname || "/";
    }
    return "/";
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"WORK" | "ABOUT" | "EXPERIENCE" | "CONTACT" | null>(null);

  // Curtain control state for dynamic page transitions
  const [curtainPhase, setCurtainPhase] = useState<"idle" | "covering" | "revealing">("idle");

  // Custom viewport height updater
  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    updateVh();
    window.addEventListener("resize", updateVh, { passive: true });
    return () => window.removeEventListener("resize", updateVh);
  }, []);

  // Set up popstate routing listener
  useEffect(() => {
    const handlePopState = () => {
      const activePath = window.location.pathname || "/";
      // Trigger a beautiful curtain transition immediately on popstate navigation
      triggerPageTransition(activePath, undefined, true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Triggering the curtain wipe
  const triggerPageTransition = (targetPath: string, onComplete?: () => void, isPopState = false) => {
    const hashIndex = targetPath.indexOf('#');
    const pathOnly = hashIndex !== -1 ? targetPath.substring(0, hashIndex) : targetPath;
    const hash = hashIndex !== -1 ? targetPath.substring(hashIndex + 1) : "";

    // If we're already on the path, just skip and scroll
    if (pathOnly === window.location.pathname && !isPopState) {
      if (hash) {
        scrollToSection(hash);
      } else if (pathOnly === "/") {
        scrollToSection("hero-studio-section");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Stop Lenis before transition to prevent scroll interference
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // Phase 1: Slide UP the curtain (covering) from bottom (translateY: 100% -> 0)
    setCurtainPhase("covering");

    // After 0.5s curtain covers the interface completely
    setTimeout(() => {
      // Phase 2: Swap the view state
      setCurrentPath(pathOnly);
      if (!isPopState) {
        window.history.pushState({}, "", targetPath);
        window.scrollTo(0, 0);
      }

      // Scroll to the hash section!
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash);
        }, 150);
      }

      // Perform optional section scrolling/callbacks
      if (onComplete) {
        onComplete();
      }

      // Phase 3: Slide the curtain DOWN off-screen (revealing) from (translateY: 0 -> -100%)
      setCurtainPhase("revealing");

      // Reset to idle once animation concludes
      setTimeout(() => {
        setCurtainPhase("idle");
      }, 600);

    }, 500);
  };

  // Show nav pill after initial load on any page
  useEffect(() => {
    const navTimeout = setTimeout(() => {
      setShowNav(true);
    }, 800);
    return () => clearTimeout(navTimeout);
  }, []);

  // Lenis Smooth Scroll Configuration (home page only)
  useEffect(() => {
    if (currentPath !== "/") return;

    const lenisInstance = new Lenis({
      duration: 1.4,
      lerp: 0.08,
      infinite: false,
      syncTouch: true
    });
    lenisRef.current = lenisInstance;

    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(rafId);
    };
  }, [currentPath]);

  // Scroll Intersection active detector (Only run on Home Page "/")
  useEffect(() => {
    if (currentPath !== "/") return;

    const navTargets = [
      { id: "hero-studio-section", tab: null },
      { id: "projects-section", tab: "WORK" as const },
      { id: "about-section", tab: "ABOUT" as const },
      { id: "experience-section", tab: "EXPERIENCE" as const },
      { id: "contact-section", tab: "CONTACT" as const }
    ];

    const handleScroll = () => {
      if (isScrollingToSection.current) return;
      if (window.scrollY < 200) {
        setActiveTab(null);
        return;
      }

      const viewportMiddle = window.innerHeight / 2;
      let bestTab: "WORK" | "ABOUT" | "EXPERIENCE" | "CONTACT" | null = null;
      let bestScore = -Infinity;

      for (const target of navTargets) {
        const el = document.getElementById(target.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const sectionMiddle = (rect.top + rect.bottom) / 2;
        const score = -Math.abs(sectionMiddle - viewportMiddle);
        if (score > bestScore) {
          bestScore = score;
          bestTab = target.tab;
        }
      }

      setActiveTab(bestTab);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially to set the active tab based on load scroll depth
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPath]);

  // Handle high-level menu clicks inside floating pill
  const handleNavClick = (tab: "WORK" | "ABOUT" | "EXPERIENCE" | "CONTACT") => {
    isScrollingToSection.current = true;
    setActiveTab(tab);
    if (currentPath === "/") {
      if (tab === "WORK") scrollToSection("projects-section");
      if (tab === "ABOUT") scrollToSection("about-section");
      if (tab === "EXPERIENCE") scrollToSection("experience-section");
      if (tab === "CONTACT") scrollToSection("contact-section");
      setTimeout(() => { isScrollingToSection.current = false; }, 800);
    } else {
      // Dynamic page transition back into homepage "/"
      triggerPageTransition("/", () => {
        setActiveTab(tab);
        setTimeout(() => {
          if (tab === "WORK") scrollToSection("projects-section");
          if (tab === "ABOUT") scrollToSection("about-section");
          if (tab === "EXPERIENCE") scrollToSection("experience-section");
          if (tab === "CONTACT") scrollToSection("contact-section");
        }, 120);
      });
      setTimeout(() => { isScrollingToSection.current = false; }, 1200);
    }
  };

  // Dynamic buttery scroll anchor links
  const scrollToSection = (id: string) => {
    let el = document.getElementById(id);
    if (!el && id.endsWith("-section")) {
      el = document.getElementById(id.replace("-section", ""));
    } else if (!el) {
      el = document.getElementById(`${id}-section`);
    }
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return true;
    }
    return false;
  };

  // Segment current dynamic slugs
  const isProjectsRoute = currentPath.startsWith("/projects");
  const projectsSlug = isProjectsRoute ? currentPath.substring("/projects/".length) || null : null;

  return (
    <div className="relative min-h-screen bg-bg-studio selection:bg-accent-lime selection:text-bg-studio">
      
      {/* 0. ONBOARDING MOOD SELECTOR — appears on first visit / weekly */}
      <Onboarding />

      {/* 1. CURTAIN WIPE OVERLAY SYSTEM
          Phase covering (transition down/up to center): translateY(100% -> 0%) over 0.5s
          Phase revealing (transition from center to top): translateY(0% -> -100%) over 0.6s
      */}
      <motion.div
        initial={false}
        animate={{
          y: curtainPhase === "covering" ? "0%" : curtainPhase === "revealing" ? "-100%" : "100%"
        }}
        transition={{
          duration: curtainPhase === "covering" ? 0.5 : 0.6,
          ease: curtainPhase === "covering" ? [0.7, 0, 0.3, 1] : [0.7, 0, 0.3, 1]
        }}
        style={{
          display: curtainPhase === "idle" ? "none" : "block"
        }}
        className="fixed inset-0 bg-[#080808] z-50 pointer-events-none"
      />

      {/* 2. Global Custom Kinetic Cursor */}
      <CustomCursor />

      {/* 3. Floating Minimal Navigation Pill */}
      {showNav && (
        <motion.nav 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-11 md:right-8 md:left-auto md:translate-x-0 z-45 bg-white/[0.04] backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[100px] px-3 md:px-5 py-2.5 flex items-center gap-1.5 md:gap-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-satoshi text-[10px] md:text-[13.5px] tracking-[0.08em] uppercase select-none pointer-events-auto"
        >
          <DiscoBall />
          <button 
            onClick={() => handleNavClick("WORK")}
            data-cursor="true"
            data-cursor-label="GO"
            className={`hover:text-text-primary tracking-[0.08em] transition-colors uppercase font-medium ${activeTab === "WORK" ? "text-accent-lime" : "text-text-secondary"}`}
          >
            Work·
          </button>
          <button 
            onClick={() => handleNavClick("ABOUT")}
            data-cursor="true"
            data-cursor-label="GO"
            className={`hover:text-text-primary tracking-[0.08em] transition-colors uppercase font-medium ${activeTab === "ABOUT" ? "text-accent-lime" : "text-text-secondary"}`}
          >
            About·
          </button>
          <button 
            onClick={() => handleNavClick("EXPERIENCE")}
            data-cursor="true"
            data-cursor-label="GO"
            className={`hover:text-text-primary tracking-[0.08em] transition-colors uppercase font-medium ${activeTab === "EXPERIENCE" ? "text-accent-lime" : "text-text-secondary"}`}
          >
            Experience·
          </button>
          <button 
            onClick={() => handleNavClick("CONTACT")}
            data-cursor="true"
            data-cursor-label="GO"
            className={`hover:text-text-primary tracking-[0.08em] transition-colors uppercase font-medium ${activeTab === "CONTACT" ? "text-accent-lime" : "text-text-secondary"}`}
          >
            Contact
          </button>
          <div className="w-[1.5px] h-3.5 bg-white/15 self-center" />
          <a 
            href="https://drive.google.com/file/d/14DLmQ6Ae6c3exodWqsWr-orEsfRbGid9/view?usp=drivesdk"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="true"
            data-cursor-label="VIEW"
            className="text-[#f0ece4] hover:text-accent-lime tracking-[0.08em] transition-colors uppercase font-medium flex items-center gap-1.5 cursor-none"
          >
            <span>Resume</span>
            <span className="text-accent-lime font-mono text-xs leading-none">↗</span>
          </a>
        </motion.nav>
      )}

      {/* 3.5. Left-side Floating projects pill visible only during the WORK tab */}
      {showNav && currentPath === "/" && (
        <motion.button
          initial={{ opacity: 0, x: -25, scale: 0.95 }}
          animate={{
            opacity: activeTab === "WORK" ? 1 : 0,
            x: activeTab === "WORK" ? 0 : -25,
            scale: activeTab === "WORK" ? 1 : 0.95,
          }}
          style={{
            pointerEvents: activeTab === "WORK" ? "auto" : "none"
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => triggerPageTransition("/projects")}
          data-cursor="true"
          data-cursor-label="VIEW"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-auto md:top-8 md:left-8 md:translate-x-0 z-45 bg-white/[0.04] backdrop-blur-xl md:backdrop-blur-2xl border border-white/10 rounded-[100px] px-4 py-1.5 flex items-center gap-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] font-satoshi text-[10.5px] tracking-[0.08em] uppercase select-none text-text-primary hover:text-accent-lime transition-colors cursor-none"
        >
          <span>All Projects</span>
          <span className="text-accent-lime font-normal text-xs font-mono">↗</span>
        </motion.button>
      )}

      {/* 4. Film grain noise texture overlay for raw editorial look */}
      <svg id="organic-noise-layer" className="fixed inset-0 w-full h-full opacity-[0.035] pointer-events-none z-40 select-none mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* DYNAMIC VIEWS AND ROUTING PANEL */}
      {isProjectsRoute ? (
        <ProjectsPage 
          currentSlug={projectsSlug}
          onNavigate={(target) => triggerPageTransition(target)}
          onTransitionTrigger={(target) => triggerPageTransition(target)}
        />
      ) : (
        /* HOMEPAGE ROOT STACK */
        <div>
          {/* Hero Statement Section */}
          <HeroSection />

          {/* Dynamic kinetic status banner */}
          <MarqueeStrip />

          {/* Selected Work Section */}
          <ProjectsSection onNavigateProject={(target) => triggerPageTransition(target)} />

          {/* Practical Grid Lines */}
          <div className="relative">
            <div className="absolute left-6 md:left-12 lg:left-16 top-0 w-[1px] h-full bg-border-studio/40 pointer-events-none" />
            <div className="absolute right-6 md:right-12 lg:right-16 top-0 w-[1px] h-full bg-border-studio/40 pointer-events-none" />
            
            {/* About Statement Section */}
            <AboutSection />

            {/* Experience Timeline Section */}
            <ExperienceSection />

            {/* Unified Contact & Footer Closing Section */}
            <ContactSection />
          </div>
        </div>
      )}

    </div>
  );
}
