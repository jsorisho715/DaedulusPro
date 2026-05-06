import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The repo's existing JSX files are NOT ES modules — they rely on globals
// (window.MOCK, top-level function declarations, React on the global object).
// We keep them byte-identical and bundle via Vite by side-effect-importing
// them in src/main.jsx after exposing React/ReactDOM/THREE to globalThis.

export default defineConfig({
  plugins: [
    react({
      // Process .js files with JSX too, since some legacy files may use JSX
      // without the .jsx extension. Cheap insurance, no runtime cost.
      include: /\.(jsx|js)$/,
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    proxy: {
      // /api routes go to Vercel Functions when running `vercel dev` on :3000.
      // If the user only runs `npm run dev`, fetches to /api will fail with
      // ECONNREFUSED — that is expected until they also start `vercel dev`.
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    // Pin to an empty inline PostCSS config so Vite does not walk up to
    // `C:\Users\jonat\postcss.config.js` (which requires Tailwind we don't use).
    postcss: { plugins: [] },
  },
});
