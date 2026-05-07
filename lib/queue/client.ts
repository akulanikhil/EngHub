import { Redis } from '@upstash/redis'

// Upstash Redis client — serverless-safe, no persistent connections
export const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const QUEUE_KEY    = 'enghub:jobs:pending'
export const FAILED_KEY   = 'enghub:jobs:failed'
export const DEAD_KEY     = 'enghub:jobs:dead'     // exceeded maxAttempts
export const METRICS_KEY  = 'enghub:metrics'
