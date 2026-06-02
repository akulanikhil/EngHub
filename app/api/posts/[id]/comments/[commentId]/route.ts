import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, comments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: Promise<{ id: string; commentId: string }> }

// DELETE /api/posts/[id]/comments/[commentId]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { commentId } = await params

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [comment] = await db.select({ id: comments.id, userId: comments.userId }).from(comments).where(eq(comments.id, commentId)).limit(1)
  if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  if (comment.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await db.delete(comments).where(eq(comments.id, commentId))
  return NextResponse.json({ success: true })
}

// PATCH /api/posts/[id]/comments/[commentId]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { commentId } = await params
  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'content is required' }, { status: 422 })

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [comment] = await db.select({ id: comments.id, userId: comments.userId }).from(comments).where(eq(comments.id, commentId)).limit(1)
  if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  if (comment.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [updated] = await db.update(comments).set({ content: content.trim() }).where(eq(comments.id, commentId)).returning({ content: comments.content })
  return NextResponse.json({ data: updated })
}
