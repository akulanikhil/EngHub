import { nanoid } from 'nanoid'
import { redis, QUEUE_KEY } from './client'
import type { Job, JobType } from './jobs'

type JobPayload<T extends JobType> = Extract<Job, { type: T }>['payload']

export async function enqueue<T extends JobType>(
  type: T,
  payload: JobPayload<T>,
  options: { maxAttempts?: number } = {}
): Promise<string> {
  const job: Job = {
    id:          nanoid(),
    type,
    payload,
    createdAt:   new Date().toISOString(),
    attempts:    0,
    maxAttempts: options.maxAttempts ?? 3,
  } as Job

  // LPUSH so workers BRPOP from the right (FIFO)
  await redis.lpush(QUEUE_KEY, JSON.stringify(job))
  return job.id
}

// Convenience helpers called by API routes
export const enqueueSalaryAggregates = (role: string, company?: string) =>
  enqueue('compute_salary_aggregates', { role, ...(company ? { company } : {}) })

export const enqueueOutlierDetection = (salaryId: string) =>
  enqueue('detect_outliers', { salaryId })

export const enqueueRoleStats = (role: string) =>
  enqueue('recompute_role_stats', { role })
