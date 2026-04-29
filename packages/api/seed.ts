import { db } from './src/db';
import { sites } from './src/db/schema';
import crypto from 'crypto';

async function seed() {
  const name = process.argv[2] || 'My Website';
  const domain = process.argv[3] || 'example.com';

  const apiKey = crypto.randomBytes(32).toString('hex');
  const [site] = await db
    .insert(sites)
    .values({
      name,
      domain,
      apiKey,
    })
    .onConflictDoUpdate({
      target: sites.domain,
      set: { apiKey },
    })
    .returning();

  console.log(`Site: ${site.name} (${site.domain})`);
  console.log(`  ID: ${site.id}`);
  console.log(`  API Key: ${apiKey}`);
  console.log(`  Script: <script defer src="https://api.analytics.mrtrr.web.id/track.js" data-api="https://api.analytics.mrtrr.web.id" data-site="${site.id}"></script>`);
  console.log('');
  console.log('Seed completed!');

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
