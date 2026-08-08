import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type AnalyticsDB = ReturnType<typeof createDb>;

export function createDb(binding: D1Database) {
  return drizzle(binding, { schema });
}
