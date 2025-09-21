import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? 'https://fioulrapide.fr/' : '/',
  server: {
    host: "::",
    port: 8080,
    origin: mode === 'development' ? 'http://localhost:8080' : 'https://fioulrapide.fr',
    cors: {
      origin: ['https://fioulrapide.fr', 'http://localhost:8080'],
      credentials: true,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __DOMAIN__: JSON.stringify('fioulrapide.fr'),
  },
}));
