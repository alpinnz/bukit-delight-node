# PostgreSQL deployment

The API now defaults to PostgreSQL through Prisma. The local `bukit-delight`
database was empty before its initial Prisma migration and role seed were
applied. No MongoDB data was imported. Production releases should use the same
PostgreSQL schema and a production-specific `DATABASE_URL` supplied by the
deployment platform.

## Images

Build from the repository root so the Docker build can access the pnpm
workspace and shared package:

```sh
docker build -f docker/api.Dockerfile -t bukit-delight-api:<tag> .
docker build -f docker/web.Dockerfile -t bukit-delight-web:<tag> .
```

The API listens on port 3000 in the container. The web image serves the Vite
build through Nginx on port 80 and expects the API container to be reachable as
`api:3000` on the same container network. Nginx forwards `/api/` and
`/socket.io/` to the API and serves the SPA for other paths.

## Runtime configuration

Provide secrets through the deployment platform, not image build arguments or
source control. Required application settings include:

- `API_KEY`, `APP_KEY`, `ACCESS_TOKEN_KEY`, and `REFRESH_TOKEN_KEY`
- `ACCESS_TOKEN_TIMEOUT`, `REFRESH_TOKEN_TIMEOUT`, and `ORDERS_TIMEOUT`
- `CLIENT_URL` set to the public web origin, and `PATH_UPLOADS`
- `API_PORT=3000`

The API uses PostgreSQL through Prisma as its only runtime storage. Provide
`DATABASE_URL` through the deployment platform.
`REDIS_URL` is optional; the current API does not use Redis as a prerequisite
for startup.

Before starting the application release, run the Prisma migration deploy step
once from a release job using the same API image and `DATABASE_URL`:

```sh
docker run --rm --network <application-network> \
  --env DATABASE_URL \
  bukit-delight-api:<tag> pnpm db:deploy
```

Do not run migrations independently in every API replica. Apply migrations
once before deploying API replicas. Seed the base roles once where the target
database is new.

## Health and traffic

- Use `/healthz` for process liveness.
- Use `/readyz` for readiness; it checks configured database storage.
- Route public HTTP traffic to the web/Nginx container. Keep API port 3000
  private to the application network.
- Keep uploads on storage shared by API replicas if uploaded files must survive
  container replacement.
- Terminate HTTPS at the platform ingress and configure `CLIENT_URL` to the
  resulting HTTPS origin.

## Monitoring during release and recovery window

Track these signals before, during, and after a release:

- `/healthz` and `/readyz` status and API restart count.
- HTTP 5xx rate, request latency (including p95), and failed login rate.
- Structured API error logs, PostgreSQL connection/query errors, active
  connections, lock waits, and storage capacity.

Compare each signal with the pre-release baseline and the service's existing
alert thresholds. Pause traffic rollout and investigate if readiness fails,
5xx errors rise above the service threshold, or PostgreSQL cannot accept
connections. The application does not expose a metrics endpoint; collect HTTP
and database metrics through the deployment platform or its existing agents.

## PostgreSQL backup and restore rehearsal

Create a protected custom-format backup before release and verify that
`pg_restore --list` can read it:

```sh
pg_dump --format=custom --file=bukit-delight-pre-release.dump "$DATABASE_URL"
pg_restore --list bukit-delight-pre-release.dump
```

Rehearse restore into a separate, empty recovery database. Verify schema,
roles, and representative application flows there before changing any
production connection setting:

```sh
pg_restore --exit-on-error --no-owner \
  --dbname="$RESTORE_DATABASE_URL" bukit-delight-pre-release.dump
```

Keep the previous application image and its matching configuration for the
recovery window. If rollback is required, direct traffic to the previous image
with the verified restored PostgreSQL database. Do not restore over the active
database as part of a rehearsal.

## Current verification limits

The API and web Docker image builds have succeeded. The documented Compose
configuration validates, and the local PostgreSQL and Redis services report
healthy. The `bukit-delight` database migration and seed succeeded; API
`/healthz` and `/readyz` both returned healthy responses using Prisma. A clean
workspace install, typecheck, and API/web builds also succeed. Before a
production release, rehearse the target PostgreSQL backup/restore procedure
and verify production secrets, ingress, upload persistence, and alert
thresholds.
