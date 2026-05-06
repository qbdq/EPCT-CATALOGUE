# EPCT Catalogue Website — VPS Self-Hosted Build Plan

End-to-end plan to ship a production Next.js 15 + Payload CMS 3 catalogue site for EPCT, fully self-hosted on a shared 6 vCPU / 12 GB VPS using Docker, MinIO for media, behind a **shared hand-rolled Nginx + certbot proxy** that also takes over routing for the existing `kh_store` WordPress site, French-only at launch with i18n scaffolding, and zero-downtime GitHub Actions deploys.

---

## 0. Confirmed Inputs (from clarifying Qs)

- **Media storage:** MinIO (self-hosted, S3-compatible) container.
- **VPS:** 6 vCPU, 12 GB RAM, 100 GB NVMe SSD, **shared** with other apps (currently runs `kh_store` WordPress at `kh-store.sgt-tunisie.com` with its own embedded nginx on host 80/443).
- **i18n at launch:** French only; next-intl + Payload localized fields scaffolded but EN/AR deferred.
- **Domain:** Not registered yet → registrar checklist + `epct.local` for dev / `staging.epct.tn` placeholder.
- **Off-site backup:** Deferred to Phase 5; daily local `pg_dump` + MinIO snapshot from day 1, B2 documented as recommended target.
- **Reverse proxy:** **Shared hand-rolled Nginx + certbot** stack at `/srv/docker/nginx-proxy/`, owning host 80/443 for ALL sites on the VPS. EPCT and kh_store both sit behind it, routed by `server_name`. Phase 1 includes migrating kh_store off its embedded nginx onto the shared proxy.

---

## 🧠 Architecture Reasoning

**Critical-path decisions made upfront (costly to change later):**

1. **DB driver = `@payloadcms/db-postgres`** (not Mongo). Locks schema migrations to Drizzle/Payload SQL push; downstream affects backup, queries, Docker image.
2. **`output: 'standalone'`** in `next.config.ts` — required to keep runner image < 500 MB and to be Docker-friendly. Must be set before first Dockerfile is written.
3. **Single monorepo, single container for Next.js + Payload admin** — Payload 3 mounts into the App Router under `(payload)`. No separate admin service.
4. **MinIO bucket name and access keys** — Payload media adapter (`@payloadcms/storage-s3`) needs them at boot; baking the wrong endpoint into seeded media records means re-uploading.
5. **URL slug strategy** — Payload `beforeChange` hook generates slugs once; changing later breaks SEO + ISR keys.
6. **ISR via on-demand `revalidatePath`** — webhook contract between Payload `afterChange` hook and `/api/revalidate` must be defined before frontend pages cache.
7. **Docker network isolation** — `postgres` and `minio` MUST NOT publish ports to host (shared VPS = exposed = compromised). Only `nginx` binds host ports.

**Self-hosting–specific risks:**

- **Shared VPS port contention** — confirmed EPCT owns 80/443; still must avoid other apps' container names/networks. Use prefixed names (`epct_app`, `epct_postgres`, network `epct_network`).
- **Memory pressure** — 12 GB shared. Cap Node `--max-old-space-size=1536`, Postgres `shared_buffers=512MB`, MinIO is light. Total target < 3 GB steady-state.
- **DB data loss** — single volume = single point of failure. Daily `pg_dump` to mounted host dir + weekly tarball; document B2 wiring.
- **SSL expiry** — certbot renew cron + nginx reload sidecar; alert on cert age > 60 days.
- **Zero-downtime deploy** — Next.js standalone + Docker healthcheck + `docker compose up -d --no-deps app` with `start_period` long enough for Payload boot (~25 s).
- **MinIO public read** — bucket must allow anonymous GET on `/epct-media/*` for browser image loads, but Nginx fronts it under `/media/` to keep TLS + caching uniform.
- **Build cache footprint** — pnpm store + Next cache can balloon; prune in CI.

**Why these choices fit the VPS context:**

- Standalone mode → no `node_modules` copy at runtime → faster cold start, smaller image, easier rollback (just swap image tag).
- Nginx serves `_next/static` and MinIO assets via `proxy_pass` with long `Cache-Control` → offloads Node and MinIO CPU.
- Postgres in a separate container with a named volume → upgrade Postgres major versions without touching app data path.

---

## 1. Project Architecture

### 1a. VPS filesystem layout

```
/srv/docker/
├── nginx-proxy/                 ← shared, owns host 80/443
│   ├── docker-compose.yml       # nginx + certbot only
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── conf.d/
│   │       ├── 00-default.conf      # catch-all, returns 444
│   │       ├── kh-store.conf        # kh-store.sgt-tunisie.com → kh_store_wp:80
│   │       ├── epct.conf            # epct.tn → epct_app:3000 + /media/ → epct_minio:9000
│   │       └── security-headers.conf
│   ├── certbot/
│   │   ├── init-letsencrypt.sh
│   │   └── renew.sh
│   └── volumes/                 # named volumes referenced from compose
└── projects/
    ├── kh_store/                ← WordPress only (no nginx)
    │   └── docker-compose.yml
    └── epct/                    ← this repo, deployed here
        └── docker-compose.yml   # app + postgres + minio + minio-init
```

All three Compose stacks attach to one **external Docker network `proxy_net`** created by the `nginx-proxy` stack:

```bash
docker network create proxy_net
```

Per-app private networks (`epct_internal`, `kh_store_internal`) keep DBs isolated; only the public-facing container (`epct_app`, `kh_store_wp`) joins `proxy_net`.

