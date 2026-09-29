# Architecture Decisions

## ADR 001 — Target workspace and runtimes

- **Status:** accepted for implementation.
- **Decision:** use the README's pnpm 12.6 workspace, with `apps/web`, `apps/api`, and a small `packages/shared`; require Node.js 22.12 or newer for the selected Vite major.
- **Reason:** this matches the project target and the installed toolchain is Node 24. Pinning the package manager makes workspace installs repeatable.
- **Constraint:** preserve the existing API and UI behavior while moving the repository into the workspace and TypeScript toolchain.
- **Progress:** web and API runtime source are TypeScript; web uses Vite/Vitest and the API compiles with `tsc`. The API retains Express and the existing React/Redux stack.

## ADR 002 — MongoDB to PostgreSQL migration

- **Status:** accepted as the migration approach; production cutover remains a release operation.
- **Decision:** use a maintenance-window, snapshot/export-import migration. Build PostgreSQL/Prisma alongside the existing MongoDB path, export a consistent source snapshot, import into a shadow PostgreSQL database, validate record counts/references/business-critical values, then switch the API configuration. Do not dual-write: it creates two sources of truth and inconsistent partial failures.
- **Rollback:** retain an immutable MongoDB backup and the previous application release through the agreed recovery window. Roll back by restoring the old release/configuration. Do not delete or mutate source collections as part of migration.
- **Data mapping:** preserve each ObjectId's hexadecimal representation as a string primary/foreign key in PostgreSQL so existing API identifiers remain stable. Map Mongoose timestamps to `createdAt`/`updatedAt`; preserve the refresh token's `created` field. Enforce required references only after checking legacy data for orphans.
- **Cutover gate:** do not switch production until a dry run succeeds, reconciliation has no unexplained differences, backup/restore is verified, and the maintenance window is scheduled. Actual production access/credentials are not part of repository implementation.

## ADR 003 — Redis remains external and optional

- **Status:** local infrastructure is managed separately; API integration is deferred until a concrete feature requires it.
- **Decision:** the application Compose files do not start Redis. The API currently uses PostgreSQL as its only runtime storage; do not add cache, rate-limit, or token behavior without a defined consistency and failure policy.
- **Reason:** Redis is available in the separate `local-infra` project, but application code does not use it. The app Compose files join the infrastructure project's network instead of creating duplicate services.

## ADR 004 - PostgreSQL is the runtime database

- **Status:** accepted and applied to the local runtime.
- **Context:** the operator confirmed MongoDB is no longer available and supplied local PostgreSQL settings. The target database `bukit-delight` on `127.0.0.1:5432` was empty before initialization.
- **Decision:** run every API route through Prisma/PostgreSQL. Apply the initial schema migration and seed the base roles in the target database. Do not attempt to recover or fabricate MongoDB data; the initialized database contains no imported legacy records.
- **Rollback:** restore PostgreSQL from its backup and roll back the application release. MongoDB is not an available rollback target. Legacy Mongoose controllers, models, package dependencies, and the temporary Extended JSON importer have been removed because no MongoDB export was available to import.
- **Verification:** API startup succeeded; `/healthz` returned `ok` and `/readyz` returned `ready` against the PostgreSQL target.

## ADR 005 - Canonical English role names (superseded)

- **Status:** accepted and applied locally.
- **Decision:** this decision was replaced by ADR 006. Persisted roles are now `owner`, `cashier`, and `customer`.
- **Migration:** the unreleased migration history has been consolidated into a new baseline; local development databases must be recreated before applying it.
- **Verification:** see the verification notes for ADR 006.

## ADR 006 - Users and multi-role authorization

- **Status:** accepted in the unreleased application schema.
- **Decision:** use `users` as the only identity table, `roles` as role definitions, and `user_roles` as the many-to-many assignment table. Persist `owner`, `cashier`, and `customer`; public registration assigns only `customer`.
- **Authorization:** access tokens contain only a user ID. Middleware reloads the user and assigned roles from PostgreSQL for every protected request. Refresh-token rows always reference that user.
- **Domain data:** orders reference the customer user directly. There is no separate `customers` table or empty role-profile table; role-specific tables can be added when a role needs its own attributes.
- **Migration:** replace the unreleased migration chain with one initial baseline matching the current Prisma schema. Applying the new baseline to a fresh local database is required; existing local schemas need a deliberate reset or a separate data-preserving transition.
- **Verification:** API/web typechecks and targeted test suites are recorded in the implementation report. Database integration tests require a separately configured test database.
