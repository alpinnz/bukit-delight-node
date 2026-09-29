# Bukit Delight Architecture

## Current application map

The existing Express application exposes `/api/v1` and mounts these domains:

| API prefix        | Domain                                                              | Main persistence                          |
| ----------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `/Authentication` | Registration, login, activation, password recovery, logout, refresh | Users, RefreshTokens, Roles               |
| `/users`          | User administration                                                 | Users, UserRoles                          |
| `/Categories`     | Menu categories                                                     | Categories                                |
| `/Menus`          | Menu items and favorites                                            | Menus, Categories                         |
| `/Tables`         | Dining/booking tables                                               | Tables                                    |
| `/Orders`         | Customer/staff orders                                               | Orders, Users, Tables, ItemOrders         |
| `/item-orders`    | Items belonging to orders                                           | ItemOrders, Orders, Menus                 |
| `/Transactions`   | Staff transaction workflow                                          | Transactions, Orders, Users               |
| `/roles`          | Staff roles                                                         | Roles                                     |
| `/customers`      | Users with the customer role                                        | Users, UserRoles                          |
| `/machine`        | Favorite-menu operation                                             | Menus                                     |

Route authorization loads roles from `users` on every authenticated request. User/role management and privileged configuration require `owner`; menu, table, and category writes allow staff roles; customer order creation requires the customer role; transactions require `cashier` or `owner`.

## Current persistence relationships

- User roles are many-to-many through `user_roles`; canonical names are `customer`, `cashier`, and `owner`.
- Menu requires a category.
- Order optionally references a user with the customer role and a table; there is no separate customer identity table.
- ItemOrder requires one order and one menu.
- Transaction requires one user and one order; order is unique per transaction.
- RefreshToken always references one user and records expiry/revocation metadata.
- Prisma owns the PostgreSQL tables and timestamp fields.

## Target dependency direction

Web and API depend on `packages/shared` only for stable, serialized contracts. API modules own business behavior; persistence stays behind API data-access code. PostgreSQL is the primary store and is provided by the separate `local-infra` Compose project on its project-scoped network. Redis is also managed there, but the API does not depend on it.

## Runtime contracts

- Keep `/api/v1` and the existing domain route names stable for current clients.
- `/health` and `/healthz` report process liveness; `/readyz` also checks PostgreSQL.
- Preserve uploaded image paths and production frontend serving through the Nginx container.

## Migration progress

- The frontend is in `apps/web`, built with Vite, and served from `dist` in production.
- The API is in `apps/api`; runtime source, routes, controllers, services, and configuration are TypeScript compiled by `tsc`.
- PostgreSQL is managed through the Prisma schema, migrations, and seed data.
- All API routes, authentication, startup, and readiness use Prisma/PostgreSQL directly. The repository does not include a MongoDB import path.
- PostgreSQL is managed by the separate `local-infra` Compose project. The application Compose files attach to its external network; the API does not currently depend on Redis.
