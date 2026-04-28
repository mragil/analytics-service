import { createMiddleware } from 'hono/factory';

const trackers = new Map<string, { count: number; resetAt: number }>();

export const rateLimitMiddleware = createMiddleware(async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const now = Date.now();
  const window = trackers.get(ip);

  if (window && now < window.resetAt) {
    if (window.count > 100) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }
    window.count++;
  } else {
    trackers.set(ip, { count: 1, resetAt: now + 60000 });
  }

  await next();
});
