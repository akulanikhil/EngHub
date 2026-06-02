import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ id: string }> }

// DELETE /api/posts/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [post] = await db.select({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, postId)).limit(1)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  if (post.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await db.delete(posts).where(eq(posts.id, postId))
  return NextResponse.json({ success: true })
}

// PATCH /api/posts/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params
  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'content is required' }, { status: 422 })

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [post] = await db.select({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, postId)).limit(1)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  if (post.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [updated] = await db.update(posts).set({ content: content.trim() }).where(eq(posts.id, postId)).returning({ content: posts.content })
  return NextResponse.json({ data: updated })
}
