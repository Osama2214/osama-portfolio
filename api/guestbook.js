/* ══════════════════════════════════════════════════════════════
   GUESTBOOK API — Vercel Serverless Function (Node.js, zero-dependency)

   A small but real backend for the portfolio:
     GET  /api/guestbook   → latest guestbook entries
     POST /api/guestbook   → add an entry { name, message }

   Storage: Upstash Redis over its REST API (works great in serverless).
   Reads the standard env vars injected by either the Upstash integration
   or Vercel KV — see GUESTBOOK_SETUP.md.

   Defensive by design: input validation, control-char stripping, output
   is escaped on the client, per-IP rate limiting, a honeypot, and a hard
   cap on how many entries are ever kept.
══════════════════════════════════════════════════════════════ */

'use strict';

// Resolve the Upstash REST credentials. We check the common names first, then
// fall back to scanning env vars — so it works whatever prefix Vercel/Upstash
// applies (e.g. STORAGE_KV_REST_API_URL). Read-only tokens are never used for writes.
function findEnv(match, reject) {
  const env = process.env;
  for (const key of Object.keys(env)) {
    if (match.test(key) && (!reject || !reject.test(key)) && env[key]) return env[key];
  }
  return undefined;
}

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  findEnv(/REST_API_URL$|REDIS_REST_URL$/);

const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  findEnv(/REST_API_TOKEN$|REDIS_REST_TOKEN$/, /READ_ONLY/);

const LIST_KEY    = 'guestbook:entries';
const MAX_ENTRIES = 100;   // never keep more than this
const MAX_NAME    = 40;
const MAX_MSG     = 280;
const MIN_LEN     = 2;
const RL_WINDOW   = 30;    // seconds a given IP must wait between posts

function isConfigured() {
  return Boolean(REDIS_URL && REDIS_TOKEN);
}

// Run one Redis command through the Upstash REST endpoint.
async function redis(command) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// Strip control characters, trim, and clamp to a max length.
function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, max);
}

function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  const raw = xff ? String(xff).split(',')[0] : (req.socket && req.socket.remoteAddress) || 'unknown';
  return raw.trim();
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  // ── READ ──────────────────────────────────────────────────
  if (req.method === 'GET') {
    if (!isConfigured()) return res.status(200).json({ configured: false, entries: [] });
    try {
      const raw = await redis(['LRANGE', LIST_KEY, '0', String(MAX_ENTRIES - 1)]);
      const entries = (raw || [])
        .map((s) => { try { return JSON.parse(s); } catch { return null; } })
        .filter(Boolean);
      return res.status(200).json({ configured: true, entries });
    } catch (err) {
      return res.status(500).json({ error: 'Could not load the guestbook.' });
    }
  }

  // ── WRITE ─────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!isConfigured()) {
      return res.status(503).json({ error: 'Guestbook storage is not configured yet.' });
    }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};

    // Honeypot: a hidden field only bots fill in. Pretend success, store nothing.
    if (body.website) return res.status(200).json({ ok: true });

    const name = clean(body.name, MAX_NAME);
    const message = clean(body.message, MAX_MSG);
    if (!name || !message)        return res.status(400).json({ error: 'Name and message are required.' });
    if (name.length < MIN_LEN)    return res.status(400).json({ error: 'That name is too short.' });
    if (message.length < MIN_LEN) return res.status(400).json({ error: 'That message is too short.' });

    // Per-IP rate limit (best-effort: never let a limiter failure block a real post).
    try {
      const rlKey = `guestbook:rl:${clientIp(req)}`;
      const set = await redis(['SET', rlKey, '1', 'NX', 'EX', String(RL_WINDOW)]);
      if (set === null) {
        return res.status(429).json({ error: 'You just posted — please wait a moment before posting again.' });
      }
    } catch (_) { /* ignore limiter errors */ }

    const entry = { name, message, at: Date.now() };
    try {
      await redis(['LPUSH', LIST_KEY, JSON.stringify(entry)]);
      await redis(['LTRIM', LIST_KEY, '0', String(MAX_ENTRIES - 1)]);
      return res.status(201).json({ ok: true, entry });
    } catch (err) {
      return res.status(500).json({ error: 'Could not save your message.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed.' });
};
