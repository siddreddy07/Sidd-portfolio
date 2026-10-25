import { useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { getProject, projects } from "../data";
import { getIcon } from "../data/iconMap";
import { posterFor, videoFor } from "../lib/media";
import { actionLinks } from "../lib/projectLinks";
import Container from "../components/ui/Container";
import Reveal from "../components/ui/Reveal";
import ProgressiveBlur from "../components/ui/ProgressiveBlur";
import ProjectActionBar from "../components/projects/ProjectActionBar";
import NotFound from "./NotFound";

const COLLAPSED = 168; // px of overview shown before "Read more"

function hostOf(url?: string) {
  try {
    return url ? new URL(url).host : "";
  } catch {
    return "";
  }
}

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"preview" | "live">("preview");
  const body = useRef<HTMLDivElement>(null);

  if (!project) return <NotFound />;

  const links = actionLinks(project);
  const live = links.find((l) => l.kind === "live");
  const poster = posterFor(project);
  const video = reduce ? null : videoFor(project);
  const long = project.overview.length > 380;
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const prev = projects[(index - 1 + projects.length) % projects.length];

  return (
    <article className="pb-20 md:pb-0">
      {/* Hero */}
      <header className="pb-8 pt-10 md:pt-14">
        <Container>
          <Reveal>
            <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs uppercase tracking-widest text-text-secondary">
              <Link to="/projects" className="hover:text-text-primary">Projects</Link>
              <span aria-hidden>/</span>
              <span className="text-accent-text">{project.num}</span>
              <span aria-hidden>·</span>
              {project.type}
              <span aria-hidden>·</span>
              {project.year}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">{project.name}</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-text-secondary">{project.descriptor}</p>
          </Reveal>
        </Container>
      </header>

      {/* Media in a browser frame */}
      <Container>
        <Reveal>
          <figure className="overflow-hidden border border-border-studio bg-surface-studio ">
            <div className="flex items-center gap-3 border-b border-border-studio px-4 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-border-studio" />
                <span className="size-2.5 rounded-full bg-border-studio" />
                <span className="size-2.5 rounded-full bg-border-studio" />
              </span>
              <span className="min-w-0 flex-1 truncate border border-border-studio bg-bg-studio px-3 py-1 text-center font-mono text-[11px] text-text-secondary">
                {hostOf(live?.url) || project.name}
              </span>
              {live && (
                <div role="group" aria-label="Preview type" className="flex shrink-0 overflow-hidden rounded-full border border-border-studio font-mono text-[11px]">
                  {(["preview", "live"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                      className={`px-3 py-1 rounded-md transition-colors ${mode === m ? "bg-accent-lime text-on-accent" : "text-text-secondary hover:text-text-primary"}`}
                    >
                      {m === "preview" ? (video ? "Video" : "Preview") : "Live site"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative aspect-[16/9] bg-bg-studio">
              {live && mode === "live" ? (
                <iframe
                  src={live.url}
                  title={`${project.name} live site`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="absolute inset-0 h-full w-full bg-white"
                />
              ) : video ? (
                <video src={video} poster={poster ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover object-top" />
              ) : poster ? (
                <img src={poster} alt={`${project.name} screenshot`} className="absolute inset-0 h-full w-full object-cover object-top" />
              ) : (
                <div className="absolute inset-0 flex items-end p-8">
                  <span className="font-display text-7xl leading-none md:text-9xl">{project.name}</span>
                </div>
              )}
            </div>
            {live && mode === "live" && (
              <p className="border-t border-border-studio px-4 py-2 font-mono text-[11px] text-text-secondary">
                Blank? Some sites don't allow embedding.{" "}
                <a className="underline underline-offset-4 hover:text-text-primary" href={live.url} target="_blank" rel="noreferrer">
                  Open it in a new tab ↗
                </a>
              </p>
            )}
          </figure>
        </Reveal>
      </Container>

      {/* Content */}
      <Container className="mt-16 grid gap-14 md:mt-24 md:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary">Overview</h2>
            <div className="relative mt-6">
              <motion.div
                ref={body}
                initial={false}
                animate={{ height: long && !open ? COLLAPSED : "auto" }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="text-lg leading-[1.75]">{project.overview}</p>
              </motion.div>
              {long && !open && <ProgressiveBlur position="bottom" height="110px" blurAmount={10} />}
            </div>
            {long && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="mt-6 border border-border-studio px-4 py-2.5 font-mono text-xs transition-colors hover:border-accent-text hover:text-accent-text"
              >
                {open ? "Show less ↑" : "Read the full overview ↓"}
              </button>
            )}
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary">Built with</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t, i) => {
                const Icon = getIcon(project.tagIcons[i] ?? "");
                return (
                  <li key={t} className="flex items-center gap-2 border border-border-studio bg-surface-studio px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:border-accent-text">
                    {Icon && <Icon size={15} aria-hidden className="text-text-secondary" />}
                    {t}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary">At a glance</h2>
            <dl className="mt-5 border-t border-border-studio">
              {project.specs.map((s) => (
                <div key={s.label} className="border-b border-border-studio py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-text-secondary">{s.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </aside>
      </Container>

      {/* Previous / next */}
      <nav aria-label="More projects" className="mt-8 border-t border-border-studio py-5 lg:mt-20 lg:py-12">
        <Container className="grid grid-cols-2 gap-2 lg:gap-5">
          {[
            { p: prev, label: "← Previous", align: "text-left" },
            { p: next, label: "Next →", align: "text-right" },
          ].map(({ p, label, align }) => (
            <Link
              key={label}
              to={`/projects/${p.slug}`}
              className={`group min-w-0 rounded-lg border border-border-studio bg-surface-studio px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-text-secondary lg:p-5 ${align}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary lg:text-[11px] lg:tracking-widest">{label}</p>
              <p className="mt-1 truncate font-display text-base leading-tight sm:text-lg lg:mt-2 lg:text-3xl">{p.name}</p>
              <p className="mt-1 hidden truncate font-mono text-[11px] text-text-secondary lg:block">{p.type}</p>
            </Link>
          ))}
        </Container>
      </nav>

      <ProjectActionBar project={project} />
    </article>
  );
}
