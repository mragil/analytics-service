import type { AnalyticsDB } from './db';

export type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
  SEED_SECRET: string;
};

export type Variables = {
  db: AnalyticsDB;
  site: {
    id: string;
    name: string;
    domain: string;
    apiKey: string;
  };
};
