import { useEffect, useState } from "react";
import { Link, useLocation, useMatch } from "react-router";
import { NAV_LINKS, SITE } from "../../config/site";
import { cn } from "../../lib/utils";
import { getProject } from "../../data";
import { FiSearch } from "react-icons/fi";
import SectionLink from "../ui/SectionLink";
import ThemeToggle from "../ui/ThemeToggle";
import ProjectHeader from "./ProjectHeader";
import { MdClose, MdMenu } from "react-icons/md";

const linkClass = "relative whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-colors hover:text-text-primary";

// Which home section is on screen: the last one whose top has passed 35% of the viewport.
// Null off the home page and above the first section.
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return setActive(null);
    const ids = NAV_LINKS.map((l) => l.to.slice(2));
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(atBottom ? ids[ids.length - 1] : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return active;
}

export default function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const active = useActiveSection(pathname === "/");
  const match = useMatch("/projects/:slug");
  const project = match?.params.slug ? getProject(match.params.slug) : undefined;

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (project) return <ProjectHeader project={project} onOpenPalette={onOpenPalette} />;

  const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

  return (
    <header className="sticky top-3 z-50 mx-3 rounded-2xl border border-text-primary/10 bg-bg-studio/25 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl backdrop-saturate-200 md:mx-auto md:max-w-5xl">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="whitespace-nowrap font-display text-xl leading-none text-text-primary">
          {SITE.shortName}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => {
            const on = active === l.to.slice(2);
            return (
              <SectionLink key={l.to} id={l.to.slice(2)} className={cn(linkClass, on ? "text-text-primary" : "text-text-secondary")} aria-current={on ? "location" : undefined}>
                {l.label}
              </SectionLink>
            );
          })}
          <a href={SITE.resume} target="_blank" rel="noreferrer" className={cn(linkClass, "text-text-primary")}>
            Resume ↗
          </a>
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="flex items-center gap-2 border border-border-studio px-2.5 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
          >
            Search <kbd className="opacity-70">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={onOpenPalette} aria-label="Search" className="grid size-9 place-items-center rounded-full border border-border-studio text-text-primary transition-colors hover:border-text-secondary">
            <FiSearch size={16} aria-hidden />
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="font-mono text-xs uppercase tracking-widest text-text-primary"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-text-primary/10 px-4 pb-5 pt-1 lg:hidden">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.to} className="border-b border-border-studio">
                <SectionLink id={l.to.slice(2)} onNavigate={() => setOpen(false)} className="block py-4 font-display text-2xl text-text-primary">
                  {l.label}
                </SectionLink>
              </li>
            ))}
            <li className="border-b border-border-studio">
              <a href={SITE.resume} target="_blank" rel="noreferrer" className="block py-4 font-display text-2xl text-text-primary">
                Resume ↗
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
