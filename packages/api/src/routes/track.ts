import { Hono } from 'hono';
import { pageviews, sites } from '../db/schema';
import { hashIP } from '../lib/hash';
import { parseUserAgent } from '../lib/ua';
import { lookupGeo } from '../lib/geo';
import { eq } from 'drizzle-orm';
import type { Bindings, Variables } from '../types';

const track = new Hono<{ Bindings: Bindings; Variables: Variables }>();

track.post('/track', async (c) => {
  const db = c.get('db');
  const text = await c.req.text();
  const body = JSON.parse(text);
  const { siteId, url, referrer, sessionId, screenSize, language } = body;

  if (!siteId || !url || !sessionId) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const [site] = await db.select().from(sites).where(eq(sites.id, siteId));

  if (!site) {
    return c.json({ error: 'Site not found' }, 404);
  }

  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const ipHash = await hashIP(ip);
  const ua = c.req.header('user-agent') || '';
  const { device, browser, os } = parseUserAgent(ua);
  const { country, city } = lookupGeo(c);

  await db.insert(pageviews).values({
    siteId,
    url,
    referrer: referrer || null,
    sessionId,
    ipHash,
    country,
    city,
    device,
    browser,
    os,
    screenSize: screenSize || null,
    language: language || null,
  });

  return c.json({ success: true });
});

export default track;
