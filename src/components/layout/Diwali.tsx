import type { ReactElement } from "react";
import { useMemo } from "react";

// A quiet Diwali touch: a few warm lights hanging from the bottom edge of the navbar.
// It shows on its own during the festival window (7-11 Nov 2026) and can be forced with ?diwali=1 (or hidden with ?diwali=0).
const FROM = new Date(2026, 10, 7).getTime();
const TO = new Date(2026, 10, 12).getTime();

export function useDiwali() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    const q = new URLSearchParams(window.location.search).get("diwali");
    if (q === "1") return true;
    if (q === "0") return false;
    const now = Date.now();
    return now >= FROM && now < TO;
  }, []);
}

const BULBS = ["#ffb347", "#ff7a3d", "#ffd36b", "#ff9f43", "#ffc857", "#ff6b3d"];
const DROPS = [9, 15, 11, 17, 9, 15, 11, 17]; // string length of each hanging bulb, px

/**
 * A few small lights hanging from the bottom edge of the navbar on short strings, swaying slightly.
 * Must sit inside the (positioned) header wrapper; it matches the bar's horizontal box (inset-x-5 / md:inset-x-8).
 */
export function NavLights() {
  const on = useDiwali();
  if (!on) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-5 top-14 z-10 flex justify-between px-7 md:inset-x-8 md:px-10">
      {DROPS.map((len, i) => {
        const c = BULBS[i % BULBS.length];
        return (
          <div
            key={i}
            className="diwali-hang flex flex-col items-center max-sm:[&:nth-child(even)]:hidden"
            style={{ animationDelay: `${(i * 0.43) % 2.6}s` }}
          >
            <span className="w-px bg-[#ffb347]/50" style={{ height: len }} />
            <span className="block h-[3px] w-[4px] rounded-t-sm bg-[#b8741f]" />
            <span
              className="diwali-bulb block size-[7px] rounded-full"
              style={{ background: c, color: c, animationDelay: `${((i * 0.37) % 2.4).toFixed(2)}s` }}
            />
          </div>
        );
      })}
    </div>
  );
}

