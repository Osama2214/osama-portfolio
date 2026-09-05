/* ══════════════════════════════════════════════════════════════
   OSAMA AHMED PORTFOLIO — DEV & PRODUCTION WEB SERVER
   Supports static files, clean URLs, and Vercel serverless functions locally.
══════════════════════════════════════════════════════════════ */

'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const ROOT_DIR = __dirname;

// Import serverless API handlers
const githubHandler = require('./api/github.js');
const reactionsHandler = require('./api/reactions.js');

// ── Security & Utility Headers ──────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  next();
});

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serverless API Endpoints ────────────────────────────────
app.all('/api/github', async (req, res, next) => {
  try {
    await githubHandler(req, res);
  } catch (err) {
    next(err);
  }
});

app.all('/api/reactions', async (req, res, next) => {
  try {
    await reactionsHandler(req, res);
  } catch (err) {
    next(err);
  }
});

// ── AI Discovery & Search Engine Routes ─────────────────────
app.get('/llms.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(ROOT_DIR, 'llms.txt'));
});

app.get('/llms-full.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(ROOT_DIR, 'llms-full.txt'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(ROOT_DIR, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(ROOT_DIR, 'sitemap.xml'));
});

// ── Static Files (with clean URLs support) ──────────────────
app.use(express.static(ROOT_DIR, {
  extensions: ['html', 'htm'],
  index: 'index.html',
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Root route explicit fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// ── 404 Fallback ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT_DIR, '404.html'));
});

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ── Start Server ────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Osama Portfolio Dev Server is LIVE!`);
  console.log(`   ➜ Local:    http://localhost:${PORT}`);
  console.log(`   ➜ Network:  http://0.0.0.0:${PORT}`);
  console.log(`   ➜ Mode:     ${process.env.NODE_ENV || 'development'}`);
  console.log(`======================================================\n`);
});

// ── Graceful Shutdown ───────────────────────────────────────
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
