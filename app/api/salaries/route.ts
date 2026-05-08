import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, salaries } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { validateAndNormalize } from '@/lib/salary/normalize'
import { enqueueSalaryAggregates, enqueueOutlierDetection } from '@/lib/queue/enqueue'

// GET /api/salaries — recent submissions (paginated)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role    = searchParams.get('role')
  const page    = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit   = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const offset  = (page - 1) * limit

  const rows = await db
    .select({
      id:        salaries.id,
      role:      salaries.role,
      company:   salaries.company,
      base:      salaries.base,
      bonus:     salaries.bonus,
      equity:    salaries.equity,
      yoe:       salaries.yoe,
      location:  salaries.location,
      createdAt: salaries.createdAt,
    })
    .from(salaries)
    .where(role ? eq(salaries.role, role) : undefined)
    .orderBy(desc(salaries.createdAt))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, page, limit })
}

// POST /api/salaries — submit a new salary report
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const validation = validateAndNormalize(body)

  if (!validation.ok) {
    return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 422 })
  }

  // Resolve internal user id from Clerk id
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const [inserted] = await db
    .insert(salaries)
    .values({ userId: user.id, ...validation.data! })
    .returning({ id: salaries.id, role: salaries.role, company: salaries.company })

  // Enqueue async pipeline jobs — fire and forget
  await Promise.all([
    enqueueSalaryAggregates(inserted.role, inserted.company),
    enqueueSalaryAggregates(inserted.role),   // also recompute all-company aggregate
    enqueueOutlierDetection(inserted.id),
  ])

  return NextResponse.json({ data: inserted }, { status: 201 })
}
