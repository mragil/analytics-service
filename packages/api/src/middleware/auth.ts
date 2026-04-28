import { createMiddleware } from 'hono/factory';
import { db } from '../db';
import { sites } from '../db/schema';
import { eq } from 'drizzle-orm';

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const apiKey = authHeader.split(' ')[1];
  const [site] = await db.select().from(sites).where(eq(sites.apiKey, apiKey));

  if (!site) {
    return c.json({ error: 'Invalid API key' }, 401);
  }

  c.set('site', site);
  await next();
});
