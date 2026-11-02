import { useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { AnimatePresence } from "motion/react";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import FaviconSync from "./FaviconSync";
import CommandPalette from "./CommandPalette";

export default function Layout() {
  const [palette, setPalette] = useState(false);
  const { pathname } = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent-lime focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-on-accent"
      >
        Skip to content
      </a>
      <FaviconSync />
      <Header onOpenPalette={() => setPalette(true)} />
      <main id="main" className="min-h-[70dvh]">
        {/* Old page fades out, then the new one rises in (and sets the scroll position). */}
        <AnimatePresence mode="wait">
          <PageTransition key={pathname}>{outlet}</PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  );
}