### 1b. EPCT repo (committed to git)

```
epct/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # lint + typecheck + build on PR
│       └── deploy.yml                  # build image + ssh deploy on main
├── .vscode/
│   └── settings.json
├── docker/
│   ├── postgres/
│   │   └── init.sql                    # CREATE EXTENSION pg_trgm, etc.
│   ├── minio/
│   │   └── init-bucket.sh              # mc mb + anonymous policy
│   ├── nginx-snippet/
│   │   └── epct.conf.example           # vhost to drop into /srv/docker/nginx-proxy/nginx/conf.d/
│   └── backup/
│       ├── backup.sh                   # pg_dump + minio mirror
│       └── restore.sh                  # interactive restore helper
├── scripts/
│   ├── seed.ts                         # seed categories/brands/products
│   └── generate-secret.ts              # PAYLOAD_SECRET helper
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx              # root frontend layout (Header/Footer/Lenis)
│   │   │   ├── page.tsx                # /
│   │   │   ├── catalogue/
│   │   │   │   ├── page.tsx            # /catalogue (filters)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # /catalogue/[slug]
│   │   │   ├── categories/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── marques/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── error.tsx
│   │   ├── (payload)/
│   │   │   ├── admin/
│   │   │   │   └── [[...segments]]/
│   │   │   │       ├── page.tsx        # Payload admin entry
│   │   │   │       └── not-found.tsx
│   │   │   ├── api/                    # Payload REST/GraphQL
│   │   │   │   └── [...slug]/route.ts
│   │   │   ├── custom.scss
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts        # POST contact form
│   │   │   ├── revalidate/route.ts     # on-demand ISR webhook
│   │   │   ├── health/route.ts         # docker healthcheck
│   │   │   └── sitemap-data/route.ts   # used by next-sitemap at build
│   │   ├── robots.ts                   # dynamic robots.txt
│   │   ├── sitemap.ts                  # dynamic sitemap (alt to next-sitemap)
│   │   ├── layout.tsx                  # absolute root (html/body, fonts)
│   │   └── globals.css
│   ├── payload/
│   │   ├── payload.config.ts
│   │   ├── collections/
│   │   │   ├── Products.ts
│   │   │   ├── Categories.ts
│   │   │   ├── Brands.ts
│   │   │   ├── ContactSubmissions.ts
│   │   │   ├── Media.ts
│   │   │   └── Users.ts
│   │   ├── globals/
│   │   │   └── GlobalSettings.ts
│   │   ├── hooks/
│   │   │   ├── slugify.ts
│   │   │   └── revalidate.ts
│   │   ├── access/
│   │   │   ├── isAdmin.ts
│   │   │   └── publicRead.ts
│   │   └── fields/
│   │       ├── slug.ts                 # reusable slug field
│   │       └── seo.ts                  # reusable SEO group
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── LenisProvider.tsx       # client
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── BrandStrip.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   └── IntroSection.tsx
│   │   ├── catalogue/
│   │   │   ├── FilterSidebar.tsx       # client
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SearchBar.tsx           # client
│   │   │   └── EmptyState.tsx
│   │   ├── product/
│   │   │   ├── ImageGallery.tsx        # client
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── SpecsTable.tsx
│   │   │   ├── WhatsAppCTA.tsx         # client
│   │   │   └── RelatedProducts.tsx
│   │   ├── contact/
│   │   │   └── ContactForm.tsx         # client
│   │   ├── seo/
│   │   │   ├── JsonLdOrganization.tsx
│   │   │   ├── JsonLdLocalBusiness.tsx
│   │   │   ├── JsonLdProduct.tsx
│   │   │   └── JsonLdBreadcrumbs.tsx
│   │   └── ui/                         # shadcn/ui generated
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── dialog.tsx
│   │       ├── sheet.tsx
│   │       ├── badge.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── payload.ts                  # getPayload() singleton
│   │   ├── queries/
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── brands.ts
│   │   │   └── settings.ts
│   │   ├── seo/
│   │   │   ├── defaultMetadata.ts
│   │   │   └── buildMetadata.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── slugify.ts
│   │   │   ├── whatsapp.ts
│   │   │   └── format.ts
│   │   ├── email/
│   │   │   └── sendContactEmail.ts     # nodemailer
│   │   └── constants.ts
│   ├── styles/
│   │   └── tailwind.css
│   ├── types/
│   │   └── payload-types.ts            # generated by Payload
│   └── middleware.ts                   # i18n-ready, CSP nonce
├── public/
│   ├── favicon.ico
│   ├── robots.txt                      # static fallback
│   ├── images/
│   │   └── logo.svg
│   └── fonts/
├── .env.example
├── .env.local                          # gitignored
├── .dockerignore
├── .gitignore
├── .editorconfig
├── .prettierrc
├── .eslintrc.json
├── docker-compose.yml                  # production
├── docker-compose.dev.yml              # dev override
├── docker-compose.backup.yml           # backup container (cron)
├── Dockerfile
├── next.config.ts
├── next-sitemap.config.cjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 2. Docker Configuration

> Split into two independent Compose stacks: the **shared proxy stack** (`/srv/docker/nginx-proxy/`) and the **EPCT app stack** (`/srv/docker/projects/epct/`). They communicate over the external `proxy_net` Docker network.

### 2a. `Dockerfile` (multi-stage, target < 500 MB)

- **Stage `deps`** (`node:20-alpine`): install `corepack` → `pnpm`; copy `package.json`, `pnpm-lock.yaml`; `pnpm fetch` then `pnpm install --offline --frozen-lockfile`.
- **Stage `builder`** (`node:20-alpine`): copy source + `node_modules`; `pnpm payload generate:types` then `pnpm build` (Next.js standalone).
- **Stage `runner`** (`node:20-alpine`): `apk add --no-cache curl tini`; `addgroup -S nodejs && adduser -S -G nodejs nextjs`; copy `.next/standalone`, `.next/static`, `public`, and the Payload admin assets; `USER nextjs`; `EXPOSE 3000`; `ENTRYPOINT ["/sbin/tini","--"]`; `CMD ["node","server.js"]`. Set `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`, `NODE_OPTIONS=--max-old-space-size=1536`.
- Healthcheck via `curl -f http://localhost:3000/api/health || exit 1`.

