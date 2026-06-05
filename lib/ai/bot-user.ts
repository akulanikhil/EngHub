/**
 * Ensures the AI bot user exists in the DB.
 * This is a system account used as the author of cron-generated AI replies.
 * Returns the bot user's DB id.
 */
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const AI_BOT_CLERK_ID = 'system_ai_bot'
const AI_BOT_EMAIL    = 'ai@engynation.com'
const AI_BOT_NAME     = 'EngyNation AI'

export async function getAiBotUserId(): Promise<string> {
  // Try to find existing bot user
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, AI_BOT_CLERK_ID))
    .limit(1)

  if (existing) return existing.id

  // Create bot user (first run only)
  const [created] = await db
    .insert(users)
    .values({
      clerkId:  AI_BOT_CLERK_ID,
      email:    AI_BOT_EMAIL,
      name:     AI_BOT_NAME,
      username: 'engynation_ai',
      imageUrl: null,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { name: AI_BOT_NAME, username: 'engynation_ai' },
    })
    .returning({ id: users.id })

  return created.id
}
