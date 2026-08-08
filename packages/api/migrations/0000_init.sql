CREATE TABLE IF NOT EXISTS "sites" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "domain" text NOT NULL,
  "api_key" text NOT NULL,
  "created_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pageviews" (
  "id" text PRIMARY KEY NOT NULL,
  "site_id" text NOT NULL,
  "url" text NOT NULL,
  "referrer" text,
  "session_id" text NOT NULL,
  "ip_hash" text NOT NULL,
  "country" text,
  "city" text,
  "device" text,
  "browser" text,
  "os" text,
  "screen_size" text,
  "language" text,
  "created_at" text NOT NULL,
  FOREIGN KEY ("site_id") REFERENCES "sites"("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sites_domain_unique" ON "sites" ("domain");
CREATE UNIQUE INDEX IF NOT EXISTS "sites_api_key_unique" ON "sites" ("api_key");
CREATE INDEX IF NOT EXISTS "pageviews_site_id_idx" ON "pageviews" ("site_id");
CREATE INDEX IF NOT EXISTS "pageviews_created_at_idx" ON "pageviews" ("created_at");
