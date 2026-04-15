# IPS Freight Platform — Jerome Ave. Heavy Haul

> Freight quoting, carrier management, and lane intelligence for Astec Industries / IPS Heavy Haul.

---

## 🚀 I just want to use it

### Option A — Use it from any browser (no install)

Deploy to the internet in ~10 minutes. Free.

| Step | What to do |
|------|-----------|
| 1 | **[Deploy API to Render](https://render.com/deploy?repo=https://github.com/loadopoly/Astec-Rate-Application)** — click Deploy, wait ~5 min, copy the URL |
| 2 | **[Deploy frontend to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/loadopoly/Astec-Rate-Application&root=apps/web)** — set root dir to `apps/web`, add `VITE_API_URL` env var |
| 3 | Go back to Render → set `CORS_ORIGINS` to your Vercel URL |

📖 **Full step-by-step guide (with what to look for at each click):** [DEPLOY.md](DEPLOY.md)

---

### Option B — Run it on your computer (no internet needed)

| Windows | Mac |
|---------|-----|
| Double-click **`START.bat`** | Double-click **`START.command`** |
| Double-click **`STOP.bat`** to stop | Double-click **`STOP.command`** to stop |

That's it. The app opens in your browser automatically at **http://localhost:3000**.

📖 **First time? Need Docker?** [INSTALL.md](INSTALL.md) walks through it with no tech knowledge required.

---

## What it does

| Feature | Status |
|---------|--------|
| Operations Dashboard — KPIs, recent quotes, quick actions | ✅ Ready |
| Quotes — budget & firm freight quote management | 🔜 Phase 2 |
| Lane Intelligence — historical rate analytics by lane | 🔜 Phase 2 |
| Carriers — carrier database, contacts, performance | 🔜 Phase 2 |
| Analytics — margin analysis, win rates, trends | 🔜 Phase 2 |
| Settings | 🔜 Phase 2 |

---

## For developers

### Quick start

```bash
# Install dependencies
npm install

# Start local dev (requires Docker for the database)
npm run dev

# Build everything
npm run build

# Type-check
npm run typecheck
```

### Monorepo layout

```
apps/
  web/          Vite + React frontend
  api/          Express + TypeScript API
docker/         Dockerfiles + nginx config
.github/
  workflows/    CI pipeline (lint → test → build → migration check)
```

### Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, TanStack Query, TailwindCSS |
| Backend | Node 20, Express, TypeScript, Prisma |
| Database | PostgreSQL 16 |
| Cache | Redis (optional — app runs without it) |
| Container | Docker / Docker Compose |
| CI | GitHub Actions |
| Cloud | Render (API + DB) · Vercel (frontend) |

### Database

```bash
cd apps/api
npm run db:migrate    # create a new migration during development
npm run db:studio     # open Prisma Studio (visual DB editor)
npm run db:seed       # seed reference data
```

---

*IPS Freight Platform — Astec Industries / IPS Heavy Haul · v0.1.0*
