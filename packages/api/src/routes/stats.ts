import { Hono } from 'hono';
import { db } from '../db';
import { pageviews } from '../db/schema';
import { eq, sql, gte, lte, desc, count, countDistinct } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const stats = new Hono();

stats.use('/api/stats/*', authMiddleware);

stats.get('/api/stats', async (c) => {
  const { from, to } = c.req.query();

  const totalVisits = await db
    .select({ value: count() })
    .from(pageviews);

  const uniqueVisitors = await db
    .select({ value: countDistinct(pageviews.sessionId) })
    .from(pageviews);

  const timeSeriesRaw = await db
    .select({
      date: sql<string>`DATE(${pageviews.createdAt})`,
      visits: count(),
      uniques: countDistinct(pageviews.sessionId),
    })
    .from(pageviews)
    .groupBy(sql`DATE(${pageviews.createdAt})`)
    .orderBy(sql`DATE(${pageviews.createdAt})`);

  return c.json({
    totalVisits: totalVisits[0]?.value || 0,
    uniqueVisitors: uniqueVisitors[0]?.value || 0,
    bounceRate: 0,
    avgDuration: 0,
    timeSeries: timeSeriesRaw.map((row) => ({
      date: row.date,
      visits: Number(row.visits),
      uniques: Number(row.uniques),
    })),
  });
});

stats.get('/api/stats/:siteId', async (c) => {
  const siteId = c.req.param('siteId');
  const { from, to } = c.req.query();

  const baseWhere = [eq(pageviews.siteId, siteId)];
  if (from && to) {
    baseWhere.push(gte(pageviews.createdAt, new Date(from)), lte(pageviews.createdAt, new Date(to)));
  }

  const topPages = await db
    .select({
      url: pageviews.url,
      visits: count(),
      uniques: countDistinct(pageviews.sessionId),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(pageviews.url)
    .orderBy(desc(count()))
    .limit(20);

  const referrers = await db
    .select({
      referrer: pageviews.referrer,
      visits: count(),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(pageviews.referrer)
    .orderBy(desc(count()))
    .limit(20);

  const geo = await db
    .select({
      country: pageviews.country,
      city: pageviews.city,
      visits: count(),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(pageviews.country, pageviews.city)
    .orderBy(desc(count()))
    .limit(20);

  const devices = await db
    .select({
      device: pageviews.device,
      visits: count(),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(pageviews.device)
    .orderBy(desc(count()));

  const browsers = await db
    .select({
      browser: pageviews.browser,
      visits: count(),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(pageviews.browser)
    .orderBy(desc(count()));

  const os = await db
    .select({
      os: pageviews.os,
      visits: count(),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(pageviews.os)
    .orderBy(desc(count()));

  const timeSeries = await db
    .select({
      date: sql<string>`DATE(${pageviews.createdAt})`,
      visits: count(),
      uniques: countDistinct(pageviews.sessionId),
    })
    .from(pageviews)
    .where(baseWhere[0])
    .groupBy(sql`DATE(${pageviews.createdAt})`)
    .orderBy(sql`DATE(${pageviews.createdAt})`);

  return c.json({
    topPages,
    referrers: referrers.map((r) => ({ ...r, referrer: r.referrer || '(direct)' })),
    geo: geo.filter((g) => g.country),
    devices: devices.filter((d) => d.device),
    browsers: browsers.filter((b) => b.browser),
    os: os.filter((o) => o.os),
    timeSeries: timeSeries.map((row) => ({
      date: row.date,
      visits: Number(row.visits),
      uniques: Number(row.uniques),
    })),
  });
});

export default stats;
