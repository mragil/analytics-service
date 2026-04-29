import { Hono } from 'hono';
import { db } from '../db';
import { pageviews, sites } from '../db/schema';
import { hashIP } from '../lib/hash';
import { parseUserAgent } from '../lib/ua';
import { lookupGeo } from '../lib/geo';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const track = new Hono();

track.post('/track', async (c) => {
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

  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || c.req.header('x-client-ip') || '';
  const ipHash = hashIP(ip);
  const ua = c.req.header('user-agent') || '';
  const { device, browser, os } = parseUserAgent(ua);
  const { country, city } = lookupGeo(ip);

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

track.get('/track.js', async (c) => {
  const scriptPath = path.resolve(__dirname, '../../tracking-script/dist/tracker.iife.js');
  try {
    const script = fs.readFileSync(scriptPath, 'utf-8');
    c.header('Content-Type', 'application/javascript');
    return c.body(script);
  } catch {
    return c.json({ error: 'Tracking script not built' }, 500);
  }
});

export default track;
