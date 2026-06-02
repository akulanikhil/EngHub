import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, posts, comments } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { ensureUser } from '@/lib/db/ensure-user'

type Params = { params: Promise<{ id: string }> }

// GET /api/posts/[id]/comments
export async function GET(_req: NextRequest, { params }: Params) {
  const { id: postId } = await params

  const rows = await db
    .select({
      id:          comments.id,
      content:     comments.content,
      createdAt:   comments.createdAt,
      authorId:    users.id,
      authorName:  users.name,
      authorEmail: users.email,
      authorMajor: users.major,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(asc(comments.createdAt))

  return NextResponse.json({ data: rows })
}

// POST /api/posts/[id]/comments
export async function POST(req: NextRequest, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params
  const { content } = await req.json()

  if (!content?.trim())
    return NextResponse.json({ error: 'content is required' }, { status: 422 })

  // Verify post exists
  const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId)).limit(1)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const user = await ensureUser(clerkId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [inserted] = await db
    .insert(comments)
    .values({ postId, userId: user.id, content: content.trim() })
    .returning({ id: comments.id, content: comments.content, createdAt: comments.createdAt })

  return NextResponse.json({ data: inserted }, { status: 201 })
}
