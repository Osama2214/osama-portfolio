# Guestbook — backend setup

The guestbook is a real serverless backend: [`api/guestbook.js`](api/guestbook.js)
runs on Vercel and stores messages in **Upstash Redis**. It needs one Redis
store and two environment variables. Until you add them, the site still works —
the guestbook shows a friendly "being set up" message and the form is disabled.

## 1. Create a Redis store (free tier)

**Easiest — from the Vercel dashboard:**

1. Open your project → **Storage** → **Create Database** → **Upstash for Redis**.
2. Pick a name and region (closest to your users), create it, and **Connect** it
   to this project.
3. Vercel automatically injects the credentials as environment variables.

That's it — Vercel's Upstash integration sets `KV_REST_API_URL` and
`KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`).
The API reads **either** naming, so you don't have to rename anything.

**Alternative — Upstash directly:** create a database at
[console.upstash.com](https://console.upstash.com), copy the **REST URL** and
**REST TOKEN**, and add them in Vercel → **Settings → Environment Variables** as:

| Variable | Value |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | the REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | the REST token |

## 2. Redeploy

Environment variables only apply to new deployments:

```bash
git push        # or: vercel --prod
```

## 3. Verify

- `GET https://your-site.vercel.app/api/guestbook` → `{ "configured": true, "entries": [] }`
- Open the site, scroll to **Guestbook**, and sign it.

## How it works

- **GET** returns the latest messages (newest first, capped at 100).
- **POST** validates name/message, strips control characters, drops bot
  submissions via a hidden honeypot field, rate-limits each IP to one post per
  30 seconds, then `LPUSH` + `LTRIM` into the `guestbook:entries` list.
- All user content is HTML-escaped on the client before rendering, so stored
  text can never inject markup.

## Tuning

Edit the constants at the top of `api/guestbook.js`:

| Constant | Meaning |
| --- | --- |
| `MAX_ENTRIES` | how many messages are kept |
| `MAX_NAME` / `MAX_MSG` | max field lengths |
| `RL_WINDOW` | seconds between posts per IP |
