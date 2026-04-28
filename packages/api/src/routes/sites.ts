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

  const count = await db.$count(sites);
  if (count > 0) {
    return c.json({ error: 'Already seeded' }, 403);
  }

  const apiKey = randomBytes(32).toString('hex');
  const [site] = await db
    .insert(sites)
    .values({
      name: 'My Website',
      domain: 'example.com',
      apiKey,
    })
    .returning();

  return c.json({ siteId: site.id, apiKey });
});

export default sitesRoute;
