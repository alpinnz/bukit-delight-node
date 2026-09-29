# Bukit Delight

Restaurant ordering and management application with a React frontend and
Express API, managed as a pnpm workspace.

The project is designed with a modular architecture, shared packages, TypeScript, PostgreSQL, Docker, testing, and CI/CD support. Redis is available through separate local infrastructure but is not used by the API.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Headless UI
- Heroicons
- React Router
- Redux
- Axios
- Vitest
- React Testing Library

### Backend

- Node.js
- Express.js
- TypeScript
- Joi
- PostgreSQL
- Prisma
- Node.js built-in test runner
- Pino

### Development

- pnpm
- Docker
- Docker Compose
- ESLint
- Prettier

## Project Structure

Application source and Vite configuration use TypeScript. API tests remain JavaScript for the Node.js test runner; ESLint configuration uses `.mjs` for Node tooling.

```text
apps/
├── api/
│   ├── prisma/       schema, migrations, seed, snapshot importer
│   ├── src/          TypeScript config, controllers, middleware, routes, services
│   ├── test/         API test support
│   └── tsconfig.json
└── web/
    ├── src/          TypeScript and TSX actions, components, features, reducers, routes
    ├── vite.config.mts
    └── tsconfig.json
packages/
└── shared/src/       shared TypeScript contracts
docker/               API/web Dockerfiles and Nginx configuration
docker-compose.*.yml   development and production application stacks
```

The detailed route and persistence map is in [docs/architecture/overview.md](docs/architecture/overview.md).

## Architecture

```text
                        ┌─────────────────┐
                        │     Browser     │
                        └────────┬────────┘
                                 │
                                 │ HTTP / HTTPS
                                 ▼
                        ┌─────────────────┐
                        │   React Web     │
                        │    apps/web     │
                        └────────┬────────┘
                                 │
                                 │ REST API
                                 ▼
                        ┌─────────────────┐
                        │   Express API   │
                        │    apps/api     │
                        └────────┬────────┘
                                 │
                                 │
                                 ▼
                        ┌────────────┐
                        │ PostgreSQL │
                        └────────────┘
```

## Monorepo Principles

1. Applications are isolated.
2. Shared code lives inside `packages`.
3. Business logic should remain modular.
4. Frontend and backend should not directly depend on each other's implementation.
5. Shared contracts should be explicitly defined.
6. Infrastructure configuration should remain outside application code.
7. Environment configuration must not be committed.
8. Every module should be independently testable.
9. Avoid unnecessary abstraction.
10. Prefer composition over inheritance.

## Workspace

This project uses pnpm workspaces.

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

The workspace contains two applications and one shared-contract package:

```text
apps/
├── web
└── api

packages/
└── shared
```

The root ESLint and TypeScript configuration files are shared directly; they are not separate workspace packages.

## Frontend

The frontend lives inside:

```text
apps/web
```

React UI is organized by the application's roles and flows.

```text
apps/web/src/
├── components/common/  shared UI and form components
├── features/
│   ├── admin/
│   ├── auth/
│   ├── customer/
│   ├── kasir/
│   └── landing/
├── routes/             route guards and route declarations
├── templates/          role-specific page layouts
├── actions/            shared Redux actions
└── reducers/           shared Redux state
```

Feature-specific pages and components belong under the relevant `features/*`
directory. Reusable UI belongs under `components/common`.

## Backend

The backend lives inside:

```text
apps/api
```

Express uses separate route, middleware, controller, and service folders.

```text
apps/api/src/
├── config/
├── controllers/
├── middlewares/
├── routes/v1/
├── services/
└── utils/
```

Requests flow through versioned routes and authorization middleware to
controllers and Prisma-backed services. Keep the existing boundaries; add
another layer only when it provides meaningful isolation or reuse.

```text
HTTP Request
     │
     ▼
Versioned Route
     │
     ▼
Middleware
     │
     ▼
Controller / service -> Prisma -> PostgreSQL
```

### Controller

Controllers handle HTTP request and response concerns and call the operations
needed by a route. Keep business rules in the existing service or controller
that owns them; add another layer only when it improves the current domain.

- Request
- Response
- Status code
- HTTP-level validation result

### Service

Services in this project use Prisma directly where they own persistence and
domain operations, for example `PrismaCatalog` and `PrismaOrders`. Keep that
pattern consistent; introduce a repository only for a concrete isolation or
reuse need.

## Validation

The API validates untrusted request input with Joi at the route boundary.
Shared TypeScript contracts provide compile-time alignment between the API
and web client; they do not replace runtime validation.

## Shared Package

`packages/shared/src/index.ts` exports TypeScript request, response, and domain
contracts plus constants used by both applications. Runtime request validation
stays at the API boundary and uses Joi. The shared package does not duplicate
runtime validators or contain framework-specific code.

