import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useTheme } from "../../lib/theme";
import { flagUrl, type CountryVisits } from "../../lib/visitors";
import { cn } from "../../lib/utils";

// cobe draws the sphere with radius 0.8 in clip space; flags are projected with the same maths as its shader.
const RADIUS = 0.8;
const BASE_THETA = 0.25;
const AUTO_SPEED = 0.0024; // radians per frame at 60fps
const IDLE_MS = 2200; // resume auto-rotation this long after the last drag

const THEMES: Record<"dark" | "light", Partial<COBEOptions>> = {
  dark: {
    dark: 1,
    diffuse: 1.2,
    mapBrightness: 5,
    mapBaseBrightness: 0,
    baseColor: [0.3, 0.3, 0.3],
    glowColor: [0.08, 0.08, 0.08],
    markerColor: [0.94, 0.93, 0.89],
  },
  light: {
    dark: 0,
    diffuse: 0.4,
    mapBrightness: 1.2,
    mapBaseBrightness: 0,
    baseColor: [1, 1, 1],
    glowColor: [0.95, 0.94, 0.9],
    markerColor: [0.08, 0.08, 0.06],
  },
};

const toVector = ([lat, lng]: [number, number]): [number, number, number] => {
  const a = (lat * Math.PI) / 180;
  const b = (lng * Math.PI) / 180 - Math.PI;
  const c = Math.cos(a);
  return [-c * Math.cos(b) * RADIUS, Math.sin(a) * RADIUS, c * Math.sin(b) * RADIUS];
};

// phi / theta that put a location in the middle of the globe.
const anglesFor = ([lat, lng]: [number, number]) => ({
  phi: (3 * Math.PI) / 2 - (lng * Math.PI) / 180,
  theta: Math.max(-0.8, Math.min(0.8, (lat * Math.PI) / 180)),
});

// Shortest signed distance between two angles.
const wrap = (d: number) => d - 2 * Math.PI * Math.round(d / (2 * Math.PI));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Props {
  countries: CountryVisits[];
  active: string | null;
  onActiveChange: (code: string | null) => void;
  showCounts: boolean;
  className?: string;
}

