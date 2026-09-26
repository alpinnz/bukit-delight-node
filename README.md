# Fullstack Monorepo

A scalable fullstack monorepo containing a React frontend and Express.js backend, managed with pnpm workspaces.

The project is designed with a modular architecture, shared packages, TypeScript, PostgreSQL, Redis, Docker, testing, and CI/CD support.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Zod
- Axios
- Vitest
- React Testing Library

### Backend

- Node.js
- Express.js
- TypeScript
- Zod
- PostgreSQL
- Redis
- Prisma
- Vitest / Jest
- Pino

### Development

- pnpm
- Docker
- Docker Compose
- ESLint
- Prettier
- Husky
- lint-staged

## Project Structure

```text
.
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── router.tsx
│   │   │   │   └── providers.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   └── common/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── pages/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── users/
│   │   │   │   ├── products/
│   │   │   │   └── orders/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── lib/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   │   ├── env.ts
│       │   │   ├── database.ts
│       │   │   └── redis.ts
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.repository.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   ├── auth.schema.ts
│       │   │   │   ├── auth.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── users/
│       │   │   ├── products/
│       │   │   └── orders/
│       │   ├── middlewares/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   ├── not-found.middleware.ts
│       │   │   └── rate-limit.middleware.ts
│       │   ├── routes/
│       │   │   └── index.ts
│       │   ├── utils/
│       │   │   ├── logger.ts
│       │   │   └── response.ts
│       │   ├── app.ts
│       │   └── server.ts
│       ├── tests/
│       ├── prisma/
│       │   ├── migrations/
│       │   └── schema.prisma
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── eslint-config/
│   │   ├── base.js
│   │   ├── react.js
│   │   └── package.json
│   └── tsconfig/
│       ├── base.json
│       ├── react.json
│       ├── node.json
│       └── package.json
│
├── database/
│   ├── seed/
│   └── README.md
├── docker/
│   ├── api.Dockerfile
│   ├── web.Dockerfile
│   └── nginx.conf
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   └── decisions.md
│   ├── api/
│   └── development/
├── scripts/
│   ├── setup.ts
│   └── clean.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── api.yml
│       └── web.yml
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

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
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────┐     ┌────────────┐     ┌────────────┐
       │ PostgreSQL │     │   Redis    │     │ External   │
       │            │     │            │     │ Services   │
       └────────────┘     └────────────┘     └────────────┘
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

The workspace contains:

```text
apps/
├── web
└── api

packages/
├── shared
├── eslint-config
└── tsconfig
```

## Root Package

Example `package.json`:

```json
{
  "name": "fullstack-monorepo",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "corepack pnpm --parallel --filter @bukit-delight/web --filter @bukit-delight/api dev",
    "dev:web": "corepack pnpm --filter @bukit-delight/web start",
    "dev:api": "corepack pnpm --filter @bukit-delight/api dev",
    "build": "corepack pnpm -r build",
    "build:web": "corepack pnpm --filter @bukit-delight/web build",
    "build:api": "corepack pnpm --filter @bukit-delight/api build",
    "test": "corepack pnpm -r test",
    "test:web": "corepack pnpm --filter @bukit-delight/web test",
    "test:api": "corepack pnpm --filter @bukit-delight/api test",
    "lint": "corepack pnpm -r lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "corepack pnpm -r typecheck",
    "db:generate": "corepack pnpm --filter @bukit-delight/api db:generate",
    "db:migrate": "corepack pnpm --filter @bukit-delight/api db:migrate",
    "db:deploy": "corepack pnpm --filter @bukit-delight/api db:deploy",
    "db:seed": "corepack pnpm --filter @bukit-delight/api db:seed",
    "db:import": "corepack pnpm --filter @bukit-delight/api db:import"
  },
  "devDependencies": {
    "prettier": "^3.0.0"
  }
}
```

## Frontend

The frontend lives inside:

```text
apps/web
```

React uses a feature-based architecture.

```text
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types.ts
│   └── index.ts
├── users/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── types.ts
└── products/
```

Everything belonging to one business feature stays together.

Global reusable UI belongs in:

```text
components/ui
```

Feature-specific components belong in:

```text
features/products/components
```

## Backend

The backend lives inside:

```text
apps/api
```

Express uses a modular architecture.

```text
modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts
│   ├── auth.routes.ts
│   ├── auth.schema.ts
│   └── auth.types.ts
├── users/
├── products/
└── orders/
```

The general flow is:

```text
HTTP Request
     │
     ▼
Middleware
     │
     ▼