```ts
import type {
  CategoryRecord,
  CreateCategoryRequest,
} from "@bukit-delight/shared";
```

## Database

PostgreSQL is used as the primary database.

Prisma is used as the ORM.

```text
apps/api/prisma/
├── schema.prisma
├── migrations/
├── seed.ts
└── import-mongodb.ts
```

Example:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Redis

Redis runs in the separately managed `local-infra` project. This application
does not connect to it, so it is not part of the application runtime or API
readiness requirements. Add a Redis integration only when a concrete feature
requires it.

## Environment Variables

Environment variables should never be committed.

Use:

```text
.env.example
```

Example:

```env
NODE_ENV=development

API_PORT=3000
CLIENT_URL=http://localhost:5173
PATH_UPLOADS=public/uploads

DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/bukit-delight-development?schema=public
DATABASE_URL_DOCKER=postgresql://postgres:postgres@postgres:5432/bukit-delight-development?schema=public

API_KEY=replace-with-a-local-api-key
APP_KEY=replace-with-a-local-app-key
ACCESS_TOKEN_KEY=replace-with-a-long-random-secret
ACCESS_TOKEN_TIMEOUT=900000
REFRESH_TOKEN_KEY=replace-with-another-long-random-secret
REFRESH_TOKEN_TIMEOUT=604800000
ORDERS_TIMEOUT=60000
```

Create your local environment:

```bash
cp .env.example .env
```

## Docker

Docker Compose runs this project's application services. PostgreSQL and Redis are managed by the separate `local-infra` project; only PostgreSQL is currently used by the API.

Application services:

```text
Development: Web :5174 -> API :3001 -> PostgreSQL :5432
Production:  Nginx :8080 -> API :3000 -> PostgreSQL :5432
```

PostgreSQL runs in the external `local-infra` project. Redis is not used by
this application.

Both application Compose modes connect to the existing external Docker network
`local-infra_local-infra` (the network created by the Compose project named
`local-infra`); PostgreSQL is provided by that infrastructure project. Set
`LOCAL_INFRA_NETWORK` if its network has a different name. Use
`docker-compose.development.yml` for API watch mode and web HMR, or
`docker-compose.production.yml` for built API and Nginx containers:

Development uses the separate `bukit-delight-development` database; production
uses the database configured in `.env.docker.production`.

```bash
docker compose --env-file .env.example -f docker-compose.development.yml up --build
```

Development web runs at `http://localhost:5174`; source edits reload the API
and web app. Production configuration and recovery steps are in
[deployment preparation](docs/deployment.md). Build the application images
manually from the repository root only when needed:

```bash
docker build -f docker/api.Dockerfile -t bukit-delight-api:local .
docker build -f docker/web.Dockerfile -t bukit-delight-web:local .
```

The production web image runs Nginx on port 80, serves the SPA, and proxies
`/api/` and `/socket.io/` to the production API network alias
`bukit-delight-production-api`. The API listens on port 3000; Compose exposes
the production web app on port 8080 by default. See
[deployment preparation](docs/deployment.md) for runtime variables and the
production release gates, PostgreSQL recovery procedure, and operational
monitoring checklist.

```text
Development: Web :5174 -> API :3001 -> PostgreSQL :5432
Production:  Nginx :8080 -> API :3000 -> PostgreSQL :5432
```

## Local Development

### Requirements

Install:

- Node.js
- pnpm
- Docker
- Docker Compose

Check versions:

```bash
node --version
pnpm --version
docker --version
docker compose version
```

### Installation

Clone the repository:

```bash
git clone https://github.com/alpinnz/bukit-delight-node.git
cd bukit-delight-node
```

Install dependencies:

```bash
pnpm install
```

Create environment variables:

```bash
cp .env.example .env
```

## Start Infrastructure

Start the separate `local-infra` Compose project first. It must create the
external Docker network `local-infra_local-infra` and provide PostgreSQL as
`postgres:5432` on that network. Set `LOCAL_INFRA_NETWORK` if the network name
differs. This repository does not start or own shared
PostgreSQL or other shared infrastructure services.

## Database Setup

Generate Prisma client:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

Seed database:

```bash
pnpm db:seed
```

In non-production environments, the seed creates these starter accounts if
they do not already exist:

| Username  | Password  | Role      |
| --------- | --------- | --------- |
| `admin`   | `admin`   | `admin`   |
| `cashier` | `cashier` | `cashier` |

These credentials are for local development only. The seed does not create
them when `NODE_ENV=production` and does not reset passwords on existing
accounts.

## Start Development

Run frontend and backend:

```bash
pnpm dev
```

Or separately:

```bash
pnpm dev:web
```

```bash
pnpm dev:api
```

Default URLs:

```text
Frontend
http://localhost:5173

Backend
http://localhost:3000
```

