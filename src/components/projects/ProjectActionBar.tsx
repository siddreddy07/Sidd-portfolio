import type { Project } from "../../types";
import { actionLinks } from "../../lib/projectLinks";
import { cn } from "../../lib/utils";

/** Mobile-only bar pinned to the bottom of the screen so Live / GitHub are always one tap away. */
export default function ProjectActionBar({ project }: { project: Project }) {
  const links = actionLinks(project);
  if (links.length === 0) return null;

  return (
    <nav
      aria-label={`${project.name} links`}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border-studio bg-bg-studio/80 p-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150">
        {links.map((l) => {
          const wide = l.kind === "live" || l.kind === "github";
          return (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                aria-label={l.label}
                className={cn(
                  "flex h-9 items-center justify-center gap-1.5 rounded-full font-mono text-xs transition-transform active:scale-[0.96]",
                  wide ? "px-4" : "w-9",
                  l.kind === "live" ? "live-glossy" : "text-text-primary hover:bg-text-primary/10",
                )}
              >
                <l.Icon size={14} aria-hidden />
                {wide && (l.kind === "live" ? "Live" : "GitHub")}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
