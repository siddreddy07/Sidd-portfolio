import { useEffect, useState } from "react";

// All visitor numbers come from api/visitors.ts (Upstash Redis). The server decides who is new, so nothing is
// remembered in the browser.
export interface VisitorStats {
  configured: boolean;
  total: number;
  countries: Record<string, number>;
}

const REFRESH_MS = 20_000;

let registered: Promise<VisitorStats | null> | null = null;

async function request(method: "GET" | "POST"): Promise<VisitorStats | null> {
  try {
    const res = await fetch("/api/visitors", { method });
    return res.ok ? ((await res.json()) as VisitorStats | null) : null;
  } catch {
    return null;
  }
}

/** Registers this visit once per page load (the server ignores repeat visitors) and returns the numbers. */
export const registerVisit = () => (registered ??= request("POST"));

export const fetchVisitorStats = () => request("GET");

/** Total unique visitors for the footer. Re-reads every 20s while the tab is visible. */
export function useVisits() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    const apply = (s: VisitorStats | null) => live && s?.configured && setCount(s.total);

    registerVisit().then(apply);
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchVisitorStats().then(apply);
    }, REFRESH_MS);

    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  return count;
}
