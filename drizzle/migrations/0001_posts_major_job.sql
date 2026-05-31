-- Add display name to users, and major/job columns to posts
-- Run via: npm run db:push, or paste into Supabase SQL editor

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "name" text;

ALTER TABLE "posts"
  ADD COLUMN IF NOT EXISTS "major" "major" NOT NULL DEFAULT 'cs',
  ADD COLUMN IF NOT EXISTS "job"   text    NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS "posts_major_idx" ON "posts" ("major");
