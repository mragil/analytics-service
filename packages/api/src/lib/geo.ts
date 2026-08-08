import type { Context } from 'hono';

export function lookupGeo(c: Context) {
  const cf = (c.req.raw as any).cf as
    | { country?: string; city?: string }
    | undefined;
  if (!cf || !cf.country) return { country: null, city: null };
  return {
    country: cf.country || null,
    city: cf.city || null,
  };
}
