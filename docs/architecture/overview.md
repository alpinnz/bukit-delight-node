# Bukit Delight Architecture

## Current application map

The existing Express application exposes `/api/v1` and mounts these domains:

| API prefix        | Domain                                                              | Main persistence                          |
| ----------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `/Authentication` | Registration, login, activation, password recovery, logout, refresh | Accounts, Customers, RefreshTokens, Roles |
| `/Accounts`       | Staff account administration                                        | Accounts, Roles                           |
| `/Categories`     | Menu categories                                                     | Categories                                |
| `/Menus`          | Menu items and favorites                                            | Menus, Categories                         |
| `/Tables`         | Dining/booking tables                                               | Tables                                    |
| `/Orders`         | Customer/staff orders                                               | Orders, Customers, Tables, ItemOrders     |
| `/item-orders`    | Items belonging to orders                                           | ItemOrders, Orders, Menus                 |
| `/Transactions`   | Staff transaction workflow                                          | Transactions, Orders, Accounts            |
| `/roles`          | Staff roles                                                         | Roles                                     |
| `/customers`      | Customer records                                                    | Customers                                 |
| `/machine`        | Favorite-menu operation                                             | Menus                                     |

Route authorization is applied at the version router: account/role management is admin-only; menu, table, and category writes are staff/admin constrained; orders allow customer creation and staff operations; transactions require cashier/admin. Preserve these rules when moving routes.

## Current persistence relationships

- Account has an optional role reference; canonical role names are `customer`, `cashier`, and `admin`.
- Menu requires a category.
- Order optionally references a customer and table.
- ItemOrder requires one order and one menu.
- Transaction requires one account and one order; order is unique per transaction.
- RefreshToken optionally references an account or customer and records expiry/revocation metadata.
- Prisma owns the PostgreSQL tables and timestamp fields. The offline importer maps legacy MongoDB timestamps into those fields.

## Target dependency direction

Web and API depend on `packages/shared` only for stable, serialized contracts. API modules own business behavior; persistence stays behind API data-access code. PostgreSQL is the primary store. Redis is an infrastructure option from the README and must have an identified API use before application code depends on it.

## Compatibility requirements

- Keep `/api/v1` and current domain route names during migration; introduce aliases only when needed by a known consumer.
- Preserve authentication/authorization behavior and existing Mongo ObjectId strings in API payloads during data migration.
- Keep the existing `/healthz` and `/readyz` checks while adding README's `/health` contract.
- Keep uploaded image paths and production frontend serving functional when relocating applications.

## Migration progress

- The frontend is in `apps/web`, built with Vite, and served from `dist` in production.
- The API is in `apps/api`; its TypeScript server entry compiles, while existing domain modules still run as CommonJS JavaScript.
- PostgreSQL/Prisma schema and an offline snapshot importer are implemented and tested against synthetic data in a local shadow database.
- All API routes, authentication, startup, and readiness use Prisma/PostgreSQL directly. Legacy MongoDB exports can be imported from Extended JSON without a MongoDB service or Mongoose runtime dependency.
- Local PostgreSQL/Redis are available through Docker Compose using the host ports in `.env.example`.
