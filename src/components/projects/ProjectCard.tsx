import { useState } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "motion/react";
import type { Project } from "../../types";
import { posterFor, videoFor } from "../../lib/media";
import { cn } from "../../lib/utils";

// Flat backdrop tints (no gradients). Mixed into the surface colour so they sit right in both themes.
const TINTS = ["#6f9bd1", "#d1a06f", "#6fc1c1", "#b08fd1", "#d18f8f", "#8f9fd1", "#cfc46f"];

const chip = "rounded-md border border-border-studio px-2 py-0.5 font-mono text-xs text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary";
const linkClass = "group/link inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary";
const arrow = "transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5";

function statusOf(p: Project): string {
  if (p.slug === "bsdk") return "Featured";
  if (p.links.some((l) => /live/i.test(l.label))) return "Live";
  return "Open source";
}

export default function ProjectCard({ project: p }: { project: Project }) {
  const [hovering, setHovering] = useState(false);
  const reduce = useReducedMotion();
  const poster = posterFor(p);
  const video = reduce ? null : videoFor(p);
  const external = p.links.filter((l) => /live|github|npm/i.test(l.label));
  const tint = TINTS[(parseInt(p.num, 10) - 1) % TINTS.length] ?? TINTS[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border-studio bg-surface-studio transition-all duration-300 hover:-translate-y-1 hover:border-text-secondary hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.5)]">
      <Link
        to={`/projects/${p.slug}`}
        className="block"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        aria-label={`${p.name}: ${p.slug === "bsdk" ? "read case study" : "view project"}`}
      >
        {/* Backdrop with the screenshot floating in it, cropped at the bottom edge */}
        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/10]" style={{ background: `color-mix(in srgb, ${tint} 30%, var(--surface))` }}>
          <div className="absolute inset-x-[9%] bottom-0 top-[11%] overflow-hidden rounded-t-xl border border-b-0 border-border-studio bg-bg-studio shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.025]">
            {poster ? (
              <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="font-mono text-xs text-text-secondary">{p.num}</span>
                <span className="font-display text-4xl leading-none sm:text-5xl">{p.name}</span>
              </div>
            )}
            {hovering && video && (
              <video src={video} poster={poster ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover object-top" />
            )}
          </div>
        </div>

        <div className="px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <h3 className="truncate text-xl font-semibold tracking-tight">{p.name}</h3>
              <span className="shrink-0 rounded-full bg-bg-studio px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">{statusOf(p)}</span>
            </div>
            <span className="shrink-0 font-mono text-xs text-text-secondary">{p.year}</span>
          </div>
          <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-text-secondary sm:line-clamp-3">{p.desc}</p>
        </div>
      </Link>

      <ul className="flex flex-wrap gap-1.5 px-5 pt-4">
        {p.tags.slice(0, 5).map((t, i) => (
          <li key={t} className={cn(i >= 3 && "hidden sm:block")}>
            <span className={chip}>{t}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 px-5 pb-5 pt-5">
        <li>
          <Link to={`/projects/${p.slug}`} className={cn(linkClass, "text-text-primary")}>
            {p.slug === "bsdk" ? "Case study" : "View project"}
            <span aria-hidden className={arrow}>↗</span>
          </Link>
        </li>
        {external.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer" className={linkClass}>
              {l.label}
              <span aria-hidden className={arrow}>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
