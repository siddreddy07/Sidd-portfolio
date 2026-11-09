import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { Project } from "../../types";
import { actionLinks } from "../../lib/projectLinks";
import { posterFor, tintFor, videoFor } from "../../lib/media";
import { cn } from "../../lib/utils";

// One curve for every hover change in this view, so the highlight, the dimming and the preview move together.
const SMOOTH = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
// Floating preview size (px) and its gap from the cursor.
const PREVIEW_W = 352;
const PREVIEW_H = 242;
const GAP = 28;
// Soft follow: trails the cursor slightly and settles without wobble.
const FOLLOW = { stiffness: 260, damping: 32, mass: 0.6 };

/**
 * Compact list of projects: name, one-line description and links. With a mouse on desktop, hovering a row
 * lifts it, dims the rest, and a floating card follows the cursor with that project's video or screenshot. The card
 * is portalled to <body> so no section clips it. Only opacity and transform animate, so it stays on the compositor.
 */
export default function ProjectList({ projects, noVideo = false }: { projects: Project[]; noVideo?: boolean }) {
  // Row under the pointer (null when the pointer leaves the list), and the one the preview shows. The preview
  // keeps the last project instead of blanking between rows.
  const [hovered, setHovered] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  // Pointer is on a row's Live / GitHub buttons: hide the preview there so it never covers them.
  const [onLinks, setOnLinks] = useState(false);
  const showPreview = hovered !== null && !onLinks;
  const reduce = useReducedMotion();
  const x = useSpring(0, FOLLOW);
  const y = useSpring(0, FOLLOW);

  // Card sits to the right of the cursor, vertically centred on it; flips left / clamps near viewport edges.
  const place = (e: React.PointerEvent, jump: boolean) => {
    const right = e.clientX + GAP + PREVIEW_W <= window.innerWidth - 16;
    const nx = right ? e.clientX + GAP : e.clientX - GAP - PREVIEW_W;
    const ny = Math.min(
      Math.max(e.clientY - PREVIEW_H / 2, 16),
      window.innerHeight - PREVIEW_H - 16,
    );
    if (jump || reduce) {
      x.jump(nx);
      y.jump(ny);
    } else {
      x.set(nx);
      y.set(ny);
    }
  };

  const enter = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    // Coming in from outside the list: appear at the cursor instead of flying in from the last spot.
    if (hovered === null) place(e, true);
    setHovered(i);
    setShown(i);
  };

  return (
    <>
      <ol
        className="border-t border-border-studio"
        onPointerMove={(e) => e.pointerType === "mouse" && place(e, false)}
        onPointerLeave={() => setHovered(null)}
      >
        {projects.map((p, i) => {
          const dim = hovered !== null && hovered !== i;
          const on = hovered === i;
          const links = actionLinks(p).filter(
            (l) => l.kind === "live" || l.kind === "github" || l.kind === "npm",
          );
          return (
            <li
              key={p.slug}
              onPointerEnter={enter(i)}
              onFocus={() => setShown(i)}
              className={cn(
                "relative isolate border-b border-border-studio transition-opacity",
                SMOOTH,
                dim && "opacity-35",
              )}
            >
              {/* Highlight wash behind the active row; fades and settles in rather than snapping. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 -inset-x-3 -z-10 rounded-xl bg-text-primary/[0.04] transition-[opacity,transform]",
                  SMOOTH,
                  on ? "scale-100 opacity-100" : "scale-[0.98] opacity-0",
                )}
              />
              <div className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:gap-6 md:py-6">
                {/* Only the text nudges right on hover; the links stay put. */}
                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-6 transition-transform",
                    SMOOTH,
                    on && !reduce && "md:translate-x-2",
                  )}
                >
                  <span className="hidden w-8 shrink-0 font-mono text-xs text-text-secondary md:block">
                    {p.num}
                  </span>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="min-w-0 flex-1 outline-offset-4"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="truncate text-lg font-semibold tracking-tight md:text-xl">
                        {p.name}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-text-secondary">
                        {p.year}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {p.desc}
                    </span>
                  </Link>
                </div>
                <ul
                  className="flex shrink-0 items-center gap-2"
                  onPointerEnter={() => setOnLinks(true)}
                  onPointerLeave={() => setOnLinks(false)}
                >
                  {links.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.name}: ${l.label}`}
                        className={
                          l.kind === "live"
                            ? "inline-flex items-center gap-1.5 rounded-lg bg-accent-lime px-3 py-1.5 font-mono text-xs text-on-accent transition-transform hover:-translate-y-0.5"
                            : "inline-flex items-center gap-1.5 rounded-lg border border-border-studio px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
                        }
                      >
                        <l.Icon size={13} aria-hidden />
                        {l.kind === "live"
                          ? "Live"
                          : l.kind === "github"
                            ? "GitHub"
                            : "npm"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop-only floating preview, visible only while a row is hovered. All stills are stacked and crossfaded;
          only the shown project's video is mounted. It keeps the last project while fading out. */}
      {typeof document !== "undefined" &&
        createPortal(
          <motion.div
            aria-hidden
            style={{ x, y, width: PREVIEW_W, height: PREVIEW_H }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
          >
            <div
              className={cn(
                "relative size-full overflow-hidden rounded-2xl border border-border-studio bg-surface-studio shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] transition-[opacity,transform]",
                SMOOTH,
                !showPreview
                  ? "scale-90 opacity-0"
                  : "scale-100 opacity-100",
              )}
            >
              {projects.map((p, i) => {
                const poster = posterFor(p);
                const video = reduce || noVideo ? null : videoFor(p);
                const visible = shown === i;
                return (
                  <div
                    key={p.slug}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform]",
                      SMOOTH,
                      visible
                        ? "scale-100 opacity-100"
                        : "scale-[1.03] opacity-0",
                    )}
                    style={{
                      background: `color-mix(in srgb, ${tintFor(p)} 30%, var(--surface))`,
                    }}
                  >
                    <div className="absolute inset-x-[8%] bottom-0 top-[10%] overflow-hidden rounded-t-xl border border-b-0 border-border-studio bg-bg-studio shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)]">
                      {poster ? (
                        <img
                          src={poster}
                          alt=""
                          decoding="async"
                          className="absolute inset-0 size-full object-cover object-top"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col justify-between p-5">
                          <span className="font-mono text-xs text-text-secondary">
                            {p.num}
                          </span>
                          <span className="font-display text-4xl leading-none">
                            {p.name}
                          </span>
                        </div>
                      )}
                      {visible && showPreview && video && (
                        <video
                          src={video}
                          poster={poster ?? undefined}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 size-full object-cover object-top"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>,
          document.body,
        )}
    </>
  );
}
