import { useEffect, useState } from "react";
import CENTROIDS from "../data/countryCentroids.json";
import { fetchVisitorStats } from "./visits";

export interface CountryVisits {
  code: string; // ISO 3166-1 alpha-2, upper case
  name: string;
  count: number;
  location: [number, number] | null; // [lat, lng] of the country's centre, if known
}

const centroids = CENTROIDS as unknown as Record<string, [number, number]>;
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();

export const countryName = (code: string) => {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

export const flagUrl = (code: string) => `https://flagcdn.com/${code.toLowerCase()}.svg`;

export interface VisitorBreakdown {
  total: number; // unique visitors, same number as the footer
  countries: CountryVisits[]; // most visitors first
}

/** Visitor numbers from Redis, fetched each time `enabled` becomes true. `undefined` while loading, `null` on error. */
export function useCountryVisits(enabled: boolean) {
  const [data, setData] = useState<VisitorBreakdown | null | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fetchVisitorStats().then((stats) => {
      if (!live) return;
      if (!stats) return setData(null);
      const countries = Object.entries(stats.countries ?? {})
        .map(([code, count]) => ({ code, count, name: countryName(code), location: centroids[code] ?? null }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      setData({ total: stats.total, countries });
    });
    return () => {
      live = false;
    };
  }, [enabled]);
  return data;
}
