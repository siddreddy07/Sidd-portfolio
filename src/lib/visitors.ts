import { useEffect, useState } from "react";
import CENTROIDS from "../data/countryCentroids.json";

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

let cache: Promise<CountryVisits[] | null> | null = null;

function load(): Promise<CountryVisits[] | null> {
  cache ??= fetch("/api/visitors")
    .then((r) => (r.ok ? r.json() : null))
    .then((json: { configured: boolean; countries: Record<string, number> } | null) => {
      if (!json) return null;
      // Real recorded visits only; an unconnected store simply shows the empty state.
      return Object.entries(json.countries ?? {})
        .map(([code, count]) => ({ code, count, name: countryName(code), location: centroids[code] ?? null }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    })
    .catch(() => null)
    .finally(() => {
      // Let a later open refetch (the server caches for a minute anyway).
      setTimeout(() => (cache = null), 60_000);
    });
  return cache;
}

/** Per-country visits, fetched when `enabled` first becomes true. `undefined` while loading, `null` on error. */
export function useCountryVisits(enabled: boolean) {
  const [data, setData] = useState<CountryVisits[] | null | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    load().then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [enabled]);
  return data;
}
