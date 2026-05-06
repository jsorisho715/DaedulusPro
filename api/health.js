// Vercel Serverless Function — first /api endpoint.
// Reachable at /api/health both in `vercel dev` and on Vercel production.
// Using .js (not .ts) keeps things consistent with the rest of the repo;
// trivially convertible later.

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: 'daedalus-pro-api',
    time: new Date().toISOString(),
    method: req.method,
  });
}
