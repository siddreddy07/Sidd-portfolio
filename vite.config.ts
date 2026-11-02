import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import seo from './seo/plugin';

// Serves the Vercel functions in api/ during `npm run dev`, using the SPOTIFY_* / UPSTASH_* / KV_* keys from .env.local.
const API_ROUTES = ['now-playing', 'visitors'];

function devApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      Object.assign(process.env, env);
      for (const route of API_ROUTES) {
        server.middlewares.use(`/api/${route}`, async (req, res) => {
          const mod = await server.ssrLoadModule(`/api/${route}.ts`);
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end();
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value);
          const response: Response = await handler(new Request(`http://localhost${req.originalUrl ?? req.url}`, { method: req.method, headers }));
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        });
      }
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      devApi(loadEnv(mode, process.cwd(), ['SPOTIFY_', 'UPSTASH_', 'KV_'])),
      // Search Console / Bing Webmaster verification codes (public by design; env vars override).
      seo({
        google: env.GOOGLE_SITE_VERIFICATION || 'J809-DU18CFywIc6syPN-dOQKqi8gPm8TVMIrbgYT2U',
        bing: env.BING_SITE_VERIFICATION,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
