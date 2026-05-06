// Tiny fetch helper. Use VITE_API_BASE_URL when set; default to '/api' so
// the dev proxy (vite.config.js) and Vercel production share the same path.

const BASE = import.meta.env?.VITE_API_BASE_URL || '/api';

export async function api(path, init = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText} ${url} :: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Optional: expose on window so legacy global-scope screens can call it
// without ES imports during the compat-shim phase.
if (typeof window !== 'undefined') {
  window.api = api;
}
