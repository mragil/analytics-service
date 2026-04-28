FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY packages/api/package.json ./packages/api/
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install
COPY shared ./shared
COPY packages/api ./packages/api
RUN pnpm --filter @analytics/api build
RUN pnpm --filter @analytics/tracking-script build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/tracking-script/dist ./packages/tracking-script/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api/node_modules ./packages/api/node_modules
COPY packages/api/package.json ./packages/api/
COPY packages/api/drizzle.config.ts ./packages/api/
COPY packages/api/drizzle ./packages/api/drizzle
EXPOSE 3001
CMD ["sh", "-c", "cd packages/api && npx drizzle-kit migrate && cd ../.. && node packages/api/dist/index.js"]
