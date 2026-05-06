# EPCT Catalogue — Local Development Plan (Phase 0)

Local-only build plan to deliver a fully working Next.js 15 + Payload CMS 3 catalogue on the developer machine, with Postgres + MinIO in Docker and the app running natively via `pnpm dev`, deferring all VPS/DevOps work until the app is feature-complete.

> The full VPS deployment plan (`epct-catalogue-vps-618807.md`) remains the target for production. This document supersedes its Phases 1–3 scoping and becomes "Phase 0 — Local Build" preceding it.

---

## 0. Confirmed Local Setup

- **Services in Docker:** Postgres 16, MinIO. Run via `docker-compose.dev.yml`.
- **App on host:** Next.js 15 + Payload 3 via `pnpm dev` (fast HMR, easy debugger attach).
- **Brand & content:** real logo, colors, sample products available → we design with real content from day one.
- **OS:** Windows (PowerShell). Docker Desktop required.
- **No production concerns yet:** no Nginx, no certbot, no GitHub Actions, no VPS — those resume from `epct-catalogue-vps-618807.md` Phase 1B onward when the app is ready.

---

## 1. Local Environment Bring-up (Day 1)

### 1.1 Prerequisites

- Node.js 20 LTS (via `nvm-windows` or `volta`).
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`).
- Docker Desktop running.
- Git + a code editor.

### 1.2 Repo scaffold

```powershell
pnpm create next-app@latest epct --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"
cd epct
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/storage-s3 @payloadcms/richtext-lexical
pnpm add @aws-sdk/client-s3 sharp graphql
pnpm add -D @types/node tsx cross-env
```

UI + DX:

```powershell
pnpm dlx shadcn@latest init
pnpm add lucide-react class-variance-authority tailwind-merge clsx
pnpm add framer-motion lenis @studio-freight/lenis
pnpm add react-hook-form zod @hookform/resolvers
pnpm add nodemailer
pnpm add -D @types/nodemailer prettier prettier-plugin-tailwindcss
```

### 1.3 `docker-compose.dev.yml` (services only)

Two services, both bound to localhost only:

- **`postgres`** — `postgres:16-alpine`, `ports: ["5432:5432"]`, env `POSTGRES_DB=epct_db / USER=epct_user / PASSWORD=epct_dev_pw`, volume `epct_pgdata:/var/lib/postgresql/data`.
- **`minio`** — `minio/minio:latest`, `ports: ["9000:9000","9001:9001"]`, env `MINIO_ROOT_USER=epct_admin / MINIO_ROOT_PASSWORD=epct_dev_pw`, volume `epct_minio:/data`, `command: server /data --console-address ":9001"`.
- **`minio-init`** — `minio/mc`, runs once on `up` to create `epct-media` bucket and set anonymous read policy.

Run:

```powershell
docker compose -f docker-compose.dev.yml up -d
```

Verify:

- `psql postgresql://epct_user:epct_dev_pw@localhost:5432/epct_db -c "SELECT 1"` (or use TablePlus).
- MinIO console at `http://localhost:9001`.

### 1.4 `.env.local`

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PORT=3000

PAYLOAD_SECRET=dev-secret-change-me-32chars-min-aaaaaa

DATABASE_URI=postgresql://epct_user:epct_dev_pw@localhost:5432/epct_db

# MinIO (S3-compatible)
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=epct_admin
S3_SECRET_KEY=epct_dev_pw
S3_BUCKET=epct-media
S3_FORCE_PATH_STYLE=true
NEXT_PUBLIC_MEDIA_URL=http://localhost:9000/epct-media

REVALIDATE_SECRET=dev-revalidate-secret

# SMTP (use Mailhog or Ethereal in dev)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM="EPCT Dev <dev@epct.local>"
CONTACT_EMAIL=dev@epct.local
```

Optional: add a `mailhog` service (`mailhog/mailhog`, `ports: ["1025:1025","8025:8025"]`) to compose for capturing contact-form emails locally.

### 1.5 First boot

```powershell
pnpm payload generate:types
pnpm dev
```

Visit `http://localhost:3000/admin` → create first admin user (Yacine / Abderrahmen) via Payload's first-run wizard.

**Day-1 acceptance:** Postgres + MinIO containers running; Next.js dev server live; Payload admin reachable; first admin user created; image upload to MinIO works from admin.

---

## 2. Project Structure (committed)

