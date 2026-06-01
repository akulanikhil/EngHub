import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { ensureUser } from '@/lib/db/ensure-user'

export async function GET() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureUser(clerkId)

  const [user] = await db
    .select({ id: users.id, major: users.major, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ data: user })
}
