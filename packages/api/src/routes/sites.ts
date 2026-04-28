import { Hono } from 'hono';
import { db } from '../db';
import { sites } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { desc } from 'drizzle-orm';

const sitesRoute = new Hono();

sitesRoute.use('/api/sites', authMiddleware);

sitesRoute.get('/api/sites', async (c) => {
  const allSites = await db.select().from(sites).orderBy(desc(sites.createdAt));
  return c.json(allSites);
});

export default sitesRoute;
