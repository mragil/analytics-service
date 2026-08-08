import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sites = sqliteTable('sites', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  domain: text('domain').notNull().unique(),
  apiKey: text('api_key').notNull().unique(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export const pageviews = sqliteTable('pageviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  siteId: text('site_id').references(() => sites.id).notNull(),
  url: text('url').notNull(),
  referrer: text('referrer'),
  sessionId: text('session_id').notNull(),
  ipHash: text('ip_hash').notNull(),
  country: text('country'),
  city: text('city'),
  device: text('device'),
  browser: text('browser'),
  os: text('os'),
  screenSize: text('screen_size'),
  language: text('language'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});
