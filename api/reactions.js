/* ══════════════════════════════════════════════════════════════
   REACTIONS API — Vercel Serverless Function (Node.js, zero-dependency)

     GET  /api/reactions            → reaction counts for every project
     POST /api/reactions            → { project, type, delta:+1|-1 }

   Counts live in a Redis hash per project (reactions:<project>) with the
   fields like/love/star. Only allow-listed projects and types are accepted,
   delta is clamped to ±1, counts never go below zero, and each IP is
   rate-limited to avoid abuse. Storage is the same Upstash Redis as the guestbook.
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

const PROJECTS = ['munjez', 'munjez-website', 'pc-builder', 'osama-cafe'];
const TYPES    = ['like', 'love', 'star'];
const RL_LIMIT  = 40; // reaction actions allowed per IP per window
const RL_WINDOW = 60; // seconds

function isConfigured() { return Boolean(REDIS_URL && REDIS_TOKEN); }

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

function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  const raw = xff ? String(xff).split(',')[0] : (req.socket && req.socket.remoteAddress) || 'unknown';
  return raw.trim();
}

function emptyCounts() { return { like: 0, love: 0, star: 0 }; }

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  // ── READ ──────────────────────────────────────────────────
  if (req.method === 'GET') {
    if (!isConfigured()) return res.status(200).json({ configured: false, reactions: {} });
    try {
      const reactions = {};
      for (const p of PROJECTS) {
        const flat = await redis(['HGETALL', `reactions:${p}`]);
        const counts = emptyCounts();
        if (Array.isArray(flat)) {
          for (let i = 0; i < flat.length; i += 2) {
            const field = flat[i];
            if (TYPES.includes(field)) counts[field] = parseInt(flat[i + 1], 10) || 0;
          }
        }
        reactions[p] = counts;
      }
      return res.status(200).json({ configured: true, reactions });
    } catch (err) {
      return res.status(500).json({ error: 'Could not load reactions.' });
    }
  }

  // ── WRITE ─────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!isConfigured()) return res.status(503).json({ error: 'Reactions storage is not configured yet.' });

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};

    const project = String(body.project || '');
    const type = String(body.type || '');
    const delta = Number(body.delta);
    if (!PROJECTS.includes(project)) return res.status(400).json({ error: 'Unknown project.' });
    if (!TYPES.includes(type))       return res.status(400).json({ error: 'Unknown reaction type.' });
    if (delta !== 1 && delta !== -1) return res.status(400).json({ error: 'Invalid delta.' });

    // Rate limit: a bucket of RL_LIMIT actions per IP per window.
    try {
      const rlKey = `reactions:rl:${clientIp(req)}`;
      const n = await redis(['INCR', rlKey]);
      if (n === 1) await redis(['EXPIRE', rlKey, String(RL_WINDOW)]);
      if (n > RL_LIMIT) return res.status(429).json({ error: 'Too many reactions — slow down a moment.' });
    } catch (_) { /* never let a limiter failure block a reaction */ }

    try {
      let count = await redis(['HINCRBY', `reactions:${project}`, type, String(delta)]);
      if (typeof count === 'number' && count < 0) {
        await redis(['HSET', `reactions:${project}`, type, '0']);
        count = 0;
      }
      return res.status(200).json({ ok: true, project, type, count });
    } catch (err) {
      return res.status(500).json({ error: 'Could not save your reaction.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
};