const SVG = "size-5 shrink-0 overflow-visible";
const at = (i: number, step = 0.18) => ({ animationDelay: `${(i * step).toFixed(2)}s` });
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Six different little rangolis, so neighbouring sections don't look alike. Transforms that position a shape live on
// a wrapping <g>; CSS animations only touch the shape inside it.
const RANGOLIS: (() => ReactElement)[] = [
  // 0 · marigold wheel: eight petals that breathe while the whole thing turns
  () => (
    <svg aria-hidden viewBox="-12 -12 24 24" className={`diwali-spin ${SVG}`}>
      {["#ff7a3d", "#e84a8a", "#ffb347", "#9b5de5", "#ff7a3d", "#e84a8a", "#ffb347", "#00a6a6"].map((c, i) => (
        <g key={i} transform={`rotate(${i * 45})`}>
          <path className="diwali-petal" style={at(i)} d="M0 -2.5C2.6 -5 2.6 -8 0 -10.5C-2.6 -8 -2.6 -5 0 -2.5z" fill={c} />
        </g>
      ))}
      <circle r="2" fill="#ffd36b" />
    </svg>
  ),
  // 1 · four-point star ringed with dots that twinkle round the circle
  () => (
    <svg aria-hidden viewBox="-12 -12 24 24" className={SVG}>
      {[0, 90].map((a) => (
        <path key={a} d="M0 -9.5L2.4 0L0 9.5L-2.4 0z" transform={`rotate(${a})`} fill="#e84a8a" />
      ))}
      {[45, 135].map((a) => (
        <path key={a} d="M0 -6L1.5 0L0 6L-1.5 0z" transform={`rotate(${a})`} fill="#ffb347" />
      ))}
      <circle r="1.7" fill="#ff7a3d" />
      {range(8).map((i) => (
        <g key={i} transform={`rotate(${i * 45 + 22.5})`}>
          <circle className="diwali-dot" style={at(i, 0.3)} cy="-10.8" r="0.95" fill={i % 2 ? "#00a6a6" : "#9b5de5"} />
        </g>
      ))}
    </svg>
  ),
  // 2 · lotus: three layers of petals that bloom up from the base
  () => (
    <svg aria-hidden viewBox="-12 -12 24 24" className={SVG}>
      {[
        { angles: [-72, -36, 0, 36, 72], s: 1, c: "#e84a8a" },
        { angles: [-36, 0, 36], s: 0.78, c: "#ffb347" },
        { angles: [0], s: 0.5, c: "#ff7a3d" },
      ].map((layer, li) =>
        layer.angles.map((a) => (
          <g key={`${li}-${a}`} transform={`translate(0 8) rotate(${a}) scale(${layer.s}) translate(0 -8)`}>
            <path className="diwali-petal" style={at(li, 0.35)} d="M0 8C-3.8 4 -3.8 -2 0 -8C3.8 -2 3.8 4 0 8z" fill={layer.c} opacity={0.92} />
          </g>
        )),
      )}
      <path d="M-9 10.5H9" stroke="#00a6a6" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  // 3 · kolam: a dot lattice joined by a marching dashed diamond
  () => (
    <svg aria-hidden viewBox="-12 -12 24 24" className={SVG}>
      <path className="diwali-dash" d="M0 -8.5L8.5 0L0 8.5L-8.5 0z" fill="none" stroke="#ffb347" strokeWidth="1.1" strokeLinejoin="round" />
      <circle className="diwali-dash" r="4.2" fill="none" stroke="#e84a8a" strokeWidth="1" />
      {[[0, -8.5], [8.5, 0], [0, 8.5], [-8.5, 0]].map(([x, y], i) => (
        <circle key={i} className="diwali-dot" style={at(i, 0.4)} cx={x} cy={y} r="1.5" fill="#9b5de5" />
      ))}
      {[[-8.5, -8.5], [8.5, -8.5], [8.5, 8.5], [-8.5, 8.5]].map(([x, y], i) => (
        <circle key={i} className="diwali-dot" style={at(i + 2, 0.4)} cx={x} cy={y} r="1" fill="#00a6a6" />
      ))}
      <circle r="1.4" fill="#ff7a3d" />
    </svg>
  ),
  // 4 · six-petal bloom of overlapping circles, turning the other way
  () => (
    <svg aria-hidden viewBox="-12 -12 24 24" className={`diwali-spin-rev ${SVG}`}>
      {range(6).map((i) => (
        <g key={i} transform={`rotate(${i * 60})`}>
          <circle className="diwali-dot" style={at(i, 0.25)} cy="-5.2" r="3.7" fill={i % 2 ? "#9b5de5" : "#00a6a6"} opacity="0.8" />
        </g>
      ))}
      <circle r="2.4" fill="#ffd36b" />
      <circle r="1" fill="#e84a8a" />
    </svg>
  ),
  // 5 · sunburst: long and short rays that pulse in turn, like a diya's glow
  () => (
    <svg aria-hidden viewBox="-12 -12 24 24" className={SVG}>
      {range(12).map((i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <path
            className="diwali-petal"
            style={at(i, 0.15)}
            d={i % 2 ? "M0 -5L1.2 -8L0 -9L-1.2 -8z" : "M0 -4.5L1.7 -9L0 -11L-1.7 -9z"}
            fill={i % 2 ? "#ffb347" : "#ff7a3d"}
          />
        </g>
      ))}
      <circle r="3.4" fill="none" stroke="#e84a8a" strokeWidth="1.2" />
      <circle r="1.4" fill="#ffd36b" />
    </svg>
  ),
];

/** A tiny colourful rangoli beside a section's label. `variant` picks one of six designs (wraps around). */
export function MiniRangoli({ variant = 0 }: { variant?: number }) {
  const R = RANGOLIS[((variant % RANGOLIS.length) + RANGOLIS.length) % RANGOLIS.length];
  return <R />;
}
