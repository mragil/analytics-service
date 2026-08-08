import { Hono } from 'hono';
import { logger } from 'hono/logger';
import track from './routes/track';
import stats from './routes/stats';
import sitesRoute from './routes/sites';
import { corsMiddleware } from './middleware/cors';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { createDb } from './db';
import type { Bindings, Variables } from './types';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (c, next) => {
  c.set('db', createDb(c.env.DB));
  await next();
});

app.use('*', corsMiddleware);
app.use('*', logger());
app.use('/track', rateLimitMiddleware);

app.route('/', track);
app.route('/', stats);
app.route('/', sitesRoute);

app.get('/health', (c) => c.json({ status: 'ok' }));

app.get('/debug/env', (c) => c.json({
  hasSeedSecret: !!c.env.SEED_SECRET,
  seedSecretLength: c.env.SEED_SECRET?.length || 0,
}));

app.notFound(async (c) => {
  const url = new URL(c.req.url);
  if (url.pathname.startsWith('/api/') || url.pathname === '/track' || url.pathname === '/track.js' || url.pathname === '/health') {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
};
