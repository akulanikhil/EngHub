-- EngHub initial schema
-- Run via: npm run db:push (or apply manually in Supabase SQL editor)

CREATE TYPE "major" AS ENUM ('cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env');
CREATE TYPE "user_type" AS ENUM ('student', 'professional');
CREATE TYPE "vote_type" AS ENUM ('up', 'down');

CREATE TABLE "users" (
  "id"               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "clerk_id"         text NOT NULL UNIQUE,
  "name"             text NOT NULL,
  "username"         text NOT NULL UNIQUE,
  "email"            text NOT NULL UNIQUE,
  "major"            "major" NOT NULL,
  "type"             "user_type" NOT NULL DEFAULT 'student',
  "company"          text,
  "graduation_year"  integer,
  "bio"              text,
  "created_at"       timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "posts" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "author_id"   uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "major"       "major" NOT NULL,
  "job_role"    text NOT NULL,
  "title"       text NOT NULL,
  "content"     text NOT NULL,
  "upvotes"     integer NOT NULL DEFAULT 0,
  "downvotes"   integer NOT NULL DEFAULT 0,
  "is_pinned"   boolean NOT NULL DEFAULT false,
  "created_at"  timestamp NOT NULL DEFAULT now(),
  "updated_at"  timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "comments" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "post_id"     uuid NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "author_id"   uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "content"     text NOT NULL,
  "upvotes"     integer NOT NULL DEFAULT 0,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "votes" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "post_id"     uuid REFERENCES "posts"("id") ON DELETE CASCADE,
  "comment_id"  uuid REFERENCES "comments"("id") ON DELETE CASCADE,
  "type"        "vote_type" NOT NULL,
  "created_at"  timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "salary_reports" (
  "id"                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"              uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "major"                "major" NOT NULL,
  "job_role"             text NOT NULL,
  "company"              text NOT NULL,
  "base_salary"          integer NOT NULL,
  "total_comp"           integer,
  "years_of_experience"  integer NOT NULL,
  "location"             text NOT NULL,
  "created_at"           timestamp NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX "posts_major_idx"           ON "posts" ("major");
CREATE INDEX "posts_job_role_idx"        ON "posts" ("job_role");
CREATE INDEX "posts_created_at_idx"      ON "posts" ("created_at" DESC);
CREATE INDEX "comments_post_id_idx"      ON "comments" ("post_id");
CREATE INDEX "votes_user_post_idx"       ON "votes" ("user_id", "post_id");
CREATE INDEX "salary_major_role_idx"     ON "salary_reports" ("major", "job_role");
