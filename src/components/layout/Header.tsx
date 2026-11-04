import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useMatch } from "react-router";
import { NAV_LINKS, SITE } from "../../config/site";
import { cn } from "../../lib/utils";
import { getProject } from "../../data";
import { FiSearch } from "react-icons/fi";
import SectionLink from "../ui/SectionLink";
import ThemeToggle from "../ui/ThemeToggle";
import { AnimatedShinyText } from "../ui/AnimatedShinyText";
import ProjectHeader from "./ProjectHeader";
import { MdClose, MdMenu } from "react-icons/md";

// Mostly solid bar with a light blur: reads as a surface, not a glass effect, and keeps the page from showing
// through while the theme reveal snapshots it on mobile.
const glass = "rounded-2xl border border-border-studio bg-bg-studio/95 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md";
// Fast settle with no overshoot; used for the menu panel and icon swap.
const EASE = [0.22, 1, 0.36, 1] as const;
// The menu unrolls downward from under the bar and rolls back up. Clip-path keeps text undistorted (unlike scaleY)
// and needs no layout work per frame (unlike animating height).
const SHUT = "inset(0% 0% 100% 0% round 16px)";
const OPEN = "inset(0% 0% 0% 0% round 16px)";

export default function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();
  const match = useMatch("/projects/:slug");
  const project = match?.params.slug ? getProject(match.params.slug) : undefined;

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // Tap anywhere outside the bar or the panel closes the menu.
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (project) return <ProjectHeader project={project} onOpenPalette={onOpenPalette} />;

  const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

  return (
    // The sticky wrapper carries no backdrop-filter, so the menu panel (a sibling of the bar, positioned below it)
    // overlays the page instead of pushing it down, and can blur what's behind it.
    <header ref={ref} data-site-header className="sticky top-3 z-50 mx-auto max-w-3xl px-5 md:px-8">
      <div className={cn(glass, "flex h-14 items-center justify-between px-4 md:px-6")}>
        <Link to="/" className="whitespace-nowrap font-display text-xl leading-none text-text-primary">
          {SITE.shortName}
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.resume}
            target="_blank"
            rel="noreferrer"
            className="group rounded-full border border-border-studio px-3.5 py-1.5 font-mono text-xs transition-all hover:-translate-y-0.5 hover:border-text-secondary"
          >
            <AnimatedShinyText className="inline-flex items-center gap-1">
              Resume <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </AnimatedShinyText>
          </a>
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search"
            title={`Search (${isMac ? "⌘" : "Ctrl"} K)`}
            className="grid size-9 place-items-center rounded-full border border-border-studio text-text-primary transition-colors hover:border-text-secondary"
          >
            <FiSearch size={16} aria-hidden />
          </button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={onOpenPalette} aria-label="Search" className="grid size-9 place-items-center rounded-full border border-border-studio text-text-primary transition-colors hover:border-text-secondary">
            <FiSearch size={16} aria-hidden />
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="relative grid size-9 place-items-center text-text-primary"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={open ? "close" : "menu"}
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0, rotate: open ? -90 : 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: open ? 90 : -90 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                {open ? <MdClose size={20} /> : <MdMenu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            className={cn(glass, "absolute inset-x-5 top-full mt-2 overflow-hidden md:inset-x-8 bg-bg-studio/95 px-4 pb-3 pt-1 lg:hidden")}
            initial={{ clipPath: SHUT }}
            animate={{ clipPath: OPEN }}
            exit={{ clipPath: SHUT, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            <motion.ul
              initial={{ y: -16 }}
              animate={{ y: 0 }}
              exit={{ y: -16, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              {NAV_LINKS.map((l) => (
                <li key={l.to} className="border-b border-border-studio">
                  <SectionLink id={l.to.slice(2)} onNavigate={() => setOpen(false)} className="block py-4 font-display text-2xl text-text-primary">
                    {l.label}
                  </SectionLink>
                </li>
              ))}
              <li>
                <a href={SITE.resume} target="_blank" rel="noreferrer" className="block py-4 font-display text-2xl">
                  <AnimatedShinyText shimmerWidth={160}>Resume ↗</AnimatedShinyText>
                </a>
              </li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
