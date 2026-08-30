# Production image for the interim "local Windows PC + Cloudflare Tunnel"
# deployment (see infra/compose.prod.yml and docs/deploy-local-tunnel.md).
#
# This is deliberately a single, un-pruned image — it keeps the full
# node_modules (incl. dev deps like tsx) and the src/ tree so `payload migrate`
# and `pnpm seed` can still be run as one-off commands against the running
# container. That trades a larger image for an operator who can run one
# `docker compose` command without knowing what a "standalone build" is.
# When this project moves to the real VPS/CI pipeline (openspec
# delivery-infra), replace this with a proper multi-stage `output: 'standalone'`
# build and a registry-based promotion flow.
FROM node:22-bookworm-slim

RUN corepack enable
WORKDIR /app

# Install dependencies first so this layer is reused when only source changes.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build-time-only placeholders. Payload's config reads these at import time
# but nothing in the build touches a real database or uses the real secret —
# see the note in docs/deploy-local-tunnel.md. The real values are supplied at
# container *runtime* via infra/compose.prod.yml, never baked into the image.
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV DATABASE_URI=postgres://build:build@build-placeholder:5432/build
ENV PAYLOAD_SECRET=build-time-placeholder-not-used-at-runtime
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
