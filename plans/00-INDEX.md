# EPCT Catalogue — Plans Index

Workspace-local copy of all planning documents for the EPCT catalogue project. The active build path is **02-local-development.md** (start here); **03-vps-deployment.md** resumes after the local app is feature-complete.

## Files

- `00-INDEX.md` — this file
- `01-branding.md` — brand identity, palette, typography (locked Day 2 of local dev)
- `02-local-development.md` — **ACTIVE PHASE** — local-only build (~16 days), Postgres + MinIO in Docker, app via `pnpm dev`
- `03-vps-deployment.md` — deferred — full VPS plan (shared Nginx + certbot proxy, kh_store cutover, CI/CD, backups)

## Workspace structure

```
CAB/
├── plans/                  ← you are here
├── inspiration/            ← reference images (you add)
├── public/img/             ← logo + brand assets (you add)
└── (epct app scaffold once we exit plan mode)
```

## Status snapshot

| Decision | Locked value |
|---|---|
| Stack | Next.js 15 + Payload CMS 3 + PostgreSQL 16 + MinIO |
| Local dev | Docker Compose for services only; `pnpm dev` for app |
| Language at launch | French only (i18n scaffolded) |
| Media storage | MinIO (local + prod) |
| Reverse proxy (prod) | Shared hand-rolled Nginx + certbot at `/srv/docker/nginx-proxy/` |
| VPS | 6 vCPU / 12 GB / 100 GB NVMe, shared with kh_store WordPress |
| Off-site backup | Deferred to Phase 5 (B2 recommended) |
| Brand palette | Green industrial — exact hex extracted from logo on Day 2 |

## Next action

Confirm this layout and say **go** → I exit plan mode and start Phase 0.1 (repo scaffold + `docker-compose.dev.yml`).
