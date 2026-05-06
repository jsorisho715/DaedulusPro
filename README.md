# Daedalus Pro

Vendor portal + managed marketplace for multifamily maintenance. See [PRD.md](PRD.md) for product scope.

## Local dev

Requires Node 18+ and npm.

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Uses Vite with HMR. Mock data lives in [data/mock.js](data/mock.js) and is exposed as `window.MOCK` for the legacy compat-shim screens.

## API (Vercel Functions)

Backend endpoints live in [api/](api). Each file is a Vercel Serverless Function — see [api/health.js](api/health.js).

Run the full stack (frontend + functions) locally with the Vercel CLI:

```bash
npm install -g vercel        # first time only
vercel link                  # link this folder to the Vercel project (first time only)
npm run dev:vercel           # runs `vercel dev` on :3000
```

Then in another terminal: `npm run dev` (Vite on :5173). Vite proxies `/api/*` → `http://127.0.0.1:3000`.

If you only run `npm run dev`, the UI loads but `/api` calls will fail with `ECONNREFUSED` until `vercel dev` is also running.

## Architecture (compat shim)

The original prototype was generated in Claude Design as Babel-in-browser scripts that share a single global scope. Every screen and component publishes its public surface via `window.X = X`. Rather than rewrite ~26 files into ES modules, [src/main.jsx](src/main.jsx) exposes `React`/`ReactDOM`/`THREE` on `globalThis` and side-effect-imports each prototype file in the original load order, which preserves all global cross-references unchanged.

Add new screens by:
1. Dropping a `.jsx` file in `screens/` that ends with `window.MyScreen = MyScreen;`
2. Adding the import to [src/main.jsx](src/main.jsx) in the right position
3. Wiring a route case in [App.jsx](App.jsx)

Or — when you're ready — convert any individual file to a real ES module with `export default`; the compat shim doesn't get in the way.

## Deploy

GitHub: `jsorisho715/DaedulusPro`. Pushes to `main` auto-deploy via Vercel project `johnathans-projects-b18146ff/daedulus-pro`. Build settings come from [vercel.json](vercel.json) (framework: vite, output: dist).

## Folder map

- [src/](src/) — Vite entry + lib helpers
- [api/](api/) — Vercel Functions
- [components/](components/) — shared primitives (Icon, Sidebar, TopBar, modals)
- [screens/](screens/) — one file per route
- [data/mock.js](data/mock.js) — pilot vendor mock data (Daedalus Trades, Phoenix metro)
- [styles/tokens.css](styles/tokens.css) — design tokens (colors, type, spacing)
- [tweaks-panel.jsx](tweaks-panel.jsx) — runtime theme/density tweaker (dev tool)
- [legacy/](legacy/) — original Claude Design HTML for reference
