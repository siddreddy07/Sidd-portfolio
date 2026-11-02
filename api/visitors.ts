// Vercel function: profile visits per country, for the globe in the footer dialog.
// Counts live in one Redis hash (country code -> visits) on Upstash, added through Vercel's Storage tab.
// Needs UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or the KV_REST_API_* names Vercel sets).

const HASH = "visitors:countries";

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

export async function GET() {
  try {
    const replies = await redis([["HGETALL", HASH]]);
    if (!replies) return Response.json({ configured: false, countries: {} });
    return Response.json(
      { configured: true, countries: toCounts(replies[0]?.result) },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return Response.json(null, { status: 502 });
  }
}

// Records one visit for the caller's country. The country comes from Vercel's geo header, never from the client,
// and only production deploys write, so previews and local dev don't skew the numbers.
export async function POST(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (process.env.VERCEL_ENV !== "production" || !country || !/^[A-Z]{2}$/.test(country) || country === "XX") {
    return new Response(null, { status: 204 });
  }
  try {
    const replies = await redis([["HINCRBY", HASH, country, 1]]);
    return new Response(null, { status: replies ? 204 : 503, headers: { "Cache-Control": "no-store" } });
  } catch {
    return new Response(null, { status: 502 });
  }
}
