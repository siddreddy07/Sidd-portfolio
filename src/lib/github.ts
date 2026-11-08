import { useEffect, useState } from "react";

export interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Activity {
  days: Day[];
  total: number;
  activeDays: number;
  currentStreak: number;
  longestRun: number;
  bestDay: Day;
}

const USER = "siddreddy07";
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;

function summarise(days: Day[]): Activity {
  let total = 0;
  let activeDays = 0;
  let longestRun = 0;
  let run = 0;
  let bestDay = days[0];
  for (const d of days) {
    total += d.count;
    if (d.count > 0) {
      activeDays++;
      run++;
      longestRun = Math.max(longestRun, run);
    } else {
      run = 0;
    }
    if (d.count > bestDay.count) bestDay = d;
  }
  // Current streak: walk back from today; an empty "today" doesn't break it yet.
  let currentStreak = 0;
  let i = days.length - 1;
  if (days[i].count === 0) i--;
  while (i >= 0 && days[i].count > 0) {
    currentStreak++;
    i--;
  }
  return { days, total, activeDays, currentStreak, longestRun, bestDay };
}

const KEY = "gh-activity";

function read(store: Storage): Activity | null {
  try {
    const hit = store.getItem(KEY);
    const data = hit ? (JSON.parse(hit) as Activity) : null;
    return data && data.days?.length ? data : null;
  } catch {
    return null;
  }
}

function write(data: Activity) {
  for (const store of [sessionStorage, localStorage]) {
    try {
      store.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }
}

// The contributions API is a free third-party service and occasionally times out or errors, so each try gets a
// deadline and a failure is retried with a short back-off before giving up.
async function fetchOnce(): Promise<Activity> {
  const res = await fetch(CONTRIBUTIONS_URL, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(String(res.status));
  const json = (await res.json()) as { contributions?: Day[] };
  if (!json.contributions?.length) throw new Error("empty");
  return summarise(json.contributions);
}

async function load(): Promise<Activity> {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 800 * attempt));
    try {
      return await fetchOnce();
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

export function useActivity() {
  const [state, setState] = useState<{ status: "loading" | "error" | "ready"; data?: Activity }>(() => {
    const fresh = read(sessionStorage);
    return fresh ? { status: "ready", data: fresh } : { status: "loading" };
  });

  useEffect(() => {
    if (state.status === "ready") return;
    let live = true;
    load()
      .then((data) => {
        write(data);
        if (live) setState({ status: "ready", data });
      })
      .catch(() => {
        // Show the last graph we managed to load, if any, rather than an error.
        const stale = read(localStorage);
        if (live) setState(stale ? { status: "ready", data: stale } : { status: "error" });
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
