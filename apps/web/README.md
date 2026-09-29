# Web application

The web client is a React and TypeScript app built with Vite, Tailwind CSS v4,
Headless UI, and Heroicons. Use Tailwind utilities for layout and styling,
Headless UI for accessible interactive primitives, and Heroicons for icons.
Feature routes and screens live under `src/features`; shared UI components
live under `src/components`.

Run these commands from the repository root:

```sh
corepack pnpm dev:web
corepack pnpm build:web
corepack pnpm --filter @bukit-delight/web typecheck
corepack pnpm --filter @bukit-delight/web test
```

The Vite development server listens on port 5173 and proxies `/api` to the API
port configured by `API_PORT` (default `3000`). Production web assets are built
into the Docker image and served by Nginx through the production Compose stack.
