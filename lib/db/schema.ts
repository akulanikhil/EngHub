import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const majorEnum = pgEnum('major', [
  'cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env',
])

export const userTypeEnum = pgEnum('user_type', ['student', 'professional'])

export const voteTypeEnum = pgEnum('vote_type', ['up', 'down'])

export const users = pgTable('users', {
  id:               uuid('id').primaryKey().defaultRandom(),
  clerkId:          text('clerk_id').notNull().unique(),
  name:             text('name').notNull(),
  username:         text('username').notNull().unique(),
  email:            text('email').notNull().unique(),
  major:            majorEnum('major').notNull(),
  type:             userTypeEnum('type').notNull().default('student'),
  company:          text('company'),
  graduationYear:   integer('graduation_year'),
  bio:              text('bio'),
  createdAt:        timestamp('created_at').notNull().defaultNow(),
})

export const posts = pgTable('posts', {
  id:         uuid('id').primaryKey().defaultRandom(),
  authorId:   uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  major:      majorEnum('major').notNull(),
  jobRole:    text('job_role').notNull(),
  title:      text('title').notNull(),
  content:    text('content').notNull(),
  upvotes:    integer('upvotes').notNull().default(0),
  downvotes:  integer('downvotes').notNull().default(0),
  isPinned:   boolean('is_pinned').notNull().default(false),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  updatedAt:  timestamp('updated_at').notNull().defaultNow(),
})

export const comments = pgTable('comments', {
  id:         uuid('id').primaryKey().defaultRandom(),
  postId:     uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId:   uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content:    text('content').notNull(),
  upvotes:    integer('upvotes').notNull().default(0),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
})

export const votes = pgTable('votes', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId:     uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  commentId:  uuid('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
  type:       voteTypeEnum('type').notNull(),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
})

export const salaryReports = pgTable('salary_reports', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  userId:             uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  major:              majorEnum('major').notNull(),
  jobRole:            text('job_role').notNull(),
  company:            text('company').notNull(),
  baseSalary:         integer('base_salary').notNull(),
  totalComp:          integer('total_comp'),
  yearsOfExperience:  integer('years_of_experience').notNull(),
  location:           text('location').notNull(),
  createdAt:          timestamp('created_at').notNull().defaultNow(),
})
