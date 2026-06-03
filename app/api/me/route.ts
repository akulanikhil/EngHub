import { NextRequest, NextResponse } from 'next/server'
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
    .select({ id: users.id, major: users.major, name: users.name, username: users.username, imageUrl: users.imageUrl, email: users.email })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ data: user })
}

// PATCH /api/me — update major (onboarding step)
export async function PATCH(req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { major } = await req.json()
  const validMajors = ['cs', 'elec', 'mech', 'civil', 'chem', 'aero', 'bio', 'env']
  if (!validMajors.includes(major))
    return NextResponse.json({ error: 'invalid major' }, { status: 422 })

  await db
    .update(users)
    .set({ major: major as typeof users.$inferInsert['major'] })
    .where(eq(users.clerkId, clerkId))

  return NextResponse.json({ ok: true })
}