## API

The API is mounted at `/api/v1`. Current route groups include:

```text
/api/v1/authentication
/api/v1/accounts
/api/v1/categories
/api/v1/customers
/api/v1/item-orders
/api/v1/menus
/api/v1/orders
/api/v1/roles
/api/v1/tables
/api/v1/transactions
```

Examples:

```text
POST   /api/v1/authentication/login
POST   /api/v1/authentication/refresh-token
GET    /api/v1/categories
GET    /api/v1/menus
GET    /api/v1/tables
GET    /api/v1/orders
GET    /api/v1/transactions
```

## API Response Format

Success:

```json
{
  "success": true,
  "name": "Success",
  "message": "Categories success",
  "code": 0,
  "status": 200,
  "data": []
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Category not found"
  },
  "name": "Error",
  "message": "Category not found",
  "code": "NOT_FOUND",
  "status": 404
}
```

## Authentication

Authentication should be handled centrally.

```text
Login
  │
  ▼
POST /api/v1/authentication/login
  │
  ▼
Validate credentials
  │
  ▼
Generate token
  │
  ▼
Return authentication result
```

Protected routes use authentication middleware:

```text
Request
   │
   ▼
Auth Middleware
   │
   ├── Invalid → 401
   │
   ▼
Controller
```

## Error Handling

All unexpected errors should go through a centralized error middleware.

```text
Controller
    │
    ▼
Service
    │
    ▼
Error
    │
    ▼
Error Middleware
    │
    ▼
HTTP Response
```

Avoid returning raw errors directly to users.

## Logging

Use structured logging.

Example:

```text
INFO  Server started
INFO  Database connected
ERROR Database query failed
```

Redis and rate limiting are not currently part of the API runtime.

Do not log:

- Passwords
- JWT secrets
- Access tokens
- Refresh tokens
- Sensitive personal information

## Testing

The API uses Node's test runner for files under `apps/api/test`. The web app
uses Vitest and React Testing Library, with tests beside the source files.
Current coverage includes API routes and Prisma services, web reducers,
helpers, route guards, and UI behavior.

```text
Unit Tests
    │
    ├── Services
    ├── Utilities
    └── Business Logic

Integration Tests
    │
    ├── Prisma services
    └── API routes

Frontend Tests
    │
    ├── Components
    ├── Hooks
    └── Features
```

Run all tests:

```bash
pnpm test
```

Backend only:

```bash
pnpm test:api
```

Frontend only:

```bash
pnpm test:web
```

## Code Quality

Run lint:

```bash
pnpm lint
```

ESLint currently checks the API's JavaScript test support files. API and web TypeScript source are checked by `pnpm typecheck`; the web package does not define a separate ESLint script.

Run type checking:

```bash
pnpm typecheck
```

Format code:

```bash
pnpm format
```

Check formatting:

```bash
pnpm format:check
```

## Git Workflow

Recommended branch structure:

```text
main
│
├── develop
│
├── feature/auth
├── feature/categories
├── feature/orders
│
├── fix/login
└── chore/update-dependencies
```

Commit convention:

```text
feat: add user authentication
fix: handle invalid login credentials
refactor: simplify user service
test: add user service tests
docs: update API documentation
chore: update dependencies
```

## Pull Request

Before opening a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

A pull request should:

- Have a clear description
- Contain focused changes
- Include tests when necessary
- Avoid unrelated refactoring
- Pass CI
- Not contain secrets

## CI/CD

The GitHub Actions workflow in `.github/workflows/ci.yml` runs:

```text
Pull Request
     │
     ▼
Install Dependencies
     │
     ▼
Build
     │
     ▼
Typecheck
     │
     ▼
Lint
     │
     ▼
Test
```

Production deployment can then be triggered after the CI pipeline passes.

## Security

Basic security practices:

- Validate all incoming requests.
- Use HTTPS in production.
- Hash passwords using a secure password hashing algorithm.
- Never store plaintext passwords.
- Never commit `.env`.
- Use secure HTTP headers.
- Configure CORS explicitly.
- Apply rate limiting.
- Sanitize user-controlled input.
- Keep dependencies updated.
- Use short-lived access tokens where appropriate.
- Rotate secrets when necessary.

## Dependency Rules

The dependency direction should be maintained:

```text
Frontend
   │
   ▼
Shared

Backend
   │
   ▼
Shared
```

Frontend must not import backend implementation.

Bad:

```text
apps/web
   ↓
apps/api/prisma
```

Good:

```text
apps/web
   ↓
packages/shared
```

And:

```text
apps/api
   ↓
packages/shared
```

## Adding a New Backend Module

For a new API domain, follow the existing route/controller/service structure:

```text
apps/api/src/
├── routes/v1/<Domain>.ts
├── controllers/Prisma<Domain>.ts
└── services/Prisma<Domain>.ts
```

