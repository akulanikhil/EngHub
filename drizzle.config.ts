import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Use direct connection (not pooled) for migrations
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
} satisfies Config
