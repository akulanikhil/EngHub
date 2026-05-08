import { NextRequest, NextResponse } from 'next/server'
import { runWorker } from '@/lib/queue/worker'

// POST /api/worker/run
// Triggered by:
//   - Vercel Cron (cron.json) every minute
//   - Upstash QStash webhook on job enqueue
//   - Manual call during development
//
// Secured by WORKER_SECRET to prevent unauthorized triggering.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-worker-secret')
  if (secret !== process.env.WORKER_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result = await runWorker(10)
  return NextResponse.json(result)
}

// GET — health check (no auth required)
export async function GET() {
  return NextResponse.json({ status: 'ok', queue: 'enghub:jobs:pending' })
}
