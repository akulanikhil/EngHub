-- EngHub initial schema
-- Run via: npm run db:push (Drizzle) or paste into Supabase SQL editor

CREATE TYPE "major" AS ENUM ('cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env');

-- ── Users ────────────────────────────────────────────────────────
CREATE TABLE "users" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "clerk_id"    text NOT NULL UNIQUE,
  "email"       text NOT NULL UNIQUE,
  "major"       "major" NOT NULL,
  "grad_year"   integer,
  "role"        text,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

-- ── Forum ────────────────────────────────────────────────────────
CREATE TABLE "posts" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title"       text NOT NULL,
  "content"     text NOT NULL,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "comments" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "post_id"     uuid NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "user_id"     uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "content"     text NOT NULL,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

-- ── Salary Data ──────────────────────────────────────────────────
CREATE TABLE "salaries" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role"        text NOT NULL,
  "company"     text NOT NULL,
  "base"        integer NOT NULL,
  "bonus"       integer,
  "equity"      integer,
  "yoe"         integer NOT NULL,
  "location"    text NOT NULL,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

-- ── Salary Aggregates (pipeline-computed) ────────────────────────
-- Populated exclusively by compute_salary_aggregates worker job.
-- Never written directly by API routes.
CREATE TABLE "salary_aggregates" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "role"          text NOT NULL,
  "company"       text,                 -- NULL = aggregate across all companies
  "yoe_bucket"    text,                 -- '0-2', '2-5', '5-10', '10+'
  "p50"           numeric(10, 2),
  "p75"           numeric(10, 2),
  "p90"           numeric(10, 2),
  "avg"           numeric(10, 2),
  "count"         integer NOT NULL DEFAULT 0,
  "last_updated"  timestamp NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────
CREATE INDEX "posts_user_id_idx"          ON "posts" ("user_id");
CREATE INDEX "posts_created_at_idx"       ON "posts" ("created_at" DESC);
CREATE INDEX "comments_post_id_idx"       ON "comments" ("post_id");
CREATE INDEX "salaries_role_idx"          ON "salaries" ("role");
CREATE INDEX "salaries_role_yoe_idx"      ON "salaries" ("role", "yoe");
CREATE INDEX "salaries_company_idx"       ON "salaries" ("company");
CREATE INDEX "salaries_created_at_idx"    ON "salaries" ("created_at" DESC);
CREATE INDEX "agg_role_company_idx"       ON "salary_aggregates" ("role", "company");
CREATE INDEX "agg_role_yoe_bucket_idx"    ON "salary_aggregates" ("role", "yoe_bucket");
