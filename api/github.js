/* ══════════════════════════════════════════════════════════════
   GITHUB STATS API — Vercel Serverless Function (Node.js, zero-dependency)

     GET /api/github → live public GitHub stats for the profile

   Fetches the public GitHub REST API server-side and caches the result in
   Redis for an hour, so thousands of visitors cost at most one GitHub call
   per hour (and never hit the unauthenticated rate limit). Redis is optional —
   without it the function still works, just without the cache layer.
══════════════════════════════════════════════════════════════ */

'use strict';

function findEnv(match, reject) {
  const env = process.env;
  for (const key of Object.keys(env)) {
    if (match.test(key) && (!reject || !reject.test(key)) && env[key]) return env[key];
  }
  return undefined;
}
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL ||
  findEnv(/REST_API_URL$|REDIS_REST_URL$/);
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN ||
  findEnv(/REST_API_TOKEN$|REDIS_REST_TOKEN$/, /READ_ONLY/);

const USER      = 'Osama2214';
const CACHE_KEY = 'github:stats';
const CACHE_TTL = 3600; // seconds
const TOP_N     = 6;

function cacheEnabled() { return Boolean(REDIS_URL && REDIS_TOKEN); }

async function redis(command) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function ghFetch(path) {
  const headers = { 'User-Agent': 'osama-portfolio', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetch('https://api.github.com' + path, { headers });
  if (!r.ok) throw new Error('GitHub ' + r.status);
  return r.json();
}

async function buildStats() {
  const user = await ghFetch('/users/' + USER);
  const repos = await ghFetch('/users/' + USER + '/repos?per_page=100&sort=updated');
  const list = Array.isArray(repos) ? repos : [];
  const totalStars = list.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const top = list
    .filter((r) => !r.fork)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, TOP_N)
    .map((r) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count || 0,
      language: r.language,
      url: r.html_url,
    }));
  return {
    login: user.login,
    name: user.name,
    avatar: user.avatar_url,
    repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    stars: totalStars,
    top,
    updatedAt: Date.now(),
  };
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Serve from cache when it's warm.
  if (cacheEnabled()) {
    try {
      const cached = await redis(['GET', CACHE_KEY]);
      if (cached) {
        res.setHeader('Cache-Control', 'public, max-age=300');
        return res.status(200).json({ ...JSON.parse(cached), cached: true });
      }
    } catch (_) { /* fall through to a live fetch */ }
  }

  try {
    const stats = await buildStats();
    if (cacheEnabled()) {
      try { await redis(['SET', CACHE_KEY, JSON.stringify(stats), 'EX', String(CACHE_TTL)]); } catch (_) {}
    }
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ ...stats, cached: false });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach GitHub right now.' });
  }
};
