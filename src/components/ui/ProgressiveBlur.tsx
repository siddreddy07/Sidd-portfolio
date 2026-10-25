/**
 * Progressive blur edge. Stacks several backdrop-blur layers with staggered masks so the blur
 * ramps up smoothly instead of switching on, then adds a colour fade on top.
 * Adapted from Skiper UI (skiper41) by @gxuri; `backgroundColor` follows the theme background.
 */
export default function ProgressiveBlur({
  className = "",
  backgroundColor = "var(--bg)",
  position = "bottom",
  height = "120px",
  blurAmount = 10,
  layers = 6,
}: {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  /** Blur radius in px reached at the outer edge. */
  blurAmount?: number;
  layers?: number;
}) {
  const isTop = position === "top";
  // Direction the mask runs, from the content side towards the screen edge.
  const toEdge = isTop ? "to top" : "to bottom";
  const step = 100 / (layers + 1);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 z-10 w-full select-none ${className}`}
      style={{ [isTop ? "top" : "bottom"]: 0, height }}
    >
      {Array.from({ length: layers }, (_, i) => {
        const a = i * step;
        const mask = `linear-gradient(${toEdge}, transparent ${a}%, black ${a + step}%, black ${a + step * 2}%, transparent ${a + step * 3}%)`;
        const blur = `blur(${((i + 1) / layers) * blurAmount}px)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{ maskImage: mask, WebkitMaskImage: mask, backdropFilter: blur, WebkitBackdropFilter: blur }}
          />
        );
      })}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(${toEdge}, transparent 10%, ${backgroundColor})` }}
      />
    </div>
  );
}
