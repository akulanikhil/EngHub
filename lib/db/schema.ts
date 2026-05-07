import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core'

// ── Enums ──────────────────────────────────────────────────────────
export const majorEnum = pgEnum('major', [
  'cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env',
])

// ── Users ──────────────────────────────────────────────────────────
// Intentionally lean — extra profile fields can go in Clerk metadata
export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  clerkId:      text('clerk_id').notNull().unique(),
  email:        text('email').notNull().unique(),
  major:        majorEnum('major').notNull(),
  gradYear:     integer('grad_year'),           // null for professionals
  role:         text('role'),                   // current job title
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

// ── Forum ──────────────────────────────────────────────────────────
export const posts = pgTable('posts', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:      text('title').notNull(),
  content:    text('content').notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
})

export const comments = pgTable('comments', {
  id:         uuid('id').primaryKey().defaultRandom(),
  postId:     uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content:    text('content').notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
})

// ── Salary Data ────────────────────────────────────────────────────
export const salaries = pgTable('salaries', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role:       text('role').notNull(),           // normalized title
  company:    text('company').notNull(),
  base:       integer('base').notNull(),         // annual, USD
  bonus:      integer('bonus'),                  // annual target bonus
  equity:     integer('equity'),                 // annual equity value
  yoe:        integer('yoe').notNull(),          // years of experience
  location:   text('location').notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
})

// ── Salary Aggregates (computed by pipeline) ───────────────────────
// Populated/updated by the compute_salary_aggregates job.
// Never written by the API directly.
export const salaryAggregates = pgTable('salary_aggregates', {
  id:           uuid('id').primaryKey().defaultRandom(),
  role:         text('role').notNull(),
  company:      text('company'),                  // null = all companies
  yoeBucket:    text('yoe_bucket'),               // '0-2', '2-5', '5-10', '10+'
  p50:          numeric('p50', { precision: 10, scale: 2 }),
  p75:          numeric('p75', { precision: 10, scale: 2 }),
  p90:          numeric('p90', { precision: 10, scale: 2 }),
  avg:          numeric('avg', { precision: 10, scale: 2 }),
  count:        integer('count').notNull().default(0),
  lastUpdated:  timestamp('last_updated').notNull().defaultNow(),
})

// ── Types ──────────────────────────────────────────────────────────
export type User            = typeof users.$inferSelect
export type NewUser         = typeof users.$inferInsert
export type Post            = typeof posts.$inferSelect
export type NewPost         = typeof posts.$inferInsert
export type Comment         = typeof comments.$inferSelect
export type NewComment      = typeof comments.$inferInsert
export type Salary          = typeof salaries.$inferSelect
export type NewSalary       = typeof salaries.$inferInsert
export type SalaryAggregate = typeof salaryAggregates.$inferSelect
