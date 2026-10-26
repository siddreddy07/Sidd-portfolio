import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import seo from './seo/plugin';

// Serves the Vercel function in api/now-playing.ts during `npm run dev`, using the SPOTIFY_* keys from .env.local.
function spotifyApi(env: Record<string, string>): Plugin {
  return {
    name: 'spotify-api',
    configureServer(server) {
      Object.assign(process.env, env);
      server.middlewares.use('/api/now-playing', async (_req, res) => {
        const mod = await server.ssrLoadModule('/api/now-playing.ts');
        const response: Response = await mod.GET();
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      spotifyApi(loadEnv(mode, process.cwd(), 'SPOTIFY_')),
      // Optional Search Console / Bing Webmaster verification codes, set as Vercel env vars.
      seo({google: env.GOOGLE_SITE_VERIFICATION, bing: env.BING_SITE_VERIFICATION}),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
