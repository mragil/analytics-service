FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY packages/dashboard/package.json ./packages/dashboard/
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install
COPY shared ./shared
COPY packages/dashboard ./packages/dashboard
RUN pnpm --filter @analytics/dashboard build

FROM nginx:alpine
COPY --from=builder /app/packages/dashboard/dist /usr/share/nginx/html
COPY packages/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