### 2b. EPCT `docker-compose.yml` (production)

Services (no nginx, no certbot — those live in the shared proxy stack):

- **`app`** (container_name `epct_app`) — `image: ghcr.io/<org>/epct:${IMAGE_TAG:-latest}`, `env_file: .env`, `depends_on: { postgres: { condition: service_healthy }, minio: { condition: service_healthy } }`, `restart: unless-stopped`, healthcheck on `/api/health`, `start_period: 40s`. Networks: `[epct_internal, proxy_net]` — only this container is reachable from the proxy. **No `ports:` block** (host port 80/443 owned by shared proxy).
- **`postgres`** (container_name `epct_postgres`) — `postgres:16-alpine`, env `POSTGRES_DB/USER/PASSWORD`, volume `pgdata:/var/lib/postgresql/data`, `./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro`, **no `ports:`**, healthcheck `pg_isready -U $$POSTGRES_USER`, `restart: unless-stopped`, `command: ["postgres","-c","shared_buffers=512MB","-c","max_connections=50"]`, networks: `[epct_internal]`.
- **`minio`** (container_name `epct_minio`) — `minio/minio:latest`, env `MINIO_ROOT_USER/PASSWORD`, volume `minio_data:/data`, `command: server /data --console-address ":9001"`, **no host ports**, healthcheck on `/minio/health/live`, networks: `[epct_internal, proxy_net]` (proxy reaches it for `/media/`).
- **`minio-init`** — `minio/mc`, runs `init-bucket.sh` once (creates `epct-media`, sets anonymous read policy), `restart: "no"`, networks: `[epct_internal]`.
- **`umami`** (Phase 5, optional) — `ghcr.io/umami-software/umami:postgresql-latest`, with its own `umami_postgres` service, joins `proxy_net` so the shared nginx can route `analytics.epct.tn` → `epct_umami:3000`.

```yaml
networks:
  epct_internal:
    driver: bridge
  proxy_net:
    external: true
volumes:
  pgdata:
  minio_data:
  umami_pgdata:
```

### 2b-bis. Shared proxy stack `/srv/docker/nginx-proxy/docker-compose.yml`

Owned outside the EPCT git repo (lives on the VPS, version-controlled in a separate `infra` repo or directly on disk).

- **`nginx`** — `nginx:alpine`, `container_name: shared_nginx`, `ports: ["80:80","443:443"]`, volumes: `./nginx/nginx.conf:/etc/nginx/nginx.conf:ro`, `./nginx/conf.d:/etc/nginx/conf.d:ro`, `letsencrypt:/etc/letsencrypt:ro`, `certbot_www:/var/www/certbot:ro`, `nginx_logs:/var/log/nginx`, `restart: unless-stopped`, networks: `[proxy_net]`. Healthcheck `nginx -t`.
- **`certbot`** — `certbot/certbot`, volumes: `letsencrypt:/etc/letsencrypt`, `certbot_www:/var/www/certbot`, loop entrypoint runs `certbot renew --webroot -w /var/www/certbot --quiet --post-hook "docker exec shared_nginx nginx -s reload"` every 12 h. (Post-hook needs Docker socket mount or a sidecar — alternative: host cron triggers `docker compose exec certbot certbot renew && docker compose exec nginx nginx -s reload`.)

```yaml
networks:
  proxy_net:
    external: true
    name: proxy_net
volumes:
  letsencrypt:
  certbot_www:
  nginx_logs:
```

**Reload contract:** any vhost change (new `.conf`, cert renewal) → `docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload`. Validation **before** reload prevents bringing all sites down on a typo.

### 2c. `docker-compose.dev.yml` (override)

