import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

// GET /api/posts/counts — returns per-major post counts
export async function GET() {
  const rows = await db
    .select({
      major: posts.major,
      count: sql<number>`count(*)::int`,
    })
    .from(posts)
    .groupBy(posts.major)

  const counts: Record<string, number> = {}
  for (const r of rows) counts[r.major] = r.count
  return NextResponse.json({ data: counts })
}
