# Repository guide

Bukit Delight is a pnpm workspace with a React/Vite web client, an Express
TypeScript API, Prisma/PostgreSQL persistence, and shared TypeScript contracts.
Docker Compose provides development with hot reload and a production-mode
image stack. PostgreSQL is supplied by the separate `local-infra` project.

## Common commands

Run from the repository root:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm build
corepack pnpm typecheck
corepack pnpm test
```

Use `docker-compose.development.yml` for Docker development and
`docker-compose.production.yml` for the production-mode stack. See
`docs/deployment.md` for environment, migration, health-check, and recovery
details.

## Architecture

- API routes and controllers use Prisma with PostgreSQL. Runtime startup does
  not require MongoDB or Redis.
- Web routes use the domain features under `apps/web/src/features`.
- Cross-package request and response contracts belong in
  `packages/shared/src`.
- Prisma schema, migrations, and seed live under `apps/api/prisma`.
- `apps/api/prisma/import-mongodb.ts` is an offline compatibility tool for a
  recovered MongoDB Extended JSON export; it is not part of application
  startup or normal deployment.

Keep `.env` files and credentials local. Use `.env.example` as the source for
the documented application variables, and do not commit secrets.
