# IPS Freight Platform — Jerome Ave. Heavy Haul

> Freight quoting, carrier management, and lane intelligence for Astec Industries / IPS Heavy Haul.

---

## 🌐 Use it from any browser — no install (FREE)

1. Sign up at **[render.com](https://render.com)** with your GitHub account
2. Click **New → Blueprint** → connect **`Astec-Rate-Application`** → click **Apply**
3. Wait ~5 minutes → click the URL Render gives you → **you're done**

That's it. One account. No URL copying. No separate frontend deployment. No configuration.

📖 **Step-by-step with screenshots guidance:** [DEPLOY.md](DEPLOY.md)

---

## 💻 Run it on your own computer (no internet needed)

| Windows | Mac |
|---------|-----|
| Double-click **`START.bat`** | Double-click **`START.command`** |
| Double-click **`STOP.bat`** to stop | Double-click **`STOP.command`** to stop |

App opens automatically in your browser at **http://localhost:3000**.

📖 **First time? Need to install Docker first?** [INSTALL.md](INSTALL.md)

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
