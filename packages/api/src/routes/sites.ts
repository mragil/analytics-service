import { Hono } from 'hono';
import { db } from '../db';
import { sites } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { desc } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

const sitesRoute = new Hono();

sitesRoute.use('/api/sites', authMiddleware);

sitesRoute.get('/api/sites', async (c) => {
  const allSites = await db.select().from(sites).orderBy(desc(sites.createdAt));
  return c.json(allSites);
});

sitesRoute.post('/api/seed', async (c) => {
  const seedSecret = c.req.query('secret');
  if (seedSecret !== process.env.SEED_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const name = c.req.query('name');
  const domain = c.req.query('domain');

  if (!name || !domain) {
    return c.json({ error: 'Missing name or domain query params' }, 400);
  }

  const apiKey = randomBytes(32).toString('hex');
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
