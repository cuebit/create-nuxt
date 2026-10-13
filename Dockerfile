# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base

ARG COREPACK_VERSION=0.36.0

RUN npm install --global "corepack@${COREPACK_VERSION}"

WORKDIR /app

COPY package.json ./
RUN corepack install

FROM base AS dependencies

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS development

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

FROM dependencies AS build

COPY . .
RUN pnpm build

FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

WORKDIR /app

COPY --from=build --chown=node:node /app/.output ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server/index.mjs"]