- `app`: `build: .`, `target: builder`, `command: pnpm dev`, mount `./src:/app/src`, `./public:/app/public`, anonymous volume on `/app/node_modules`, `ports: ["3000:3000"]`.
- `postgres`: add `ports: ["5432:5432"]` for TablePlus.
- `minio`: expose `9000:9000` and `9001:9001` (console).
- Omit `nginx`, `certbot`.
- Run: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`.

### 2d. Nginx vhost `/srv/docker/nginx-proxy/nginx/conf.d/epct.conf` (key directives)

> Shipped from the EPCT repo as `docker/nginx-snippet/epct.conf.example`; copied into the shared proxy on deploy.

- `limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;`
- `limit_req_zone $binary_remote_addr zone=admin:10m rate=5r/s;`
- HTTP server (`:80`) → ACME `/.well-known/acme-challenge/` location → `301` redirect to HTTPS for everything else.
- HTTPS server (`:443 ssl http2`):
  - `ssl_certificate /etc/letsencrypt/live/epct.tn/fullchain.pem;`
  - Modern cipher suite (Mozilla intermediate), OCSP stapling, `ssl_session_cache shared:SSL:10m`.
  - `client_max_body_size 25m;` for image uploads.
  - Gzip on for `text/* application/json application/javascript image/svg+xml`.
  - **Static**: `location ~ ^/_next/static/ { proxy_pass http://epct_app:3000; expires 1y; add_header Cache-Control "public, immutable"; }`
  - **Media** (proxy MinIO): `location /media/ { proxy_pass http://epct_minio:9000/epct-media/; expires 30d; add_header Cache-Control "public"; }`
  - **API rate limit**: `location /api/ { limit_req zone=api burst=20 nodelay; proxy_pass http://epct_app:3000; }`
  - **Admin rate limit + optional basic auth**: `location /admin { limit_req zone=admin burst=5; auth_basic "EPCT Admin"; auth_basic_user_file /etc/nginx/.htpasswd; proxy_pass http://epct_app:3000; }` (basic auth optional toggle).
  - **Default**: `location / { proxy_pass http://epct_app:3000; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; }`
  - Includes `security-headers.conf`: HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, `Permissions-Policy`, CSP (with `'unsafe-inline'` for Payload admin where required, scoped to `/admin`).

### 2e. `/srv/docker/nginx-proxy/certbot/init-letsencrypt.sh`

Generic per-domain script (used for both `epct.tn` and `kh-store.sgt-tunisie.com`): 1) drop a temporary HTTP-only vhost that exposes `/.well-known/acme-challenge/`, 2) `docker compose up -d nginx`, 3) `docker compose run --rm certbot certbot certonly --webroot -w /var/www/certbot --staging -d <domain>` to validate flow, 4) on success rerun without `--staging`, 5) swap in the full HTTPS vhost, 6) `docker compose exec nginx nginx -t && nginx -s reload`.

### 2f. `.env.example`

```env
# --- App ---
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://epct.tn
PORT=3000

# --- Payload ---
PAYLOAD_SECRET=                  # 32+ char random, generate with: openssl rand -hex 32
NEXT_PUBLIC_PAYLOAD_URL=https://epct.tn

# --- PostgreSQL ---
POSTGRES_DB=epct_db
POSTGRES_USER=epct_user
POSTGRES_PASSWORD=               # strong, 24+ chars
DATABASE_URI=postgresql://epct_user:${POSTGRES_PASSWORD}@postgres:5432/epct_db

# --- MinIO ---
MINIO_ROOT_USER=epct_admin
MINIO_ROOT_PASSWORD=             # strong
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_BUCKET=epct-media
MINIO_PUBLIC_URL=https://epct.tn/media   # browser-facing prefix

# --- Email (contact form) ---
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="EPCT <noreply@epct.tn>"
CONTACT_EMAIL=epctunisie@gmail.com

# --- Revalidation ---
REVALIDATE_SECRET=               # shared secret between Payload hook and /api/revalidate

# --- Umami (Phase 5) ---
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=https://analytics.epct.tn
```

VPS file permissions: `chmod 600 .env` and `chown root:root .env`.

---

## 3. CMS Collections Schema

> Notation: `field` *(type, required?)* — admin label · validation · hooks.

### `Products`

- `name` *(text, req)* — "Nom du produit" · 2–120 chars.
- `slug` *(text, req, unique, indexed)* — auto from `name` via `slugify` `beforeChange`; admin readonly with override.
- `reference` *(text, req, unique)* — internal SKU.
- `shortDescription` *(textarea, req)* — max 200 chars (used in cards + meta description fallback).
- `fullDescription` *(richText - lexical)*.
- `sizes` *(array)* with subfields `label` *(text)* and `value` *(text)*.
- `additionalInfo` *(richText, optional)*.
- `images` *(array, min 1, max 10)* of `upload → media` with `alt` *(text, req)*.
- `category` *(relationship → categories, req)*.
- `brand` *(relationship → brands, req, hasMany: false)*.
- `compatibleBrands` *(relationship → brands, hasMany)* — for multi-brand parts.
- `featured` *(checkbox, default false)*.
- `active` *(checkbox, default true)* — gates public visibility.
- `seo` *(group)*: `title` *(text)*, `description` *(textarea)*, `ogImage` *(upload)*.
- Hooks: `beforeChange: [slugify('name','slug')]`, `afterChange: [revalidate(['/', '/catalogue', '/catalogue/'+slug, '/categories/'+category.slug, '/marques/'+brand.slug])]`, `afterDelete: [revalidate(...)]`.
- Access: `read: publicRead(active)`, others: `isAdmin`.
- Admin: `useAsTitle: 'name'`, `defaultColumns: ['name','reference','category','brand','active','featured']`.

### `Categories`

- `name`, `slug` (auto), `description` *(textarea)*, `icon` *(upload, optional)*, `image` *(upload, optional)* (hero), `order` *(number, default 0)*, `seo` group.
- Hooks: slugify, revalidate `['/categories/'+slug, '/']`.

### `Brands`

- `name`, `slug` (auto), `logo` *(upload, req)*, `description` *(textarea)*, `compatibleWith` *(array of text)* — legacy free-text compatibility list, `website` *(text, url)*, `order` *(number)*, `seo` group.
- Hooks: slugify, revalidate `['/marques', '/marques/'+slug]`.

### `ContactSubmissions`

- `name`, `email` *(email, req)*, `phone` *(text)*, `subject` *(text)*, `message` *(textarea, req)*, `productRef` *(text, optional)* — set when submitted from product page.
- `read` *(checkbox, default false)*, `notes` *(textarea, admin only)*, `submittedAt` *(date, auto)*.
- Access: `create: anyone`, `read/update/delete: isAdmin`.
- `afterChange` (on create): send email via `sendContactEmail`.

### `Media`

- Payload built-in upload collection wired to `@payloadcms/storage-s3` adapter pointing at MinIO.
- Image sizes generated: `thumbnail` 300×300, `card` 600×600, `hero` 1600×900.
- Required: `alt` text. Mime types: `image/jpeg, image/png, image/webp, image/svg+xml`.
- Public read; write `isAdmin`.

### `Users`

- Payload built-in auth. Roles: `admin`, `editor`. Disable open registration.

### `GlobalSettings` (global, singleton)

- `companyName`, `tagline`, `phone`, `whatsappNumber`, `email`, `address` *(textarea)*, `googleMapsUrl`, `hours` *(text, default "Ouvert 24h/24")*.
- Social: `facebook`, `tiktok`, `instagram`.
- Homepage: `heroTitle`, `heroSubtitle`, `heroImage` *(upload)*, `introTitle`, `introText` *(richText)*.
- SEO defaults: `defaultTitle`, `titleTemplate` (e.g. `%s | EPCT`), `defaultDescription`, `defaultOgImage`.
- `afterChange`: revalidate `['/']` + tag `'global-settings'`.

---

## 4. URL Structure & Routing Map

| Route | Strategy | Cache / Revalidate | Notes |
|---|---|---|---|
| `/` | SSG + ISR | tag `home`, `revalidate: 3600` | Featured products + categories from Payload. |
| `/catalogue` | SSR (dynamic = `force-dynamic`) | n/a | Filters via search params; reads server-side. |
| `/catalogue/[slug]` | SSG + ISR | tag `product:${slug}`, `revalidate: 3600` | `generateStaticParams` for active products. |
| `/categories/[slug]` | SSG + ISR | tag `category:${slug}`, `revalidate: 3600` | |
| `/marques` | SSG + ISR | tag `brands`, `revalidate: 86400` | |
| `/marques/[slug]` | SSG + ISR | tag `brand:${slug}`, `revalidate: 3600` | |
| `/contact` | SSG | static | Form is client component → `/api/contact`. |
| `/api/contact` | Node runtime | no cache | rate-limited at Nginx. |
| `/api/revalidate` | Node runtime | no cache | Validates `x-revalidate-secret`, calls `revalidatePath`/`revalidateTag`. |
| `/api/health` | Node runtime | no cache | Returns 200 if Payload boots + DB ping ok. |
| `/sitemap.xml` | App Router `sitemap.ts` | revalidate 3600 | Pulls products/categories/brands from Payload. |
| `/robots.txt` | App Router `robots.ts` | static | Disallow `/admin`, `/api`. |
| `/admin/**` | Payload | n/a | Nginx basic-auth optional; rate-limited. |

**On-demand ISR contract:** Payload `afterChange` hook computes affected paths/tags → `fetch(NEXT_PUBLIC_SITE_URL + '/api/revalidate', { method: 'POST', headers: { 'x-revalidate-secret': REVALIDATE_SECRET }, body: JSON.stringify({ paths, tags }) })`. The route calls `revalidatePath` / `revalidateTag` for each.

---

## 5. SEO Implementation Plan

- **`buildMetadata({ title, description, path, ogImage })`** helper used by every page's `generateMetadata`, falling back to `GlobalSettings.seo` defaults. Title template `"%s | EPCT"`.
- **Open Graph + Twitter** from same helper. Default OG image is GlobalSettings hero.
- **JSON-LD components** (Server Components, render `<script type="application/ld+json">`):
  - `JsonLdOrganization` — site root layout (name, logo, sameAs Facebook/TikTok, contactPoint phone).
  - `JsonLdLocalBusiness` — homepage + contact (address, geo, openingHours `Mo-Su 00:00-23:59`).
  - `JsonLdProduct` — product page (name, sku=reference, image[], brand, category, description; **no `offers`/price** since not e-commerce — use `Product` only).
  - `JsonLdBreadcrumbs` — every nested page.
- **Sitemap:** prefer App Router `app/sitemap.ts` (no extra build step) — pulls active products/categories/brands. Priorities: `/` 1.0, `/catalogue` 0.9, products 0.8, categories 0.7, brands 0.6. `changeFrequency: 'weekly'`.
- **`robots.txt`** (`app/robots.ts`):
  ```
  User-agent: *
  Allow: /
  Disallow: /admin
  Disallow: /api
  Sitemap: https://epct.tn/sitemap.xml
  ```
- **Keyword → page map:**
  - Homepage: "pièces pompe à béton Tunisie" (primary), "EPCT", "concrete pump spare parts Tunisia".
  - `/categories/pompe-a-beton`: "pièces pompe à béton", "maintenance pompe béton".
  - `/categories/toupie`: "pièces toupie béton", "camion malaxeur Tunisie".
  - `/categories/centrales-a-beton`: "centrales à béton Tunisie".
  - `/marques/putzmeister` etc.: "{brand} Tunisie pièces détachées".

---

## 6. Performance Architecture (VPS)

- **Standalone output**: `next.config.ts` → `output: 'standalone'`, `experimental.outputFileTracingRoot` set to monorepo root, ensures Payload deps copied.
- **Node memory**: `NODE_OPTIONS=--max-old-space-size=1536` (1.5 GB cap, leaves room for Postgres + other VPS apps).
- **Postgres pool**: Payload's `pg` pool `max: 10`, `idleTimeoutMillis: 30000` — matches `max_connections=50` with headroom.
- **Nginx static**: serve `_next/static` with `immutable` 1y cache; serve `/media/` (MinIO) with 30 d cache + `stale-while-revalidate`.
- **Brotli** (optional): swap `nginx:alpine` for `fholzer/nginx-brotli` if size-sensitive; gzip is fine for v1.
- **Image pipeline**: Next/Image with custom `loader` that points to MinIO via `/media/...`; pre-resized variants generated by Payload at upload (thumbnail/card/hero) → Next/Image picks the right one. Avoids on-the-fly resize on VPS.
- **Lazy hydrate**: client components limited to gallery, filter sidebar, contact form, mobile nav, Lenis provider.
- **Lenis**: only mount on viewport ≥ md to spare mobile CPU; respect `prefers-reduced-motion`.
- **Core Web Vitals targets**: LCP < 2.5 s (homepage hero priority + preload), CLS < 0.1 (reserved aspect ratios on images), INP < 200 ms (defer Framer Motion to client).

---

## 7. Component Architecture

> S = Server Component, C = Client Component.

**Layout (S unless noted):** `Header` (S, Sheet trigger inside C wrapper), `MobileNav` (C), `Footer` (S), `LenisProvider` (C), `ThemeProvider` (C, dark mode).

**Homepage:** `Hero { title, subtitle, image }` (S), `CategoryGrid { categories }` (S), `BrandStrip { brands }` (S), `FeaturedProducts { products }` (S), `IntroSection { title, body }` (S).

**Catalogue:** `FilterSidebar { categories, brands, sizes, selected }` (C — reads `useSearchParams`, pushes to URL), `SearchBar { initialQuery }` (C, debounced), `ProductGrid { products }` (S), `ProductCard { product }` (S), `EmptyState` (S), `Pagination { page, totalPages }` (S, link-based).

**Product detail:** `ImageGallery { images }` (C — keyboard + swipe), `SpecsTable { reference, sizes }` (S), `SizeSelector { sizes }` (C, optional), `WhatsAppCTA { product }` (C), `RelatedProducts { products }` (S).

**Contact:** `ContactForm { defaultProductRef? }` (C — react-hook-form + zod).

**SEO:** `JsonLdOrganization`, `JsonLdLocalBusiness`, `JsonLdProduct`, `JsonLdBreadcrumbs` (all S).

**UI primitives:** shadcn-generated Button, Input, Textarea, Select, Dialog, Sheet, Badge, Skeleton, Toast.

Each component file exports a TS `Props` interface matching its name (e.g. `ProductCardProps`).

---

## 8. Phased Development Plan

### Phase 1 — Foundation, Shared Proxy & DevOps (Days 1–6)

**1A. VPS prep (Day 1)**

1. Domain: register `epct.tn` (registrar shortlist: Tunic.tn, Namecheap, OVH); set A record to VPS IP. Confirm `kh-store.sgt-tunisie.com` A record unchanged.
2. SSH hardening: key-only, non-default port, `fail2ban`, UFW (`22/<custom>, 80, 443` only).
3. Install Docker + Compose v2 (already present per kh_store running).
4. `docker network create proxy_net`.

**1B. Shared proxy stack + kh_store cutover (Day 2) — keep both sites live**

> Goal: one brief reload on `kh-store.sgt-tunisie.com` (~30 s), no data loss.

1. Snapshot kh_store: `docker compose -f kh_store/docker-compose.yml exec -T db mysqldump … > kh_store_pre_cutover.sql`; tar wp-content uploads volume.
2. Author `/srv/docker/nginx-proxy/` stack (compose + global `nginx.conf` + `00-default.conf` returning 444 + `kh-store.conf` proxying to `kh_store_wp:80`).
3. Copy existing kh_store Let's Encrypt certs from current container into the new `letsencrypt` named volume (`docker cp` then `chown`).
4. Edit `kh_store/docker-compose.yml`: remove its `nginx` service, drop port mappings from `wp` (kept internal), add `kh_store_wp` to `proxy_net` external network.
5. Cutover sequence:
   ```
   docker compose -f kh_store/... down nginx          # frees host 80/443
   docker compose -f nginx-proxy/... up -d            # claims 80/443
   docker compose -f kh_store/... up -d wp            # rejoins on proxy_net
   curl -I https://kh-store.sgt-tunisie.com           # smoke test
   ```
6. Verify cert auto-renewal loop in certbot container.

**1C. EPCT scaffold (Days 3–4)**

7. Repo: `pnpm create next-app` + Payload 3 (`pnpm add payload @payloadcms/db-postgres @payloadcms/next @payloadcms/storage-s3 @payloadcms/richtext-lexical`).
8. Author `Dockerfile`, EPCT `docker-compose.yml` (no nginx/certbot), `docker-compose.dev.yml`, `init-bucket.sh`, `nginx-snippet/epct.conf.example`.
9. Bring up `postgres` + `minio` + `app` locally; verify Payload boots, admin reachable, image upload to MinIO succeeds.

**1D. EPCT production bring-up (Days 5–6)**

10. SSH to VPS, clone EPCT into `/srv/docker/projects/epct/`, drop `.env` (chmod 600), `docker compose up -d`.
11. Copy `docker/nginx-snippet/epct.conf.example` → `/srv/docker/nginx-proxy/nginx/conf.d/epct.conf` (with HTTP-only first for ACME).
12. `nginx -t && nginx -s reload` on shared proxy.
13. `init-letsencrypt.sh epct.tn www.epct.tn` (staging → prod).
14. Swap to HTTPS vhost, reload, smoke test `/`, `/admin`, `/api/health`.
15. Wire GitHub Actions (`ci.yml` + skeleton `deploy.yml`).

**Acceptance:**

- `https://kh-store.sgt-tunisie.com` still live and unchanged (Lighthouse identical to pre-migration).
- `https://epct.tn` serves Next.js placeholder; `/admin` shows Payload login; `/api/health` 200.
- Both domains score A on SSL Labs.
- `nginx -t` runs in deploy script before any reload.

### Phase 2 — CMS & Data Layer (Days 7–10)

1. Implement all collections + GlobalSettings + reusable `slug`/`seo` fields.
2. Wire MinIO storage adapter; verify upload + image sizes generation.
3. Slug + revalidate hooks; `/api/revalidate` route.
4. Seed script (3 categories, 5 brands, 20 products, settings).
5. Generate `payload-types.ts`; expose typed query helpers in `lib/queries`.

**Acceptance:** Admin CRUD works; image uploads land in MinIO bucket and load via `/media/`; saving a product triggers ISR revalidation locally (verified via console).

### Phase 3 — Public Frontend (Days 11–18)

1. Root layout + Header/Footer + theme + Lenis.
2. Homepage sections wired to Payload.
3. Catalogue page with URL-driven filters (category, brand, size, q, page).
4. Product detail (gallery, specs, WhatsApp CTA, related).
5. Category & brand pages.
6. Contact page + `/api/contact` (zod validation, nodemailer SMTP, store in `ContactSubmissions`).
7. Error/404 pages.

**Acceptance:** All pages render with seed data; WhatsApp deep links work on Android/iOS/desktop; contact form delivers email + persists submission.

### Phase 4 — SEO & Performance (Days 19–22)

1. `buildMetadata` everywhere; verify with metatags.io.
2. JSON-LD components on every relevant page; pass Google Rich Results Test.
3. `app/sitemap.ts` + `app/robots.ts`; submit sitemap to GSC.
4. Nginx caching headers + gzip verified via curl.
5. Lighthouse + WebPageTest sweep; fix LCP/CLS/INP regressions.

**Acceptance:** Lighthouse mobile Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95; sitemap valid; structured data error-free.

### Phase 5 — Polish, Analytics & Launch (Days 23–26)

1. Framer Motion micro-interactions; reduced-motion respected.
2. Dark mode toggle.
3. Stand up Umami stack (`umami` + `umami_postgres`), subdomain via nginx.
4. Mobile QA (iPhone SE → 15 Pro, common Android).
5. Security pass: rate-limit verified, headers via securityheaders.com (target A+), `.env` perms 600.
6. Backup cron live; do one full restore drill on a staging VPS / local.
7. Client content load-in.

**Acceptance:** Site live on production domain, daily backup file present + restorable, Umami tracking pageviews, all action items in Risk Register mitigated.

---

## 9. WhatsApp Integration Spec

**Helper** `lib/utils/whatsapp.ts`:

```ts
export function buildWhatsAppUrl(phone: string, product: { name: string; reference: string }) {
  const text = `Bonjour EPCT, je suis intéressé par le produit "${product.name}" (Réf. ${product.reference}). Pouvez-vous me communiquer plus d'informations ?`;
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
```

- `wa.me` deep links open the native app on mobile and WhatsApp Web on desktop automatically.
- `WhatsAppCTA` component: primary inline button + sticky floating button on mobile (≤ md, `position: fixed; bottom: 1rem; right: 1rem;` with safe-area inset).
- Click handler fires Umami event: `umami.track('whatsapp_click', { product: reference })`.
- Phone source: `GlobalSettings.whatsappNumber`, fetched in layout and passed via context to avoid re-querying.

---

## 10. Security Hardening Checklist

- **Postgres:** no host port; non-superuser app role; rotate password via `.env` + `docker compose up -d postgres`.
- **MinIO:** no host port in prod; root credentials only used to provision; create scoped service account for the app; bucket policy = anonymous *read* on `epct-media/*`, no list, no write.
- **Nginx:** HSTS preload, CSP (script-src self + Umami host + 'unsafe-inline' scoped to `/admin`), X-Frame-Options DENY, rate limits on `/api/` and `/admin`.
- **Payload:** `PAYLOAD_SECRET` 32+ chars; `cookies.secure = true`, `cookies.sameSite = 'lax'`; disable open registration; admin user via seed only.
- **Optional Nginx basic-auth on `/admin`** as a second factor.
- **Docker:** `nextjs` non-root user; `read_only: true` on app container with `tmpfs` for `/tmp`; `cap_drop: [ALL]`; `security_opt: ["no-new-privileges:true"]`.
- **SSH:** key-only, non-default port, `PermitRootLogin no`, `fail2ban`.
- **Firewall:** UFW allow only SSH + 80 + 443.
- **Secrets:** `.env` chmod 600 root:root; never in git; GitHub Secrets for CI.
- **Dependency hygiene:** Dependabot weekly; `pnpm audit` in CI.

---

## 11. Database & Media Backup Strategy

**Local daily (Phase 1 onward):**

- `docker/backup/backup.sh` runs nightly via host cron `0 3 * * *`:
  1. `docker compose exec -T postgres pg_dump -U $POSTGRES_USER -Fc $POSTGRES_DB | gzip > /var/backups/epct/db/epct_$(date +%F).sql.gz`
  2. `docker run --rm --network epct_network -v /var/backups/epct/media:/backup minio/mc sh -c "mc alias set m http://minio:9000 $USER $PASS && mc mirror --overwrite m/epct-media /backup"`
  3. Prune: keep 7 daily, 4 weekly (Sundays), 3 monthly (1st).
- Permissions: backup dir 700, owned by deploy user.

**Off-site (Phase 5, deferred):**

- Recommended: Backblaze B2 via `rclone` container; nightly `rclone sync /var/backups/epct b2:epct-backups --transfers=4`.
- Encrypt with `rclone crypt` remote; store passphrase in password manager, not on VPS.

**Recovery:**

```
gunzip -c epct_YYYY-MM-DD.sql.gz | docker compose exec -T postgres pg_restore -U $POSTGRES_USER -d $POSTGRES_DB --clean --if-exists
mc mirror /var/backups/epct/media m/epct-media
```

**Test cadence:** monthly restore drill on a throwaway compose stack; result logged to `progress.txt`.

---

## 12. CI/CD Pipeline

`.github/workflows/deploy.yml` outline:

```yaml
on:
  push: { branches: [main] }
concurrency: { group: deploy-prod, cancel-in-progress: false }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck && pnpm build
  build-push:
    needs: test
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
  deploy:
    needs: build-push
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT }}
          script: |
            cd /srv/docker/projects/epct
            export IMAGE_TAG=${{ github.sha }}
            echo "${{ secrets.GHCR_PAT }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            docker compose pull app
            docker compose up -d --no-deps --wait app
            docker image prune -f
```

- **Zero-downtime:** `--wait` blocks until healthcheck passes; `--no-deps` keeps Postgres/MinIO untouched. Shared `nginx-proxy` stack is **never touched by EPCT deploys** — it's a separate stack with its own lifecycle, so kh_store stays unaffected.
- **Rollback:** `IMAGE_TAG=<previous-sha> docker compose up -d --no-deps --wait app`. Keep last 5 tags in GHCR.
- **Secrets:** `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_SSH_PORT`, `GHCR_PAT`.

---

## 13. i18n Readiness Plan (deferred, scaffold now)

- Install `next-intl` but configure default locale `fr` with no prefix, additional locales array empty.
- Translation files at `messages/fr.json` (real strings) + `messages/en.json` (placeholder copies).
- Payload localized fields toggled `localized: true` on `name`, `shortDescription`, `fullDescription`, `additionalInfo`, all `seo.*` — even though only `fr` is enabled now, schema is future-proof.
- `middleware.ts` includes locale detection no-op (`locales: ['fr']`). When EN/AR added later, switch to prefix-based routing for non-default; flip Payload locale list; commission translation pass.
- AR adds RTL: defer Tailwind `dir` utilities + logical properties audit.

---

## ⚠️ Risk Register (top 7)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Postgres volume corruption / data loss | Low | Critical | Daily `pg_dump`, weekly tarball, off-site (Phase 5), monthly restore drill. |
| 2 | Shared VPS resource starvation by other apps | Med | High | Set Docker `mem_limit` per service (app 2 GB, postgres 1.5 GB, minio 1 GB); monitor with `docker stats` + alert. |
| 3 | SSL renewal failure (silent) | Low | High | certbot loop + nginx reload sidecar; Uptime Kuma probe on cert expiry. |
| 4 | MinIO bucket misconfigured (private) → broken images | Med | Med | `init-bucket.sh` idempotent; smoke test in CI hits `/media/health.png`. |
| 5 | ISR webhook fails silently → stale pages | Med | Med | Log every revalidate call; admin-only "Force revalidate" button calling same endpoint. |
| 6 | Build failure during deploy → site down | Low | High | Healthcheck gate + previous tag rollback playbook in README. |
| 7 | Spam through contact form | High | Low | Nginx rate limit + honeypot field + zod validation + optional Cloudflare Turnstile in Phase 5. |
| 8 | Shared nginx-proxy is SPOF for both sites — bad config takes down kh_store + EPCT | Med | High | Mandatory `nginx -t` before every `nginx -s reload`; vhost changes go through a script (`reload-proxy.sh`) that aborts on test fail; keep last-known-good `conf.d/` snapshot in `conf.d.backup/` for instant rollback. |

---

## 📎 Open Questions for Client

1. VPS hostname/IP and current other-apps' ports — to avoid Compose conflicts.
2. Domain registrar choice (Tunic.tn / Namecheap / OVH) — needed before SSL.
3. SMTP provider for contact emails (Brevo / Mailgun / Gmail SMTP)?
4. Payload admin: who are the initial users (emails) and roles?
5. Are there real product photos and references ready for seed, or do we use placeholder data through Phase 4?
6. Off-site backup target preference confirmation (Backblaze B2 recommended) — and budget.
7. Should `/admin` have a Nginx-level basic-auth gate in addition to Payload login?
8. Brand assets: logo, colors, typography — design tokens for Tailwind theme.
