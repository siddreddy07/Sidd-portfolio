// Vercel function: every visitor number on the site (footer total + the globe's per-country counts) lives in
// Upstash Redis, added through Vercel's Storage tab.
// Needs KV_REST_API_URL + KV_REST_API_TOKEN (set by Vercel) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
//
// Keys:
//   visitors:total      unique visitors
//   visitors:countries  hash, country code -> unique visitors
//   visitors:seen       set of hashed visitor IPs, so each visitor is counted once (the raw IP is never stored)

const TOTAL = "visitors:total";
const COUNTRIES = "visitors:countries";
const SEEN = "visitors:seen";

type RedisReply = { result?: unknown; error?: string };

function credentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(commands: (string | number)[][]): Promise<RedisReply[] | null> {
  const creds = credentials();
  if (!creds) return null;
  const res = await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}` },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return (await res.json()) as RedisReply[];
}

// HGETALL replies with a flat [field, value, field, value, ...] list.
function toCounts(reply: unknown): Record<string, number> {
  const counts: Record<string, number> = {};
  if (!Array.isArray(reply)) return counts;
  for (let i = 0; i + 1 < reply.length; i += 2) {
    const n = Number(reply[i + 1]);
    if (/^[A-Z]{2}$/.test(String(reply[i])) && n > 0) counts[reply[i]] = n;
  }
  return counts;
}

async function snapshot() {
  const replies = await redis([["GET", TOTAL], ["HGETALL", COUNTRIES]]);
  if (!replies) return { configured: false, total: 0, countries: {} };
  return { configured: true, total: Number(replies[0]?.result ?? 0) || 0, countries: toCounts(replies[1]?.result) };
}

async function visitorId(request: Request) {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  const salt = process.env.VISITOR_SALT ?? "siddharth-portfolio";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function GET() {
  try {
    return Response.json(await snapshot(), {
      headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" },
    });
  } catch {
    return Response.json(null, { status: 502 });
  }
}

// Called once per page load. Counts the caller if this is the first time their (hashed) IP is seen, then returns
// the latest numbers. Country comes from Vercel's geo header, never from the client. Only production writes, so
// previews and local dev don't skew anything.
export async function POST(request: Request) {
  try {
    const id = process.env.VERCEL_ENV === "production" ? await visitorId(request) : null;
    if (id) {
      const added = await redis([["SADD", SEEN, id]]);
      if (added?.[0]?.result === 1) {
        const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
        const commands: (string | number)[][] = [["INCR", TOTAL]];
        if (country && /^[A-Z]{2}$/.test(country) && country !== "XX") commands.push(["HINCRBY", COUNTRIES, country, 1]);
        await redis(commands);
      }
    }
    return Response.json(await snapshot(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(null, { status: 502 });
  }
}
