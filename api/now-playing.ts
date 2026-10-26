// Vercel function: the song playing right now, or the last one played. Keeps the Spotify secrets server side.
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN (see scripts/spotify-token.mjs).

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me/player";

interface SpotifyTrack {
  name: string;
  external_urls: { spotify: string };
  artists: { name: string }[];
  album: { name: string; images: { url: string; width: number }[] };
}

async function accessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw new Error("Spotify env vars missing");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

function shape(track: SpotifyTrack, playing: boolean, playedAt?: string) {
  // Smallest image that's still sharp at 2x for a ~40px thumbnail.
  const images = [...track.album.images].sort((a, b) => a.width - b.width);
  return {
    playing,
    playedAt: playedAt ?? null,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    image: (images.find((i) => i.width >= 128) ?? images.at(-1))?.url ?? null,
    url: track.external_urls.spotify,
  };
}

async function load() {
  const headers = { Authorization: `Bearer ${await accessToken()}` };

  const now = await fetch(`${API}/currently-playing`, { headers });
  if (now.status === 200) {
    const json = (await now.json()) as { is_playing: boolean; currently_playing_type: string; item: SpotifyTrack | null };
    if (json.item && json.currently_playing_type === "track") return shape(json.item, json.is_playing);
  }

  const recent = await fetch(`${API}/recently-played?limit=1`, { headers });
  if (!recent.ok) throw new Error(`recent ${recent.status}`);
  const json = (await recent.json()) as { items: { track: SpotifyTrack; played_at: string }[] };
  const last = json.items[0];
  return last ? shape(last.track, false, last.played_at) : null;
}

export async function GET() {
  try {
    const track = await load();
    return Response.json(track, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return Response.json(null, { status: 502 });
  }
}
