// One-time helper: gets a Spotify refresh token for api/now-playing.ts and saves it to .env.local.
// 1. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
// 2. Add http://127.0.0.1:8888/callback as a Redirect URI in your Spotify app settings
// 3. Run: node scripts/spotify-token.mjs   (then open the printed URL and approve)
import { appendFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";

const ENV_FILE = ".env.local";
if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error(`Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in ${ENV_FILE} first.`);
  process.exit(1);
}

const REDIRECT = "http://127.0.0.1:8888/callback";
const auth = new URL("https://accounts.spotify.com/authorize");
auth.search = new URLSearchParams({
  client_id: id,
  response_type: "code",
  redirect_uri: REDIRECT,
  scope: "user-read-currently-playing user-read-recently-played",
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== "/callback") return res.end();
  const code = url.searchParams.get("code");
  if (!code) return res.end(`No code: ${url.searchParams.get("error") ?? "unknown error"}`);

  const token = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
  }).then((r) => r.json());

  if (!token.refresh_token) {
    console.error("Spotify didn't return a refresh token:", token);
    res.end("Failed. See the terminal.");
  } else {
    appendFileSync(ENV_FILE, `\nSPOTIFY_REFRESH_TOKEN=${token.refresh_token}\n`);
    console.log(`\nSaved SPOTIFY_REFRESH_TOKEN to ${ENV_FILE}.\n`);
    res.end("Done. You can close this tab.");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => console.log("Open this URL and approve:\n\n" + auth + "\n"));
