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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-studio bg-bg-studio/90 px-4 pt-3 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="flex gap-2">
        {links.map((l) => (
          <li key={l.url} className={cn(l.kind === "live" || l.kind === "github" ? "flex-1" : "")}>
            <a
              href={l.url}
              target="_blank"
              rel="noreferrer"
              aria-label={l.label}
              className={cn(
                "flex h-12 items-center justify-center gap-2 rounded-md font-mono text-sm transition-transform active:scale-[0.98]",
                l.kind === "live" ? "bg-accent-lime text-on-accent" : "border border-border-studio bg-surface-studio",
                l.kind !== "live" && l.kind !== "github" && "w-12",
              )}
            >
              <l.Icon size={16} aria-hidden />
              {(l.kind === "live" || l.kind === "github") && (l.kind === "live" ? "Live site" : "GitHub")}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
