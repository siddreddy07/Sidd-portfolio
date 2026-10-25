import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { scrollToSection } from "../../lib/scroll";
import { SITE } from "../../config/site";
import { projects } from "../../data";
import { useTheme } from "../../lib/theme";
import { cn } from "../../lib/utils";

interface Cmd {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const commands = useMemo<Cmd[]>(() => {
    const go = (to: string) => () => navigate(to);
    const ext = (url: string) => () => window.open(url, "_blank", "noopener");
    return [
      { id: "work", group: "Go to", label: "Selected work", run: () => scrollToSection("work", navigate, pathname) },
      { id: "activity", group: "Go to", label: "GitHub activity", run: () => scrollToSection("activity", navigate, pathname) },
      { id: "experience", group: "Go to", label: "Experience", run: () => scrollToSection("experience", navigate, pathname) },
      { id: "contact", group: "Go to", label: "Contact", run: () => scrollToSection("contact", navigate, pathname) },
      { id: "all", group: "Projects", label: "All projects", run: go("/projects") },
      ...projects.map((p) => ({ id: p.slug, group: "Projects", label: p.name, hint: `${p.type} · ${p.year}`, run: go(`/projects/${p.slug}`) })),
      { id: "email", group: "Links", label: "Send an email", hint: SITE.email, run: () => (window.location.href = `mailto:${SITE.email}`) },
      { id: "resume", group: "Links", label: "Resume", run: ext(SITE.resume) },
      { id: "github", group: "Links", label: "GitHub", run: ext(SITE.github) },
      { id: "linkedin", group: "Links", label: "LinkedIn", run: ext(SITE.linkedin) },
      { id: "x", group: "Links", label: "X", run: ext(SITE.x) },
      { id: "theme", group: "Preferences", label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme", run: toggle },
    ];
  }, [navigate, pathname, theme, toggle]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ""}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      input.current?.focus();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const run = (c?: Cmd) => {
    if (!c) return;
    onClose();
    c.run();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[15vh]" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="relative w-full max-w-xl border border-border-studio bg-surface-studio shadow-2xl">
        <input
          ref={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages, projects, links…"
          aria-label="Search commands"
          aria-controls="palette-list"
          className="w-full border-b border-border-studio bg-transparent px-4 py-3.5 font-mono text-sm outline-none placeholder:text-text-secondary"
        />
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && <li className="px-4 py-6 text-center font-mono text-xs text-text-secondary">No matches</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header && <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary">{c.group}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(c)}
                  ref={(el) => {
                    if (el && i === active) el.scrollIntoView({ block: "nearest" });
                  }}
                  className={cn("flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-sm", i === active && "bg-accent-lime text-on-accent")}
                >
                  <span>{c.label}</span>
                  {c.hint && <span className={cn("truncate font-mono text-xs", i === active ? "opacity-80" : "text-text-secondary")}>{c.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-border-studio px-4 py-2 font-mono text-[10px] text-text-secondary">↑↓ navigate · Enter select · Esc close</p>
      </div>
    </div>
  );
}
