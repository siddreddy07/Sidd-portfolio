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

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  try {
    const hit = sessionStorage.getItem(key);
    if (hit) return JSON.parse(hit) as T;
  } catch {
    /* ignore */
  }
  const value = await load();
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
  return value;
}

export function useActivity() {
  const [state, setState] = useState<{ status: "loading" | "error" | "ready"; data?: Activity }>({ status: "loading" });

  useEffect(() => {
    let live = true;
    cached("gh-activity", async () => {
      const res = await fetch(CONTRIBUTIONS_URL);
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as { contributions: Day[] };
      return summarise(json.contributions);
    })
      .then((data) => live && setState({ status: "ready", data }))
      .catch(() => live && setState({ status: "error" }));
    return () => {
      live = false;
    };
  }, []);

  return state;
}
