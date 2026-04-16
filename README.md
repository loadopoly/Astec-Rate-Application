# IPS Freight Platform — Jerome Ave. Heavy Haul

> Freight quoting, carrier management, and lane intelligence for Astec Industries / IPS Heavy Haul.

---

## 🌐 Open the app — just click a link

The platform runs in the cloud. **No downloads. No installs. Nothing on your computer.**

Open the app in any browser:

> **https://ips-freight-api.onrender.com**

That's it. Bookmark it. Share it with your team.

> ⏱️ **First visit may take ~30 seconds** — the free-tier server wakes up on demand. Refresh once if you see a blank page.

---

## 🔧 Admin — first-time cloud setup (one time only)

> **Only one person needs to do this once.** After that, everyone else just uses the link above.

1. Sign up at **[render.com](https://render.com)** with your GitHub account — it's free
2. Click this button:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/loadopoly/Astec-Rate-Application)

3. Click **Connect** next to `Astec-Rate-Application`, then click **Apply**
4. Wait ~5 minutes → Render shows you a URL ending in `.onrender.com` → **done** ✅

One account. One button. No configuration. Share that URL with your whole team.

📖 **Stuck? Need more detail?** [DEPLOY.md](DEPLOY.md)

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

### Local development (requires Docker)

> **Not for general users.** This path requires downloading Docker Desktop and the repo ZIP.  
> See [INSTALL.md](INSTALL.md) for step-by-step instructions.

| Windows | Mac |
|---------|-----|
| Double-click **`START.bat`** | Double-click **`START.command`** |
| Double-click **`STOP.bat`** to stop | Double-click **`STOP.command`** to stop |

App opens at **http://localhost:3000**.

### Quick start (command line)

```bash
npm install        # install all workspace deps
npm run dev        # start both api + web in dev mode (requires Docker for DB)
npm run build      # build everything
npm run typecheck  # type-check all packages
```

### Monorepo layout

```
apps/
  web/          Vite + React frontend
  api/          Express + TypeScript API (also serves web/dist in production)
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
| Container | Docker / Docker Compose |
| CI | GitHub Actions |
| Cloud | Render (API + frontend + DB — single service) |

### Database

```bash
cd apps/api
npm run db:migrate    # create a new migration
npm run db:studio     # visual DB browser
npm run db:seed       # seed reference data
```

---

*IPS Freight Platform — Astec Industries / IPS Heavy Haul · v0.1.0*
