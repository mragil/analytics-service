# analytics-service

Lightweight, self-hosted web analytics platform — privacy-friendly tracking script, real-time dashboard, and REST API. Built with Hono, React, PostgreSQL, and Drizzle ORM. Docker-ready for Coolify/VPS deployment.

## Features

- **Privacy-first** — no cookies, no personal data collection, GDPR-friendly
- **Lightweight tracking script** — minimal bundle size, uses `sendBeacon` for reliable delivery
- **Real-time dashboard** — view page views, sessions, referrers, screen sizes, and more
- **SPA support** — automatically tracks navigation via `pushState`/`popstate`
- **Geo IP lookup** — resolve visitor location via MaxMind
- **User-Agent parsing** — extract device and browser info via `ua-parser-js`
- **REST API** — programmatic access to all analytics data
- **Docker-ready** — one-command deployment with Docker Compose
- **Self-hosted** — full control over your data, no third-party dependencies

## Architecture

```
analytics-service/
├── packages/
│   ├── api/              # Hono REST API (Node.js + TypeScript)
│   │   ├── drizzle/      # Database migrations
│   │   ├── Dockerfile    # Multi-stage build with auto-migration
│   │   └── seed.ts       # Seeds initial site with API key
│   ├── dashboard/        # React + Vite + TanStack Router dashboard
│   └── tracking-script/  # Lightweight IIFE browser tracking script
├── shared/               # Shared TypeScript types
├── docker-compose.yml    # PostgreSQL, API, and dashboard services
└── package.json          # Root workspace config (pnpm)
```

### Package Overview

| Package | Description |
|---|---|
| `packages/api` | Hono-based REST API with Drizzle ORM, CORS, rate limiting, and auth middleware |
| `packages/dashboard` | React SPA with TanStack Router, TailwindCSS, served via nginx in Docker |
| `packages/tracking-script` | Minified IIFE tracking script built with esbuild |
| `shared` | Shared TypeScript types across all packages |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- Docker & Docker Compose (optional, for containerized deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd analytics-service
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` in the `packages/api` directory and configure:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics
   PORT=3001
   JWT_SECRET=your-secret-key
   ```

4. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

5. **Seed the database**

   ```bash
   pnpm db:seed
   ```

6. **Start development servers**

   ```bash
   pnpm dev
   ```

   This starts the API server, dashboard dev server, and tracking-script watcher concurrently.

### Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all services in development mode |
| `pnpm build` | Build all packages |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with initial site |

## Deployment

### Docker Compose

The easiest way to deploy is with Docker Compose:

```bash
docker compose up -d
```

This starts three services:

- **postgres** — PostgreSQL database with persistent volume
- **api** — Hono API server with auto-migration on boot
- **dashboard** — React dashboard served via nginx

### Coolify / VPS

This project is designed for platforms like [Coolify](https://coolify.io/):

1. Connect your Git repository
2. Set the build command to `pnpm build`
3. Configure environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.)
4. Deploy — Docker Compose handles the rest

For manual VPS deployment, ensure PostgreSQL is running and set `DATABASE_URL` in your `.env` before starting the services.

## Usage

### Embedding the Tracking Script

Add the following snippet to your website's `<head>` tag:

```html
<script
  defer
  src="http://your-analytics-domain.com/track.js"
  data-site-id="your-site-id"
></script>
```

Replace:

- `http://your-analytics-domain.com` with your deployed API URL
- `your-site-id` with the API key generated during seeding (or via the API)

### How It Works

The tracking script automatically:

- Records page views on load
- Tracks SPA navigation (`pushState`/`popstate`)
- Sends screen size, language, and referrer data
- Uses `navigator.sendBeacon()` for reliable delivery (falls back to `fetch`)
- Groups events into sessions with a 30-minute timeout

## API Endpoints

All endpoints (except `/health` and `/track.js`) require a `Bearer` token in the `Authorization` header. Use your site's API key.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/track` | Receive tracking events |
| `GET` | `/track.js` | Serve the tracking script (no auth required) |
| `GET` | `/stats` | Get analytics statistics |
| `POST` | `/sites` | Create a new site |
| `GET` | `/health` | Health check (no auth required) |

### Example: Get Stats

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3001/stats?siteId=1&period=7d
```

### Example: Create a Site

```bash
curl -X POST http://localhost:3001/sites \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Website", "domain": "example.com"}'
```

## Tech Stack

| Layer | Technology |
|---|---|
| **API** | [Hono](https://hono.dev/), Node.js, TypeScript |
| **Database** | PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/) |
| **Dashboard** | [React](https://react.dev/), [Vite](https://vitejs.dev/), [TanStack Router](https://tanstack.com/router), [TailwindCSS](https://tailwindcss.com/) |
| **Tracking** | Vanilla JS, esbuild (IIFE + minification) |
| **Geo IP** | [MaxMind](https://www.maxmind.com/) |
| **UA Parsing** | [ua-parser-js](https://github.com/faisalman/ua-parser-js) |
| **Infrastructure** | Docker, Docker Compose, nginx |
| **Package Manager** | [pnpm](https://pnpm.io/) workspaces |

## License

[Insert License — e.g., MIT](LICENSE)