```
epct/
├── docker-compose.dev.yml
├── docker/
│   └── minio/init-bucket.sh
├── scripts/
│   ├── seed.ts
│   └── generate-secret.ts
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── catalogue/{page.tsx,[slug]/page.tsx}
│   │   │   ├── categories/[slug]/page.tsx
│   │   │   ├── marques/{page.tsx,[slug]/page.tsx}
│   │   │   ├── contact/page.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── error.tsx
│   │   ├── (payload)/
│   │   │   ├── admin/[[...segments]]/{page.tsx,not-found.tsx}
│   │   │   ├── api/[...slug]/route.ts
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   ├── revalidate/route.ts
│   │   │   └── health/route.ts
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── payload/
│   │   ├── payload.config.ts
│   │   ├── collections/{Products,Categories,Brands,ContactSubmissions,Media,Users}.ts
│   │   ├── globals/GlobalSettings.ts
│   │   ├── hooks/{slugify,revalidate}.ts
│   │   ├── access/{isAdmin,publicRead}.ts
│   │   └── fields/{slug,seo}.ts
│   ├── components/
│   │   ├── layout/{Header,Footer,MobileNav,LenisProvider}.tsx
│   │   ├── home/{Hero,CategoryGrid,BrandStrip,FeaturedProducts,IntroSection}.tsx
│   │   ├── catalogue/{FilterSidebar,ProductGrid,ProductCard,SearchBar,EmptyState,Pagination}.tsx
│   │   ├── product/{ImageGallery,SizeSelector,SpecsTable,WhatsAppCTA,RelatedProducts}.tsx
│   │   ├── contact/ContactForm.tsx
│   │   ├── seo/{JsonLdOrganization,JsonLdLocalBusiness,JsonLdProduct,JsonLdBreadcrumbs}.tsx
│   │   └── ui/  # shadcn
│   ├── lib/
│   │   ├── payload.ts
│   │   ├── queries/{products,categories,brands,settings}.ts
│   │   ├── seo/{defaultMetadata,buildMetadata}.ts
│   │   ├── utils/{cn,slugify,whatsapp,format}.ts
│   │   ├── email/sendContactEmail.ts
│   │   └── constants.ts
│   ├── styles/tailwind.css
│   ├── types/payload-types.ts  # generated
│   └── middleware.ts
├── public/
│   ├── images/{logo.svg,...brand assets}
│   └── fonts/
├── .env.example
├── .env.local            # gitignored
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

> Production-only files (`Dockerfile`, prod `docker-compose.yml`, nginx vhost snippet) are deferred entirely until Phase 1 of the VPS plan.

---

## 3. Development Phases (local only)

Total estimate: **~16 working days** of focused build before any infra work.

### Phase 0.1 — Foundation (Days 1–2)

- Repo scaffold + dependencies (§1.2).
- `docker-compose.dev.yml` up; admin user created (§1.3–1.5).
- `payload.config.ts` wired with Postgres adapter + S3 storage adapter pointing at MinIO.
- Tailwind theme: design tokens from real EPCT brand (colors, typography, logo in `/public`).
- shadcn baseline components installed (Button, Input, Sheet, Dialog, Select, Badge, Skeleton, Toast).
- Root layout, fonts, dark-mode toggle scaffolded.

**Acceptance:** `pnpm dev` runs cleanly; brand colors/logo visible on a placeholder homepage; admin uploads a test image successfully to MinIO.

### Phase 0.2 — CMS & Data Layer (Days 3–5)

- Implement reusable fields: `slug`, `seo`.
- Collections: `Users`, `Media`, `Categories`, `Brands`, `Products`, `ContactSubmissions`.
- Global: `GlobalSettings`.
- Hooks: `slugify` (beforeChange), `revalidate` (afterChange/afterDelete) — revalidate calls only logged in dev for now.
- Access control: public read on active products/categories/brands/media; everything else admin-only.
- `pnpm payload generate:types` integrated into `predev`/`prebuild` scripts.
- Typed query helpers in `src/lib/queries/`.
- **Seed script** (`scripts/seed.ts`, run via `pnpm tsx`): inserts the real categories (Toupie / Pompe à béton / Centrales à béton), 5 brands (Putzmeister, Schwing, CIFA, Turukmixer, Zoomlion) with logos, and the sample products you have on hand.

**Acceptance:** Full CRUD works in admin; seed script produces a realistic catalog; types are generated and used in queries.

### Phase 0.3 — Public Frontend (Days 6–11)

Order matters — each step builds on the previous.

1. **Layout shell** — `Header` (logo, nav, contact CTA), `Footer` (address, hours, socials), `MobileNav` (Sheet), `LenisProvider` (md+ only, respects `prefers-reduced-motion`).
2. **Homepage** — `Hero` from GlobalSettings, `CategoryGrid` (3 cards), `BrandStrip` (logos), `FeaturedProducts`, `IntroSection`.
3. **Catalogue** (`/catalogue`) — server-rendered grid with URL-driven filters: `?category=`, `?brand=`, `?size=`, `?q=`, `?page=`. `FilterSidebar` is client, syncs to URL. `ProductCard` server. `Pagination` link-based.
4. **Product detail** (`/catalogue/[slug]`) — `ImageGallery` (client, swipe + keyboard), `SpecsTable`, `SizeSelector`, `WhatsAppCTA` (sticky on mobile), `RelatedProducts`.
5. **Category page** (`/categories/[slug]`) — hero + filtered ProductGrid scoped to category.
6. **Brand pages** (`/marques`, `/marques/[slug]`) — listing + brand detail with products.
7. **Contact** — `ContactForm` (RHF + zod) → `POST /api/contact` → nodemailer to MailHog + persists `ContactSubmissions` record.
8. **Error/404** pages.
9. **Health route** `/api/health` — DB ping, returns 200/500.

**Acceptance:** All pages render with seed data; WhatsApp deep links open correctly on mobile + desktop; contact form delivers to MailHog and creates an admin record.

### Phase 0.4 — SEO, Performance & Polish (Days 12–14)

- `buildMetadata` helper used in every `generateMetadata`; OG + Twitter cards.
- JSON-LD: Organization + LocalBusiness on root; Product + BreadcrumbList on detail pages.
- `app/sitemap.ts` + `app/robots.ts` (robots disallows `/admin`, `/api` even in dev).
- ISR: `revalidatePath`/`revalidateTag` wired in `/api/revalidate`; Payload `afterChange` hook hits it locally — verify in console logs.
- Image pipeline: Next/Image with custom loader pointing to `NEXT_PUBLIC_MEDIA_URL`; Payload generates `thumbnail`/`card`/`hero` sizes on upload.
- Framer Motion subtle micro-interactions (hero, card hover, page transitions on md+).
- Lighthouse pass (mobile): target Perf ≥ 90, SEO ≥ 95, A11y ≥ 95 — fix what's flagged.
- Validate JSON-LD with Google Rich Results Test (paste-in mode is fine pre-deploy).

**Acceptance:** Lighthouse targets met locally; sitemap valid XML; structured data error-free; revalidation logs prove the webhook contract works.

### Phase 0.5 — Hardening & Handoff Prep (Days 15–16)

- Mobile QA across viewports (320, 375, 414, 768, 1024, 1440) using DevTools device mode + at least one real Android phone.
- Accessibility audit (axe DevTools): keyboard nav, focus rings, alt text on every Media item enforced via Payload `required: true`.
- Form spam: honeypot field + zod min/max + simple in-memory rate limit on `/api/contact` (prod-grade rate limit deferred to Nginx).
- i18n scaffolding (deferred content): `next-intl` installed, `messages/fr.json` populated, `localized: true` on Payload text/richText fields, but only `fr` locale enabled.
- README written: how to clone, install, run dev stack, seed, reset DB, common gotchas.
- `progress.txt` updated with: open issues, known limitations, what gets enabled when we move to VPS.

**Acceptance:** A second developer can clone the repo and reach a fully working local site in < 15 minutes following the README. App is feature-complete and ready for the VPS phase.

---

## 4. What's Explicitly Deferred

These are **not** part of local dev — they belong to the VPS plan when we resume it:

- Production `Dockerfile` (multi-stage standalone build).
- Production `docker-compose.yml` with healthchecks and resource limits.
- Shared `nginx-proxy` stack + `kh_store` cutover.
- Let's Encrypt certbot setup.
- GitHub Actions CI/CD.
- DB backup cron + off-site sync.
- Umami analytics deployment.
- Security headers via Nginx (CSP, HSTS, rate limits).
- Domain registration + DNS.
- SMTP provider selection (using MailHog locally is enough).

The decisions already made for those (MinIO, French-only, shared proxy, etc.) stay locked in so local code doesn't need rework when we deploy.

---

## 5. Risk Register (local-dev specific)

| # | Risk | Mitigation |
|---|---|---|
| 1 | MinIO S3 quirks differ from AWS S3 → adapter misconfig | Use `forcePathStyle: true` and explicit `endpoint`; smoke-test upload on Day 1 before building anything else. |
| 2 | Payload type drift after schema changes | `pnpm payload generate:types` wired into `predev` and `prebuild`. |
| 3 | Postgres data wiped on volume reset → lost test content | Seed script is idempotent; commit it; treat local DB as disposable. |
| 4 | ISR revalidation looks fine in dev but breaks in prod | Build the webhook contract now (logs in dev), unit-test it with a manual curl, document expected paths/tags. |
| 5 | Brand assets not finalized → rework | Lock design tokens (colors, fonts, spacing scale) on Day 2 in `tailwind.config.ts`; components only consume tokens, never hard-coded values. |

---

## 6. Open Questions Before We Start

1. Do you have the EPCT logo as SVG (preferred) or only raster? I'll need it for Day 1.
2. Brand color palette — primary / accent / neutral hex values? If unsure, propose a scheme based on EPCT's industry (industrial blue + concrete gray)?
3. Sample products — how many, and do you have photos + references in a spreadsheet, or should I author them from scratch in the seed script?
4. Initial admin users — names + emails for the seed (or create in admin after first boot)?
5. Any existing site to mirror structure/copy from, or fresh design?
