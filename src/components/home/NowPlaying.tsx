import { AnimatePresence, motion } from "motion/react";
import { SiSpotify } from "react-icons/si";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { timeAgo, useAlbumColors, type Track } from "../../lib/spotify";

function Equalizer() {
  return (
    <span className="flex h-2.5 items-end gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="eq-bar w-0.5 rounded-full bg-[#1db954]" style={{ animationDelay: `${i * -0.25}s` }} />
      ))}
    </span>
  );
}

// Compact Spotify card: album art, what's playing (or when it last played), on glass tinted with the cover's colours.
export default function NowPlaying({ track, className = "" }: { track: Track | null; className?: string }) {
  const colors = useAlbumColors(track?.image ?? null);
  const tint = colors ? ({ "--album-a": colors.a, "--album-b": colors.b } as CSSProperties) : undefined;

  return (
    <AnimatePresence mode="wait">
      {track && (
        <motion.a
          key={track.url}
          href={track.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${track.playing ? "Now playing" : "Last played"} on Spotify: ${track.title} by ${track.artist}`}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={tint}
          className={`liquid-glass group relative flex w-full max-w-60 items-center gap-2.5 overflow-hidden rounded-2xl p-1.5 pr-3 hover:-translate-y-0.5 ${className}`}
        >
          <span aria-hidden className="liquid-glass-sheen pointer-events-none absolute inset-0 rounded-[inherit]" />

          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-border-studio shadow-sm">
            {track.image ? (
              <img src={track.image} alt="" crossOrigin="anonymous" width={40} height={40} className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <SiSpotify className="m-auto size-full p-2.5 text-text-secondary" aria-hidden />
            )}
          </div>

          <div className="relative min-w-0 flex-1 text-left">
            <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-text-secondary">
              <SiSpotify size={10} className="shrink-0 text-[#1db954]" aria-hidden />
              {track.playing ? (
                <>
                  Now playing <Equalizer />
                </>
              ) : (
                <>Last played{track.playedAt && <> · {timeAgo(track.playedAt)}</>}</>
              )}
            </p>
            <p className="mt-0.5 truncate text-[13px] font-medium leading-tight text-text-primary">{track.title}</p>
            <p className="truncate text-[11px] leading-tight text-text-secondary">{track.artist}</p>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

// Phones and tablets: a small Spotify button that opens the card in a popover. Closes on outside tap or Escape.
export function NowPlayingButton({ track, className = "" }: { track: Track | null; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!track) return null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={track.playing ? "Now playing on Spotify" : "Last played on Spotify"}
        className="grid size-8 place-items-center rounded-lg text-[#1db954] transition-all duration-200 hover:bg-surface-studio active:scale-90"
      >
        <SiSpotify size={14} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.8 }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-50 mt-2 w-60"
          >
            <NowPlaying track={track} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
