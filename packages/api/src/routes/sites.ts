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

  const sitesToSeed = [
    { name: 'My Website', domain: 'example.com' },
    { name: 'TripJot', domain: 'itinerary-planner' },
  ];

  const results = [];
  for (const siteConfig of sitesToSeed) {
    const apiKey = randomBytes(32).toString('hex');
    const [site] = await db
      .insert(sites)
      .values({
        name: siteConfig.name,
        domain: siteConfig.domain,
        apiKey,
      })
      .onConflictDoUpdate({
        target: sites.domain,
        set: { apiKey },
      })
      .returning();

    results.push({ siteId: site.id, domain: site.domain, apiKey: site.apiKey });
  }

  return c.json({ sites: results });
});

export default sitesRoute;
