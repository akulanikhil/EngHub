import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Returns the DB user for the currently authenticated Clerk user.
 * If the record doesn't exist yet (e.g. webhook hasn't fired), it
 * auto-provisions one from Clerk's currentUser() data.
 * Also keeps name/imageUrl/username in sync on every call (cheap upsert).
 */
export async function ensureUser(clerkId: string): Promise<{ id: string } | null> {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.primaryEmailAddress?.emailAddress
  if (!email) return null

  const name     = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null
  const username = clerkUser.username ?? null
  const imageUrl = clerkUser.imageUrl ?? null
  const major    = (clerkUser.publicMetadata?.major as string | undefined ?? null) as typeof users.$inferInsert['major']

  const [upserted] = await db
    .insert(users)
    .values({ clerkId, email, name, username, imageUrl, major })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { name, username, imageUrl, email, ...(major ? { major } : {}) },
    })
    .returning({ id: users.id })

  return upserted ?? null
}
