import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, posts, comments } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { ensureUser } from '@/lib/db/ensure-user'

// GET /api/posts — paginated post list with author info and comment counts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const majorParam = searchParams.get('major')
  const page       = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit      = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 50)))
  const offset     = (page - 1) * limit

  const validMajors = ['cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env']
  const majorFilter = majorParam && validMajors.includes(majorParam)
    ? eq(posts.major, majorParam as typeof posts.$inferSelect['major'])
    : undefined

  const rows = await db
    .select({
      id:           posts.id,
      title:        posts.title,
      content:      posts.content,
      major:        posts.major,
      job:          posts.job,
      createdAt:    posts.createdAt,
      authorName:   users.name,
      authorEmail:  users.email,
      authorMajor:  users.major,
      commentCount: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.postId} = ${posts.id})::int`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(majorFilter)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, page, limit })
}

// POST /api/posts — create a post
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, major, job } = await req.json()
  if (!title?.trim() || !content?.trim())
    return NextResponse.json({ error: 'title and content are required' }, { status: 422 })
  if (title.length > 300)
    return NextResponse.json({ error: 'title must be under 300 characters' }, { status: 422 })

  const validMajors = ['cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env']
  if (!validMajors.includes(major))
    return NextResponse.json({ error: 'invalid major' }, { status: 422 })

  const user = await ensureUser(clerkId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  try {
    const [inserted] = await db
      .insert(posts)
      .values({
        userId:  user.id,
        title:   title.trim(),
        content: content.trim(),
        major:   major as typeof posts.$inferInsert['major'],
        job:     job?.trim() ?? '',
      })
      .returning({ id: posts.id, title: posts.title, major: posts.major, job: posts.job, createdAt: posts.createdAt })

    return NextResponse.json({ data: inserted }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/posts] db error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
