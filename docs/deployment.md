# PostgreSQL deployment

The API now defaults to PostgreSQL through Prisma. The local `bukit-delight`
database was empty before its initial Prisma migration and role seed were
applied. No MongoDB data was imported. Production releases should use the same
PostgreSQL schema and a production-specific `DATABASE_URL` supplied by the
deployment platform.

## Docker development and production modes

Development uses a separate `bukit-delight-development` database on PostgreSQL
on the external Docker network
`local-infra_local-infra` (the Compose network for project `local-infra`) and enables source watching in the API plus Vite hot module
replacement in the web app. Set `LOCAL_INFRA_NETWORK` if the network has a
different name. PostgreSQL must resolve as `postgres:5432`. It seeds the local
`owner`/`owner`, `cashier`/`cashier`, and `customer`/`customer` users. Those
credentials are for local development only; running the seed resets their
passwords. Create the development database once on the external
PostgreSQL server before starting the stack:

```sh
docker exec local-infra-postgres-1 createdb -U postgres bukit-delight-development
```

The production Compose file continues to use its separately configured
production `DATABASE_URL` (the local production rehearsal uses `bukit-delight`).

```sh
docker compose --env-file .env.example -f docker-compose.development.yml up --build
```

Open the web app at `http://localhost:5174` by default. The API is available at
`http://localhost:3001`. Source changes are watched from the workspace. Set
`WEB_PORT` to another free host port if needed. Stop the
services with:

```sh
docker compose --env-file .env.example -f docker-compose.development.yml down
```

This stops only this project's API and web containers; the external
infrastructure and its database volume are managed by `local-infra`.

Production uses built API and Nginx images, persistent upload storage, and no
source bind mounts or development seed accounts. PostgreSQL remains an
externally managed service reachable over `local-infra_local-infra`. Set
`LOCAL_INFRA_NETWORK` if its network has a different name. Create an ignored
`.env.docker.production` file with unique secrets and a matching `DATABASE_URL`,
then start the stack:

```sh
docker compose --env-file .env.docker.production -f docker-compose.production.yml -p bukit-delight-production up -d --build
```

The web container is exposed on port 8080 by default. The API and PostgreSQL
stay on the private external network. This Compose mode deploys to the Docker
host where the command runs; a local Docker Desktop stack is not a public
production release. Compose applies Prisma migrations and seeds the base roles
before starting API traffic. Production seed does not create development
accounts.

## Images

Build from the repository root so the Docker build can access the pnpm
workspace and shared package:

```sh
docker build -f docker/api.Dockerfile -t bukit-delight-api:<tag> .
docker build -f docker/web.Dockerfile -t bukit-delight-web:<tag> .
```

The API listens on port 3000 in the container. The web image serves the Vite
build through Nginx on port 80 and expects the production API at
`bukit-delight-production-api:3000` on the Compose network. Development uses a
separate `bukit-delight-development-api` alias because both stacks may share the
external infrastructure network. Nginx forwards `/api/` and `/socket.io/` to
the production API and serves the SPA for other paths.

## Runtime configuration

Provide secrets through the deployment platform, not image build arguments or
source control. Required application settings include:

- `API_KEY`, `APP_KEY`, `ACCESS_TOKEN_KEY`, and `REFRESH_TOKEN_KEY`
- `ACCESS_TOKEN_TIMEOUT`, `REFRESH_TOKEN_TIMEOUT`, and `ORDERS_TIMEOUT`
- `CLIENT_URL` set to the public web origin, and `PATH_UPLOADS`
- `API_PORT=3000`

The API uses PostgreSQL through Prisma as its only runtime storage. Provide
`DATABASE_URL` through the deployment platform.
Redis is managed outside this application stack and is not required for API
startup.

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
- The production Compose API trusts one reverse proxy hop so authentication
  rate limits use the original client IP. Keep the API private and change
  `TRUST_PROXY_HOPS` if the ingress topology has a different number of trusted
  proxies. The in-memory rate-limit store is per API process; use a shared store
  before running multiple API replicas.

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

The production Compose images built locally and both application containers
passed their health checks on `local-infra`. The migration/seed container exited
successfully with no pending migrations, and API `/readyz` returned HTTP 200.
The web container is exposed on port 8080. A clean workspace install,
typecheck, and API/web builds also succeeded. This local rehearsal does not
verify a separate production target. Before cutover, rehearse backup/restore and
observability against that target, and verify production secrets, ingress,
upload persistence, and alert thresholds.

The current production-mode local database was also backed up in custom format
and restored into a separate recovery database. `pg_restore --list` succeeded,
the public tables were present after restore, and role, account, and migration
row counts matched the source. The temporary recovery database and dump were
removed after verification. This rehearsal does not replace rehearsal on the
actual production target.

At the same local check, API and web health checks were healthy, API
`/readyz` returned HTTP 200, and PostgreSQL transaction/connection statistics
were readable from `pg_stat_database`. This is a local observability snapshot;
it does not demonstrate monitoring over an external production recovery
window.