Add only the files the domain needs, then mount its route in
`apps/api/src/routes/v1/index.ts`. Use Joi for runtime validation and export
shared TypeScript contracts only when both applications consume them. Do not
add a repository layer unless it provides a concrete benefit.

For example, catalog endpoints live at `/api/v1/categories`, `/api/v1/menus`,
and `/api/v1/tables`.

## Adding a New Frontend Feature

Add pages and components under the feature that owns them:

```text
apps/web/src/features/<feature>/
```

Current feature folders are `admin`, `auth`, `customer`, `kasir`, and `landing`.
Shared UI belongs in `apps/web/src/components/common`; shared Redux actions and
reducers currently live in `apps/web/src/actions` and `apps/web/src/reducers`.

## Naming Convention

### Files

Follow the naming used by the existing domain files and their framework
conventions.

```text
PrismaCatalog.ts
categories.action.ts
form.tsx
```

### Components

Use PascalCase:

```text
CategoryCard.tsx
LoginForm.tsx
MenuTable.tsx
```

### Functions

Use camelCase:

```ts
fetchCategories();
createOrder();
validateToken();
```

### Classes

Use PascalCase:

```ts
PrismaCatalog;
PrismaOrders;
```

## Folder Responsibilities

### `apps/web`

React application responsible for:

- UI
- Routing
- Client state
- API communication
- User interaction

### `apps/api`

Express application responsible for:

- HTTP API
- Authentication
- Authorization
- Business logic
- Database access
- External integrations

### `packages/shared`

TypeScript contracts and constants shared between applications:

- Request and response types
- Domain types
- Constants

It should not contain:

- Express-specific code
- React-specific code
- Database implementation

### `apps/api/prisma`

PostgreSQL schema, migrations, seed data, and the one-time MongoDB importer.

### `docker`

Container definitions and infrastructure configuration.

### `docs`

Technical documentation and architecture decisions.

## Development Philosophy

The project aims to follow:

- Clean Code
- SOLID principles
- Separation of Concerns
- DRY where appropriate
- KISS
- Composition over inheritance
- Feature-based organization
- Explicit dependencies
- Testable business logic

Architecture should not become an abstraction exercise. Prefer simple code when simple code is enough.

## Recommended Dependency Direction

Backend:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

Frontend:

```text
Page
  ↓
Feature
  ↓
Redux action or feature component
  ↓
API client
  ↓
API
```

Shared:

```text
Shared
  ↓
TypeScript contracts and constants
```

## Production Build

Build everything:

```bash
pnpm build
```

Build frontend:

```bash
pnpm build:web
```

Build backend:

```bash
pnpm build:api
```

## Production Environment

Production should provide environment variables through the deployment platform or secret manager.

Never commit:

```text
.env
.env.production
.env.local
```

Only commit:

```text
.env.example
```

## Health Check

The API exposes `/health` and `/healthz` for process liveness. `/readyz` checks PostgreSQL connectivity.

A successful liveness response is:

```json
{
  "status": "ok"
}
```

Redis is managed by the separate `local-infra` project and is not required for API readiness.

## Future Extensions

Additional applications can be added when there is a concrete product need. Shared TypeScript contracts already belong in `packages/shared`; keep configuration at the repository root unless separate package ownership becomes necessary.

## Quick Commands

Install dependencies:

```bash
pnpm install
```

Start development:

```bash
pnpm dev
```

Start only frontend:

```bash
pnpm dev:web
```

Start only backend:

```bash
pnpm dev:api
```

Build:

```bash
pnpm build
```

Test:

```bash
pnpm test
```

Lint:

```bash
pnpm lint
```

Typecheck:

```bash
pnpm typecheck
```

Format:

```bash
pnpm format
```

Start the development application (ensure `local-infra` is already running):

```bash
docker compose --env-file .env.example -f docker-compose.development.yml up --build
```

Stop the development application:

```bash
docker compose --env-file .env.example -f docker-compose.development.yml down
```

Start the production application after creating `.env.docker.production` with
the required production secrets and PostgreSQL `DATABASE_URL`:

```bash
docker compose --env-file .env.docker.production -f docker-compose.production.yml -p bukit-delight-production up -d --build
```

Check production container health:

```bash
docker compose --env-file .env.docker.production -f docker-compose.production.yml -p bukit-delight-production ps
```

Stop the production application:

```bash
docker compose --env-file .env.docker.production -f docker-compose.production.yml -p bukit-delight-production down
```

Database migration:

```bash
pnpm db:migrate
```

Generate Prisma:

```bash
pnpm db:generate
```

## License

This repository does not currently include a license file.

## Author

Alfin Noviaji

Portfolio: https://alpinnz.github.io

GitHub: https://github.com/alpinnz
