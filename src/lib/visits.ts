import { useEffect, useState } from "react";
import { SITE } from "../config/site";

// Keyless counter service (https://abacus.jasoncameron.dev). One key holds the total profile visits.
const NAMESPACE = import.meta.env.VITE_VISITS_NS ?? "siddharth-portfolio-delta-vercel-app";
const KEY = import.meta.env.VITE_VISITS_KEY ?? "visits";
const BASE = `https://abacus.jasoncameron.dev`;
const COUNTED = "visit-counted";
const REFRESH_MS = 20_000;

const isProduction = () => typeof location !== "undefined" && location.hostname === new URL(SITE.url).hostname;

async function call(action: "hit" | "get"): Promise<number | null> {
  try {
    const res = await fetch(`${BASE}/${action}/${NAMESPACE}/${KEY}`);
    if (res.status === 404) return 0; // counter not created yet: nobody has visited the live site
    if (!res.ok) return null;
    const json = (await res.json()) as { value?: number };
    return typeof json.value === "number" ? json.value : null;
  } catch {
    return null;
  }
}

/**
 * Unique profile visits. Counts once per browser (remembered in localStorage), and only on the production domain so
 * local development and preview deploys don't inflate it. Re-reads every 20s while the tab is visible.
 */
export function useVisits() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let live = true;

    async function first() {
      let counted = false;
      try {
        counted = localStorage.getItem(COUNTED) === "1";
      } catch {
        /* storage unavailable: treat as not counted */
      }
      const shouldHit = isProduction() && !counted;
      const value = await call(shouldHit ? "hit" : "get");
      if (shouldHit && value !== null) {
        try {
          localStorage.setItem(COUNTED, "1");
        } catch {
          /* ignore */
        }
      }
      if (live && value !== null) setCount(value);
    }

    first();
    const id = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const value = await call("get");
      if (live && value !== null) setCount(value);
    }, REFRESH_MS);

    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  return count;
}
