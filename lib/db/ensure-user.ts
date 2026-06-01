import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Returns the DB user for the currently authenticated Clerk user.
 * If the record doesn't exist yet (e.g. webhook hasn't fired), it
 * auto-provisions one from Clerk's currentUser() data.
 */
export async function ensureUser(clerkId: string): Promise<{ id: string } | null> {
  // Fast path — user already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)

  if (existing) return existing

  // Slow path — provision from Clerk data (webhook may not have fired yet)
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.primaryEmailAddress?.emailAddress
  if (!email) return null

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null
  const major = (clerkUser.publicMetadata?.major as string | undefined ?? 'cs') as typeof users.$inferInsert['major']

  const [created] = await db
    .insert(users)
    .values({ clerkId, email, name, major })
    .onConflictDoUpdate({ target: users.clerkId, set: { name, email } })
    .returning({ id: users.id })

  return created ?? null
}
