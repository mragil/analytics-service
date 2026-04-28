import { db } from './src/db';
import { sites } from './src/db/schema';
import crypto from 'crypto';

async function seed() {
  const apiKey = crypto.randomBytes(32).toString('hex');

  const [site] = await db
    .insert(sites)
    .values({
      name: 'My Website',
      domain: 'example.com',
      apiKey,
    })
    .returning();

  console.log('Seed completed!');
  console.log(`Site: ${site.name} (${site.domain})`);
  console.log(`API Key: ${apiKey}`);
  console.log('');
  console.log('Add this script to your website:');
  console.log(`<script src="http://localhost:3001/track.js" data-api="http://localhost:3001" data-site="${site.id}" defer></script>`);
  console.log('');
  console.log('Use this API key for the dashboard:');
  console.log(apiKey);

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
