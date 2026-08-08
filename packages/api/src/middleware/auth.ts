import { createMiddleware } from 'hono/factory';
import { sites } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Bindings, Variables } from '../types';

export const authMiddleware = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(async (c, next) => {
  const db = c.get('db');
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
