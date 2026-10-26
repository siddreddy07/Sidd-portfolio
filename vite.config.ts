import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

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

export default defineConfig(({mode}) => ({
  plugins: [react(), tailwindcss(), spotifyApi(loadEnv(mode, process.cwd(), 'SPOTIFY_'))],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
}));
