FROM node:22-alpine AS build

ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @bukit-delight/api db:generate
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
