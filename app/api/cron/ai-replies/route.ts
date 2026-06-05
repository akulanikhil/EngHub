/**
 * POST /api/cron/ai-replies
 *
 * Finds posts that are 5+ days old with no human replies and generates
 * an AI response for each one (up to MAX_PER_RUN per invocation).
 *
 * Security: protected by CRON_SECRET header — set this in Vercel env vars
 * and pass it in the vercel.json cron authorization header.
 *
 * Vercel Cron runs this daily at 10:00 UTC.
 */
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, comments } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { generateText, FORUM_REPLY_SYSTEM_PROMPT } from '@/lib/ai/generate'
import { getAiBotUserId } from '@/lib/ai/bot-user'

const MAX_PER_RUN = 5  // avoid long-running responses on Vercel
const DAYS_WITHOUT_REPLY = 5

// Map major codes to human-readable names for the AI prompt
const MAJOR_LABELS: Record<string, string> = {
  cs:    'Computer Science / Software Engineering',
  elec:  'Electrical Engineering',
  mech:  'Mechanical Engineering',
  civil: 'Civil Engineering',
  chem:  'Chemical Engineering',
  aero:  'Aerospace Engineering',
  bio:   'Biomedical Engineering',
  env:   'Environmental Engineering',
}

// Vercel Cron sends GET; we also accept POST for manual triggering
async function handler(req: NextRequest) {
  // Verify cron secret (Vercel Cron sets Authorization: Bearer <CRON_SECRET>)
  const secret =
    req.headers.get('authorization')?.replace('Bearer ', '') ??
    req.headers.get('x-cron-secret')
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const cutoff = new Date(Date.now() - DAYS_WITHOUT_REPLY * 24 * 60 * 60 * 1000)

  // Find posts older than cutoff that have zero non-AI comments
  // (AI-only or truly unanswered)
  const eligiblePosts = await db
    .select({
      id:      posts.id,
      title:   posts.title,
      content: posts.content,
      major:   posts.major,
      job:     posts.job,
    })
    .from(posts)
    .where(
      sql`${posts.createdAt} < ${cutoff}
          AND NOT EXISTS (
            SELECT 1 FROM ${comments}
            WHERE ${comments.postId} = ${posts.id}
              AND ${comments.isAi} = false
          )
          AND NOT EXISTS (
            SELECT 1 FROM ${comments}
            WHERE ${comments.postId} = ${posts.id}
              AND ${comments.isAi} = true
          )`
    )
    .limit(MAX_PER_RUN)

  if (eligiblePosts.length === 0) {
    return NextResponse.json({ replied: 0, message: 'No eligible posts found' })
  }

  const botUserId = await getAiBotUserId()
  const results: Array<{ postId: string; success: boolean; error?: string }> = []

  for (const post of eligiblePosts) {
    try {
      const discipline = MAJOR_LABELS[post.major] ?? post.major
      const roleContext = post.job && post.job !== 'All Roles' ? `\nRole context: ${post.job}` : ''

      const prompt = [
        `Forum thread in the ${discipline} community on EngyNation.`,
        `Title: "${post.title}"`,
        `Post: ${post.content.slice(0, 500)}${post.content.length > 500 ? '...' : ''}`,
        roleContext,
        `\nThis post has had no replies after ${DAYS_WITHOUT_REPLY} days. Write a helpful, specific reply.`,
      ].filter(Boolean).join('\n')

      const aiText = await generateText(prompt, FORUM_REPLY_SYSTEM_PROMPT)

      await db.insert(comments).values({
        postId:  post.id,
        userId:  botUserId,
        content: aiText,
        isAi:    true,
      })

      results.push({ postId: post.id, success: true })
      console.log(`[cron/ai-replies] Replied to post ${post.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[cron/ai-replies] Failed for post ${post.id}: ${msg}`)
      results.push({ postId: post.id, success: false, error: msg })
    }
  }

  const replied = results.filter(r => r.success).length
  return NextResponse.json({ replied, total: eligiblePosts.length, results })
}

export const GET  = handler
export const POST = handler
