# syntax=docker/dockerfile:1

FROM node:22-alpine AS development

ENV NODE_ENV=development \
    DATABASE_URL=postgresql://build:build@localhost:5432/build
WORKDIR /app
RUN corepack enable
COPY . .
RUN --network=host --mount=type=cache,id=bukit-delight-pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --network-concurrency=4
RUN pnpm --filter @bukit-delight/api db:generate
EXPOSE 3000 5173

FROM development AS build

ENV NODE_ENV=production
RUN pnpm --filter @bukit-delight/api build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    API_PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
WORKDIR /app/apps/api
CMD ["node", "dist/src/server.js"]
