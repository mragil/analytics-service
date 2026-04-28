CREATE TABLE "pageviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
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
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"api_key" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sites_domain_unique" UNIQUE("domain"),
	CONSTRAINT "sites_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
ALTER TABLE "pageviews" ADD CONSTRAINT "pageviews_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;