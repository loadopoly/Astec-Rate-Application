# Changelog

All notable changes to the IPS Freight Platform are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.1] — 2026-04-16

### Fixed

- **Render deploy build failure** — `npm install --include=dev` did not reliably
  install devDependencies when `NODE_ENV=production` was set by Render's
  environment. Replaced with `NODE_ENV=development npm install` in the
  `render.yaml` buildCommand so build tools (TypeScript, Vite, Prisma CLI) are
  always available during the build step.

## [0.1.0] — 2026-04-15

### Added

- Operations Dashboard with KPIs, recent quotes, and quick actions.
- Express API server serving the React frontend from the same origin.
- Prisma schema with full data model (Users, Sites, Carriers, Quotes, Lanes,
  Bids, Equipment, Products, Audit Logs).
- One-click Render Blueprint deploy (`render.yaml`).
- Docker Compose local development environment (PostgreSQL, Redis, API, Web).
- GitHub Actions CI pipeline (lint, test, build, migration check).
- Vite + React 18 frontend with TailwindCSS and TanStack Query.
- Health check endpoints (`/health`, `/health/detailed`, `/health/ready`,
  `/health/live`).
