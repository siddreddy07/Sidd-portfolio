import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";
const KEY = "theme";
const REVEAL_MS = 450;

/** Viewport point the reveal grows from. Omit to grow from the viewport centre. */
export type RevealOrigin = { x: number; y: number };

const ThemeContext = createContext<{ theme: Theme; toggle: (origin?: RevealOrigin) => void }>({
  theme: "dark",
  toggle: () => {},
});

function readTheme(): Theme {
  // The inline script in index.html has already applied the stored theme before first paint.
  if (typeof document !== "undefined" && document.documentElement.dataset.theme === "light") return "light";
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage unavailable */
  }
  return "dark";
}

/**
 * Circle clip-path reveal via the View Transitions API, adapted from Magic UI's
 * AnimatedThemeToggler (circle variant). Coordinates are percentages of the snapshot box because
 * Chrome mis-scales px clip-paths on fractional display scales (e.g. Windows at 150%).
 */
function circleClipPaths({ x, y }: RevealOrigin): [string, string] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  const at = `${(x / w) * 100}% ${(y / h) * 100}%`;
  // circle() percentage radii resolve against hypot(w, h) / sqrt(2).
  const radius = `${(r / (Math.hypot(w, h) / Math.SQRT2)) * 100}%`;
  return [`circle(0% at ${at})`, `circle(${radius} at ${at})`];
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const busy = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const toggle = useCallback((origin?: RevealOrigin) => {
    if (busy.current) return;
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    const root = document.documentElement;
    // Set the attribute synchronously so the view transition snapshots the new theme.
    const apply = () => {
      root.dataset.theme = next;
      flushSync(() => setTheme(next));
    };

    if (
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    const clipPath = circleClipPaths(origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    busy.current = true;
    // Freeze CSS transitions so the new snapshot isn't repainting dozens of colour fades under the reveal
    // (the main cause of jank on phones and tablets). See index.css.
    root.dataset.themeVt = "active";
    root.style.setProperty("--theme-vt-duration", `${REVEAL_MS}ms`);
    // Pinned in CSS too, so Firefox doesn't paint the new theme unclipped before the animation starts.
    root.style.setProperty("--theme-vt-clip-from", clipPath[0]);

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath },
          { duration: REVEAL_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished
      .finally(() => {
        busy.current = false;
        // Release the transition freeze a frame later, once the live page has painted in the new theme.
        requestAnimationFrame(() => delete root.dataset.themeVt);
        root.style.removeProperty("--theme-vt-duration");
        root.style.removeProperty("--theme-vt-clip-from");
      })
      .catch(() => {});
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
