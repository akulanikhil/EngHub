ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "is_ai" boolean DEFAULT false NOT NULL;
