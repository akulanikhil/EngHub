import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, posts } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/posts — paginated post list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page    = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit   = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const offset  = (page - 1) * limit

  const rows = await db
    .select({
      id:         posts.id,
      title:      posts.title,
      content:    posts.content,
      createdAt:  posts.createdAt,
    })
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, page, limit })
}

// POST /api/posts — create a post
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content } = await req.json()
  if (!title?.trim() || !content?.trim())
    return NextResponse.json({ error: 'title and content are required' }, { status: 422 })
  if (title.length > 300)
    return NextResponse.json({ error: 'title must be under 300 characters' }, { status: 422 })

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [inserted] = await db
    .insert(posts)
    .values({ userId: user.id, title: title.trim(), content: content.trim() })
    .returning({ id: posts.id, title: posts.title, createdAt: posts.createdAt })

  return NextResponse.json({ data: inserted }, { status: 201 })
}
