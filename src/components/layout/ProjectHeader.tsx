import { FiHome, FiSearch } from "react-icons/fi";
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
    <header className="sticky top-3 z-50 mx-auto max-w-3xl px-5 md:px-8">
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-border-studio bg-bg-studio/95 px-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md md:px-6">
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
                    ? "live-glossy flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-xs hover:-translate-y-0.5"
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
              aria-label="Search"
              title="Search"
              className="ml-1 grid size-9 place-items-center rounded-full border border-border-studio text-text-primary transition-colors hover:border-text-secondary"
            >
              <FiSearch size={16} aria-hidden />
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
