# Architecture Decisions

## ADR 001 — Target workspace and runtimes

- **Status:** accepted for implementation.
- **Decision:** use the README's pnpm 10 workspace, with `apps/web`, `apps/api`, and a small `packages/shared`; require Node.js 22.12 or newer for the selected Vite major.
- **Reason:** this matches the project target and the installed toolchain is Node 24. Pinning the package manager makes workspace installs repeatable.
- **Constraint:** the current frontend is Create React App/React 17 and the API is CommonJS JavaScript. Preserve behavior during relocation; convert tooling and language in explicit, verifiable increments.
- **Progress:** frontend tooling has moved to Vite/Vitest and has a TypeScript entry point. Existing feature code still uses JavaScript, React 17, and Redux.

## ADR 002 — MongoDB to PostgreSQL migration

- **Status:** accepted as the migration approach; production cutover remains a release operation.
- **Decision:** use a maintenance-window, snapshot/export-import migration. Build PostgreSQL/Prisma alongside the existing MongoDB path, export a consistent source snapshot, import into a shadow PostgreSQL database, validate record counts/references/business-critical values, then switch the API configuration. Do not dual-write: it creates two sources of truth and inconsistent partial failures.
- **Rollback:** retain an immutable MongoDB backup and the previous application release through the agreed recovery window. Roll back by restoring the old release/configuration. Do not delete or mutate source collections as part of migration.
- **Data mapping:** preserve each ObjectId's hexadecimal representation as a string primary/foreign key in PostgreSQL so existing API identifiers remain stable. Map Mongoose timestamps to `createdAt`/`updatedAt`; preserve the refresh token's `created` field. Enforce required references only after checking legacy data for orphans.
- **Cutover gate:** do not switch production until a dry run succeeds, reconciliation has no unexplained differences, backup/restore is verified, and the maintenance window is scheduled. Actual production access/credentials are not part of repository implementation.

## ADR 003 — Redis adoption

- **Status:** infrastructure accepted; API integration deferred until a concrete feature requires it.
- **Decision:** provide Redis in local Docker infrastructure to match README setup, but do not move refresh-token ownership or add cache/rate-limit behavior without a separately defined consistency and failure policy.
- **Reason:** refresh tokens are currently persisted in MongoDB and Redis is not currently used by application code. Avoid creating a second token source of truth.

## ADR 004 - PostgreSQL is the runtime database

- **Status:** accepted and applied to the local runtime.
- **Context:** the operator confirmed MongoDB is no longer available and supplied local PostgreSQL settings. The target database `bukit-delight` on `127.0.0.1:5432` was empty before initialization.
- **Decision:** run every API route through Prisma/PostgreSQL. Apply the initial schema migration and seed the base roles in the target database. Do not attempt to recover or fabricate MongoDB data; the initialized database contains no imported legacy records.
- **Rollback:** restore PostgreSQL from its backup and roll back the application release. MongoDB is not an available rollback target. Legacy Mongoose controllers, models, and package dependencies have been removed; the offline Extended JSON importer remains for a recovered export.
- **Verification:** API startup succeeded; `/healthz` returned `ok` and `/readyz` returned `ready` against the PostgreSQL target.

## ADR 005 - Canonical English role names

- **Status:** accepted and applied locally.
- **Decision:** use `admin`, `cashier`, and `customer` as persisted role names. Registration assigns `customer`; cashier-only operations and web route guards check `cashier`.
- **Migration:** rename `kasir` to `cashier` and `user` to `customer`, preserving account role references. If both names exist, move references to the canonical role before removing the duplicate. `migration_down.sql` contains the reverse SQL for a manual rollback.
- **Verification:** the migration and seed completed on the local PostgreSQL database. Admin and cashier login both succeeded and returned the canonical role name.
