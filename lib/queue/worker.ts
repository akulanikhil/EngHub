import { redis, QUEUE_KEY, FAILED_KEY, DEAD_KEY, METRICS_KEY } from './client'
import { db } from '@/lib/db'
import { salaries, salaryAggregates } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import type { Job } from './jobs'

// ── Helpers ──────────────────────────────────────────────────────

function yoeBucket(yoe: number): string {
  if (yoe <= 2)  return '0-2'
  if (yoe <= 5)  return '2-5'
  if (yoe <= 10) return '5-10'
  return '10+'
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (p / 100) * (sorted.length - 1)
  const lo  = Math.floor(idx)
  const hi  = Math.ceil(idx)
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

// ── Job handlers ─────────────────────────────────────────────────

async function handleComputeSalaryAggregates(
  payload: { role: string; company?: string }
) {
  const { role, company } = payload

  // Fetch matching salaries
  const rows = await db
    .select({ base: salaries.base, yoe: salaries.yoe, company: salaries.company })
    .from(salaries)
    .where(
      company
        ? sql`${salaries.role} = ${role} AND ${salaries.company} = ${company}`
        : sql`${salaries.role} = ${role}`
    )

  if (rows.length === 0) return

  // Group by yoe_bucket
  const buckets = new Map<string, number[]>()
  buckets.set('all', [])

  for (const row of rows) {
    const bucket = yoeBucket(row.yoe)
    if (!buckets.has(bucket)) buckets.set(bucket, [])
    buckets.get(bucket)!.push(row.base)
    buckets.get('all')!.push(row.base)
  }

  for (const [bucket, values] of buckets) {
    const sorted = [...values].sort((a, b) => a - b)
    const avg    = sorted.reduce((a, b) => a + b, 0) / sorted.length

    const upsertData = {
      role,
      company:      company ?? null,
      yoeBucket:    bucket === 'all' ? null : bucket,
      p50:          String(percentile(sorted, 50).toFixed(2)),
      p75:          String(percentile(sorted, 75).toFixed(2)),
      p90:          String(percentile(sorted, 90).toFixed(2)),
      avg:          String(avg.toFixed(2)),
      count:        sorted.length,
      lastUpdated:  new Date(),
    }

    // Upsert — Drizzle doesn't have onConflict().merge() without a unique index,
    // so we delete-then-insert for simplicity (replace with proper upsert once
    // a unique index is added on (role, company, yoe_bucket))
    await db.delete(salaryAggregates).where(
      sql`role = ${role}
        AND (company IS NOT DISTINCT FROM ${company ?? null})
        AND (yoe_bucket IS NOT DISTINCT FROM ${bucket === 'all' ? null : bucket})`
    )
    await db.insert(salaryAggregates).values(upsertData)
  }

  // Track throughput metric
  await redis.hincrby(METRICS_KEY, 'aggregates_computed', 1)
}

async function handleDetectOutliers(payload: { salaryId: string }) {
  const { salaryId } = payload

  const [target] = await db
    .select()
    .from(salaries)
    .where(eq(salaries.id, salaryId))
    .limit(1)

  if (!target) return

  // Pull existing salaries for the same role
  const peers = await db
    .select({ base: salaries.base })
    .from(salaries)
    .where(sql`${salaries.role} = ${target.role} AND ${salaries.id} != ${salaryId}`)

  if (peers.length < 5) return  // not enough data to detect outliers

  const values = peers.map(p => p.base)
  const mean   = values.reduce((a, b) => a + b, 0) / values.length
  const stdDev = Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length)

  const zScore = Math.abs((target.base - mean) / stdDev)

  if (zScore > 3) {
    // Flag or soft-delete — for now just log; in prod would mark the row
    console.warn(`[outlier] salary ${salaryId} z-score=${zScore.toFixed(2)} role=${target.role}`)
    await redis.hincrby(METRICS_KEY, 'outliers_flagged', 1)
  }
}

async function handleRecomputeRoleStats(payload: { role: string }) {
  // Recompute across all companies + all yoe buckets for a role
  await handleComputeSalaryAggregates({ role: payload.role })
}

// ── Main worker loop ─────────────────────────────────────────────
// Called by the /api/worker/run route (triggered by cron or QStash).

export async function runWorker(maxJobs = 10): Promise<{ processed: number; failed: number }> {
  let processed = 0
  let failed    = 0

  for (let i = 0; i < maxJobs; i++) {
    // Non-blocking pop
    const raw = await redis.rpop(QUEUE_KEY)
    if (!raw) break  // queue empty

    let job: Job
    try {
      job = JSON.parse(raw as string) as Job
    } catch {
      failed++
      continue
    }

    job.attempts++

    try {
      switch (job.type) {
        case 'compute_salary_aggregates':
          await handleComputeSalaryAggregates(job.payload)
          break
        case 'detect_outliers':
          await handleDetectOutliers(job.payload)
          break
        case 'recompute_role_stats':
          await handleRecomputeRoleStats(job.payload)
          break
        default:
          console.warn('[worker] unknown job type:', (job as Job).type)
      }
      processed++
      await redis.hincrby(METRICS_KEY, 'jobs_processed', 1)
    } catch (err) {
      console.error(`[worker] job ${job.id} failed (attempt ${job.attempts}):`, err)
      await redis.hincrby(METRICS_KEY, 'jobs_failed', 1)

      if (job.attempts >= job.maxAttempts) {
        // Move to dead letter queue
        await redis.lpush(DEAD_KEY, JSON.stringify(job))
        failed++
      } else {
        // Re-queue for retry
        await redis.lpush(FAILED_KEY, JSON.stringify(job))
        failed++
      }
    }
  }

  return { processed, failed }
}
