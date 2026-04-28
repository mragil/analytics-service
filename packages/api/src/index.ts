import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import track from './routes/track';
import stats from './routes/stats';
import sitesRoute from './routes/sites';
import { corsMiddleware } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { initGeoLookup } from './lib/geo';

const app = new Hono();

app.use('*', corsMiddleware);
app.use('*', logger());
app.use('/track', rateLimitMiddleware);

app.route('/', track);
app.route('/', stats);
app.route('/', sitesRoute);

app.get('/health', (c) => c.json({ status: 'ok' }));

const port = Number(process.env.PORT) || 3001;

await initGeoLookup();

console.log(`Analytics API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
