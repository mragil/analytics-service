import { Hono } from 'hono';
import { sites } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { desc } from 'drizzle-orm';
import type { Bindings, Variables } from '../types';

const sitesRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

sitesRoute.use('/api/sites', authMiddleware);
sitesRoute.use('/api/me', authMiddleware);

sitesRoute.get('/api/me', async (c) => {
  const site = c.get('site');
  return c.json({ id: site.id, name: site.name, domain: site.domain });
});

sitesRoute.get('/api/sites', async (c) => {
  const db = c.get('db');
  const allSites = await db.select().from(sites).orderBy(desc(sites.createdAt));
  return c.json(allSites);
});

sitesRoute.post('/api/seed', async (c) => {
  const seedSecret = c.req.query('secret');
  if (seedSecret !== c.env.SEED_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const name = c.req.query('name');
  const domain = c.req.query('domain');

  if (!name || !domain) {
    return c.json({ error: 'Missing name or domain query params' }, 400);
  }

  const db = c.get('db');
  const apiKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const [site] = await db
    .insert(sites)
    .values({
      name,
      domain,
      apiKey,
    })
    .onConflictDoUpdate({
      target: sites.domain,
      set: { apiKey },
    })
    .returning();

  return c.json({ siteId: site.id, domain: site.domain, apiKey: site.apiKey });
});

export default sitesRoute;
