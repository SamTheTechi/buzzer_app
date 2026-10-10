# Quiz Buzzer

Realtime quiz buzzer. A host creates a room, players join with a room code, and the host sees live player and buzz updates over Socket.IO.

```
quiz/
  backend/    Express + Socket.IO server (port 3000)
  frontend/   Vite + React client (port 5173)
```

## Local dev

Backend:

```sh
npm install
npm run dev
```

Frontend (in a second terminal):

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend connects to `http://localhost:3000` by default.

## Env config

Backend (`backend/.env`, see `example.env`):

| Var | Required | What it does |
| --- | --- | --- |
| `PORT` | No (Render sets it) | Defaults to `3000` locally |
| `CORS_ORIGIN` | No | If set, only that frontend origin is allowed. If unset, the backend reflects any origin, so you can redeploy the frontend without touching the backend |
| `REDIS_URL` | No | Currently unused (rooms are stored in memory) |

Frontend (Vercel env var or local `.env`):

| Var | Required | What it does |
| --- | --- | --- |
| `VITE_BACKEND_URL` | Yes in production | Backend URL, e.g. `https://your-backend.onrender.com` (no trailing slash). Baked in at build time, so changing it requires a redeploy. Defaults to `http://localhost:3000` locally |

## Deploy backend to Render

1. Push this repo to GitHub.
2. In [Render](https://dashboard.render.com), click **New > Web Service** and connect the repo.
3. Use these settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/ping` (returns `{ "ok": "pong" }`)
4. Click **Deploy**. Copy your backend URL, e.g. `https://quiz-buzzer.onrender.com`.
5. Verify: open `https://quiz-buzzer.onrender.com/ping` — you should see `{"ok":"pong"}`.

Note: Render's free tier sleeps after inactivity, so the first socket connection after idle can take ~30s.

## Deploy frontend to Vercel

1. In [Vercel](https://vercel.com/new), import the same repo.
2. Use these settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist` (auto)
3. Under **Environment Variables**, add:
   - `VITE_BACKEND_URL=https://quiz-buzzer.onrender.com` (your Render URL, no trailing slash)
4. Click **Deploy**. This repo already includes `frontend/vercel.json` with an SPA rewrite so `/host` and `/play/:roomCode` work on refresh and direct links.
5. Verify: open your `https://...vercel.app`, create a room as host, join from another browser/device with the room code, and buzz.

If you change `VITE_BACKEND_URL`, redeploy (Vercel > Deployments > Redeploy) since Vite bakes it in at build time.

## Troubleshooting

- **CORS / `connect_error`:** backend URL wrong or unreachable. Check `VITE_BACKEND_URL` has no trailing slash and the Render service is awake. Open `<backend>/ping` directly.
- **Changed env but nothing happened:** frontend env is build-time — redeploy on Vercel. Backend env needs a Render restart/redeploy.
- **404 on `/host` refresh:** missing `frontend/vercel.json` rewrite — it is included, don't delete it.
- **Works locally, slow in production:** Render free-tier cold start — wait ~30s and retry.