Route
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Database
```

### Controller

The controller handles HTTP concerns:

- Request
- Response
- Status code
- HTTP-level validation result

It should not contain complex business logic.

```ts
export async function createUser(req, res) {
  const result = await userService.create(req.body);

  return res.status(201).json(result);
}
```

### Service

The service contains business logic.

```ts
export async function create(input: CreateUserInput) {
  const existingUser = await userRepository.findByEmail(input.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  return userRepository.create(input);
}
```

### Repository

Repositories are responsible for data access.

```text
Service
   │
   ▼
Repository
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

The service should not directly contain database queries.

## Validation

Request validation should happen through schemas.

Example:

```ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});
```

Schemas can also be shared when appropriate.

## Shared Package

Shared code lives here:

```text
packages/shared
```

Example:

```text
packages/shared/src/
├── constants/
├── schemas/
├── types/
├── utils/
└── index.ts
```

Example shared type:

```ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

Both applications can consume it:

```text
React
  │
  └── @project/shared

Express
  │
  └── @project/shared
```

## Shared API Contract

For simple projects, shared TypeScript types may be enough.

For larger applications, request and response schemas can also be shared.

Example:

```ts
export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
```

This gives the frontend and backend a common contract.

## Database

PostgreSQL is used as the primary database.

Prisma is used as the ORM.

```text
apps/api/prisma/
├── schema.prisma
└── migrations/
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

Redis can be used for:

- Session storage
- Cache
- Rate limiting
- Temporary data
- Queue support
- OTP
- Token blacklist

```text
Express
   │
   ├───────────────┐
   ▼               ▼
PostgreSQL       Redis
```

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

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=bukit-delight
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/bukit-delight?schema=public

REDIS_URL=redis://localhost:6380

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

Docker is used for infrastructure and production deployment.

Example services:

```text
┌──────────────┐
│   PostgreSQL │
│     :5432    │
└──────────────┘

┌──────────────┐
│    Redis     │
│     :6379    │
└──────────────┘
```

The current `docker-compose.yml` starts PostgreSQL and Redis for local
development. Build the application images from the repository root:

```bash
docker build -f docker/api.Dockerfile -t bukit-delight-api:local .
docker build -f docker/web.Dockerfile -t bukit-delight-web:local .
```

The web image runs Nginx on port 80, serves the SPA, and proxies `/api/` and
`/socket.io/` to the API service named `api`. The API listens on port 3000. See
[deployment preparation](docs/deployment.md) for runtime variables and the
production release gates, PostgreSQL recovery procedure, and operational
monitoring checklist.

```text
┌──────────────┐
│   React Web  │
│     :5173    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Express API  │
│     :3000    │
└──────┬───────┘
       │
   ┌───┴────┐
   ▼        ▼
Postgres   Redis
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
git clone <repository-url>
cd <repository-directory>
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

Start PostgreSQL and Redis:

```bash
docker compose --env-file .env.example up -d
```

This starts the optional Compose PostgreSQL on port `COMPOSE_POSTGRES_PORT`
(`5433` by default) and Redis on port `6380`. The example `DATABASE_URL`
targets the existing host PostgreSQL on `127.0.0.1:5432`; set it to
`localhost:5433` if the API should use the Compose PostgreSQL instead.

Check running containers:

```bash
docker compose --env-file .env.example ps
```

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

The API should use versioned routes.

```text
/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/orders
```

Example:

```text
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

## API Response Format

Success:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Alfin"
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

## Authentication

Authentication should be handled centrally.

```text
Login
  │
  ▼
POST /api/v1/auth/login
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
INFO  Redis connected
WARN  Rate limit reached
ERROR Database query failed
```

Do not log:

- Passwords
- JWT secrets
- Access tokens
- Refresh tokens
- Sensitive personal information

## Testing

Testing exists at multiple levels.

```text
Unit Tests
    │
    ├── Services
    ├── Utilities
    └── Business Logic

Integration Tests
    │
    ├── Repository
    ├── Database
    └── API

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
├── feature/users
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

GitHub Actions can run:

```text
Pull Request
     │
     ▼
Install Dependencies
     │
     ▼
Lint
     │
     ▼
Typecheck
     │
     ▼
Test
     │
     ▼
Build
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
apps/api/src/database
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

For a `products` feature:

```text
apps/api/src/modules/products/

├── product.controller.ts
├── product.service.ts
├── product.repository.ts
├── product.routes.ts
├── product.schema.ts
├── product.types.ts
└── index.ts
```

Then register the route:

```ts
router.use("/products", productRoutes);
```

The API becomes:

```text
/api/v1/products
```

## Adding a New Frontend Feature

Create:

```text
apps/web/src/features/products/

├── components/
├── hooks/
├── pages/
├── services/
├── types.ts
└── index.ts
```

The feature should own its business-specific UI and logic.

## Naming Convention

### Files

Use consistent naming.

```text
auth.service.ts
user.repository.ts
create-user.schema.ts
```

### Components

Use PascalCase:

```text
UserCard.tsx
LoginForm.tsx
ProductTable.tsx
```

### Functions

Use camelCase:

```ts
createUser();
getUserById();
validateToken();
```

### Classes

Use PascalCase:

```ts
UserService;
UserRepository;
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

Code shared between applications:

- Types
- Schemas
- Constants
- Generic utilities

It should not contain:

- Express-specific code
- React-specific code
- Database implementation

### `database`

Database-related documentation and resources.

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
Repository
  ↓
Database
```

Frontend:

```text
Page
  ↓
Feature
  ↓
Hook
  ↓
Service
  ↓
API
```

Shared:

```text
Shared
  ↓
Types
Schemas
Constants
Utilities
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

The API should expose:

```text
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

For production environments, the health check can also verify:

```text
API
 │
 ├── PostgreSQL
 │
 └── Redis
```

## Future Extensions

The monorepo can be extended with:

```text
apps/
├── web
├── api
├── admin
└── worker
```

And shared packages:

```text
packages/
├── shared
├── ui
├── eslint-config
├── tsconfig
└── api-client
```

For example:

```text
                    Monorepo
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
       Web            API           Worker
        │              │              │
        └──────────────┼──────────────┘
                       │
                  Shared Packages
```

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

Start Docker:

```bash
docker compose --env-file .env.example up -d
```

Stop Docker:

```bash
docker compose --env-file .env.example down
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

Add your preferred license here.

Example:

```text
MIT License
```

## Author

Alfin Noviaji

Portfolio: https://alpinnz.github.io

GitHub: https://github.com/alpinnz
