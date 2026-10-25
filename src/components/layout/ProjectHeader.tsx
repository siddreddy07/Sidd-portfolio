import { FiHome } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router";
import type { Project } from "../../types";
import { actionLinks } from "../../lib/projectLinks";
import ThemeToggle from "../ui/ThemeToggle";

/** Navbar used on /projects/:slug: Back · / · Project name on the left, Live + GitHub icons on the right. */
export default function ProjectHeader({ project, onOpenPalette }: { project: Project; onOpenPalette: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = actionLinks(project);

  // Go back in history when we came from inside the site, otherwise to the archive.
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/projects"));

  return (
    <header className="sticky top-3 z-50 mx-3 rounded-2xl border border-text-primary/10 bg-bg-studio/25 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl backdrop-saturate-200 md:mx-auto md:max-w-5xl">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={goBack}
          className="group flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary"
          aria-label="Go back"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back
        </button>

        <span aria-hidden className="text-border-studio">/</span>
        <Link to={`/projects/${project.slug}`} className="min-w-0 flex-1 truncate font-display text-xl leading-none md:flex-none">
          {project.name}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name}: ${l.label}`}
                title={l.label}
                className={
                  l.kind === "live"
                    ? "flex items-center gap-2 rounded-md bg-accent-lime px-3 py-1.5 font-mono text-xs text-on-accent transition-transform hover:-translate-y-0.5"
                    : "grid size-9 place-items-center rounded-md border border-border-studio transition-colors hover:border-text-secondary"
                }
              >
                <l.Icon size={l.kind === "live" ? 14 : 16} aria-hidden />
                {l.kind === "live" && "Live"}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              className="ml-1 border border-border-studio px-2.5 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
            >
              Search
            </button>
          </div>
          <ThemeToggle />
          <Link
            to="/"
            aria-label="Home"
            title="Home"
            className="grid size-9 place-items-center rounded-md border border-border-studio text-text-primary transition-colors hover:border-text-secondary"
          >
            <FiHome size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
