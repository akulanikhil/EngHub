import postgres from 'postgres'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.split('=')[0].trim(), l.slice(l.indexOf('=') + 1).trim()])
)

const sql = postgres(env.DATABASE_URL_UNPOOLED, { ssl: 'require' })

await sql`ALTER TABLE users ALTER COLUMN major DROP NOT NULL`
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username text`
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url text`

console.log('✅ Phase 3 migration complete')
await sql.end()
