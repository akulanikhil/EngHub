import postgres from 'postgres'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
)

const sql = postgres(env.DATABASE_URL_UNPOOLED, { ssl: 'require' })
await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_ai boolean DEFAULT false NOT NULL`
console.log('✅ is_ai column added to comments')
await sql.end()
