import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const sites = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').notNull().unique(),
  apiKey: text('api_key').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pageviews = pgTable('pageviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
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
  createdAt: timestamp('created_at').defaultNow(),
});
