import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL || 'postgresql://analytics:analytics@localhost:5432/analytics');

export const db = drizzle(client, { schema });
