# Local Setup

This project can run on another computer with the same local Docker stack.

## Containers

The local development stack uses these services from `docker-compose.dev.yml`:

- `postgres`
- `minio`
- `minio-init`
- `mailhog`

`minio-init` is a one-shot helper container. It creates the bucket and exits. That is expected.

## 1. Install prerequisites

- Node.js 20+
- pnpm
- Docker Desktop (or Docker Engine + Compose)

## 2. Copy the project

Copy the repository to the other computer, then install dependencies:

```bash
pnpm install
```

## 3. Create the local env file

Copy `.env.example` to `.env.local` and set at least:

- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URI`

For the default local Docker setup, the provided values already match `docker-compose.dev.yml`.

## 4. Start the local services

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:

- PostgreSQL on `127.0.0.1:55432`
- MinIO on `127.0.0.1:9000`
- MinIO console on `127.0.0.1:9001`
- Mailhog on `127.0.0.1:8025`

## 5. Start the app

```bash
pnpm dev
```

Or use:

```bash
pnpm start:dev
```

## 6. Open the app

- Frontend: `http://localhost:3000`
- Payload admin: `http://localhost:3000/admin`
- Mailhog: `http://localhost:8025`
- MinIO console: `http://localhost:9001`

## Notes

- The app now uses `DATABASE_URI` first, and falls back to the local dev database URL only in development.
- S3 / MinIO storage is enabled only when the required `S3_*` variables are present.
- If you do not want MinIO on another computer yet, just remove the `S3_*` values from `.env.local` and media will use local storage.