export default function VisitorGlobe({ countries, active, onActiveChange, showCounts, className }: Props) {
  const { theme } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flagRefs = useRef(new Map<string, HTMLDivElement>());
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  // Everything the animation loop reads lives in one ref so the loop never restarts.
  const s = useRef({
    phi: anglesFor([20, 78]).phi, // open facing India
    theta: BASE_THETA,
    velocity: 0,
    auto: 0,
    drag: null as null | { id: number; x: number; y: number; moved: number; code: string | null },
    hovering: false,
    lastDrag: 0,
    target: null as null | { phi: number; theta: number },
    points: [] as { code: string; v: [number, number, number] }[],
    width: 0,
  });

  const [hovered, setHovered] = useState<string | null>(null);
  const placed = countries.filter((c) => c.location);

  useEffect(() => {
    s.current.points = placed.map((c) => ({ code: c.code, v: toVector(c.location!) }));
    globeRef.current?.update({ markers: placed.map((c) => ({ location: c.location!, size: 0.022 })) });
  }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const country = active ? placed.find((c) => c.code === active) : null;
    if (!country) {
      s.current.target = null;
      return;
    }
    const t = anglesFor(country.location!);
    s.current.target = { phi: s.current.phi + wrap(t.phi - s.current.phi), theta: t.theta };
    s.current.velocity = 0;
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    globeRef.current?.update(THEMES[theme]);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const st = s.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.width = hostRef.current!.offsetWidth;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: st.width,
      height: st.width,
      phi: st.phi,
      theta: st.theta,
      mapSamples: 16000,
      markerElevation: 0,
      markers: placed.map((c) => ({ location: c.location!, size: 0.022 })),
      ...(THEMES[theme] as COBEOptions),
    });
    globeRef.current = globe;

    const resize = new ResizeObserver(() => {
      const w = hostRef.current?.offsetWidth ?? 0;
      if (w && w !== st.width) {
        st.width = w;
        globe.update({ width: w, height: w });
      }
    });
    resize.observe(hostRef.current!);

    let frame = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - prev, 64) / 16.667; // 1 at 60fps, so motion speed doesn't depend on refresh rate
      prev = now;

      if (st.target && !st.drag) {
        const k = 1 - Math.pow(1 - 0.09, dt);
        st.phi += (st.target.phi - st.phi) * k;
        st.theta += (st.target.theta - st.theta) * k;
        st.auto = 0;
      } else if (st.hovering) {
        // Hold still while a flag is under the mouse so its label can be read.
        st.velocity *= Math.pow(0.8, dt);
        st.auto *= Math.pow(0.85, dt);
        st.phi += (st.velocity + st.auto) * dt;
      } else if (!st.drag) {
        // Fling inertia, then ease back into a slow spin and the default tilt.
        st.phi += st.velocity * dt;
        st.velocity *= Math.pow(0.94, dt);
        const idle = now - st.lastDrag > IDLE_MS;
        if (idle && !reduced) st.auto += (AUTO_SPEED - st.auto) * 0.02 * dt;
        else st.auto *= Math.pow(0.9, dt);
        st.phi += st.auto * dt;
        if (idle) st.theta += (BASE_THETA - st.theta) * 0.02 * dt;
      }

      globe.update({ phi: st.phi, theta: st.theta });
      placeFlags();
      frame = requestAnimationFrame(tick);
    };

    const placeFlags = () => {
      const cp = Math.cos(st.phi), sp = Math.sin(st.phi), ct = Math.cos(st.theta), stt = Math.sin(st.theta);
      const half = st.width / 2;
      for (const { code, v } of st.points) {
        const el = flagRefs.current.get(code);
        if (!el) continue;
        const x = cp * v[0] + sp * v[2];
        const y = sp * stt * v[0] + ct * v[1] - cp * stt * v[2];
        const z = -sp * ct * v[0] + stt * v[1] + cp * ct * v[2];
        // Fade and shrink as a flag rolls over the horizon instead of popping.
        const vis = clamp((z / RADIUS - 0.02) / 0.22, 0, 1);
        const left = (x + 1) * half;
        const top = (1 - y) * half;
        el.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0) scale(${(0.55 + 0.45 * vis).toFixed(3)})`;
        el.style.opacity = vis.toFixed(3);
        el.style.zIndex = String(Math.round(z * 100) + 100);
        el.style.visibility = vis < 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = vis > 0.6 ? "auto" : "none";
      }
    };

    frame = requestAnimationFrame(tick);
    requestAnimationFrame(() => (canvas.style.opacity = "1"));

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      globe.destroy();
      globeRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // Pointer capture retargets later events to the wrapper, so note the flag (if any) now.
    const code = (e.target as HTMLElement).closest<HTMLElement>("[data-code]")?.dataset.code ?? null;
    s.current.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0, code };
    s.current.velocity = 0;
    s.current.target = null;
    wrapRef.current?.setPointerCapture(e.pointerId);
    wrapRef.current!.dataset.dragging = "";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.drag || st.drag.id !== e.pointerId) return;
    const dx = e.clientX - st.drag.x;
    const dy = e.clientY - st.drag.y;
    st.drag.x = e.clientX;
    st.drag.y = e.clientY;
    st.drag.moved += Math.abs(dx) + Math.abs(dy);
    const k = Math.PI / Math.max(st.width, 1); // dragging across the whole globe turns it half way
    st.phi += dx * k;
    st.theta = clamp(st.theta + dy * k, -0.6, 0.9);
    st.velocity = st.velocity * 0.6 + dx * k * 0.4;
    if (st.drag.moved > 6 && active) onActiveChange(null);
  };

  const endDrag = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.drag || st.drag.id !== e.pointerId) return;
    const { moved, code } = st.drag;
    st.drag = null;
    st.lastDrag = performance.now();
    delete wrapRef.current!.dataset.dragging;
    // A tap on a flag selects it (tap again to let go); a tap on empty globe clears the selection.
    if (moved <= 6) onActiveChange(code && code !== active ? code : null);
  };

  return (
    <div
      ref={wrapRef}
      className={cn("group/globe relative aspect-square w-full touch-none select-none cursor-grab data-[dragging]:cursor-grabbing", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={hostRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="size-full opacity-0 transition-opacity duration-700 ease-out [contain:layout_paint_size]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0" role="list" aria-label="Visitor countries on the globe">
        {placed.map((c) => {
          const on = c.code === active;
          const label = on || c.code === hovered;
          return (
            <div
              key={c.code}
              ref={(el) => {
                if (el) flagRefs.current.set(c.code, el);
                else flagRefs.current.delete(c.code);
              }}
              data-code={c.code}
              role="listitem"
              aria-label={showCounts ? `${c.name}: ${c.count} visits` : c.name}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                s.current.hovering = true;
                setHovered(c.code);
              }}
              onPointerLeave={() => {
                s.current.hovering = false;
                setHovered((h) => (h === c.code ? null : h));
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-full">
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-text-primary px-2 py-1 font-mono text-[10px] leading-none text-bg-studio shadow-lg transition-all duration-200 ease-out",
                    label ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                    on && "mb-4",
                  )}
                >
                  {c.name}
                  {showCounts && <span className="ml-1.5 opacity-60">{c.count.toLocaleString("en-IN")}</span>}
                </span>
                <div
                  className={cn(
                    "flex origin-bottom flex-col items-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    label && "scale-[1.3]",
                  )}
                >
                  <img
                    src={flagUrl(c.code)}
                    alt=""
                    draggable={false}
                    className={cn(
                      "h-[13px] w-[19px] rounded-[3px] object-cover ring-1 ring-black/15 shadow-[0_2px_6px_rgb(0_0_0/0.35)] transition-shadow duration-300",
                      on && "ring-2 ring-text-primary/70",
                    )}
                  />
                  <span className="h-2 w-px bg-text-primary/50" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
