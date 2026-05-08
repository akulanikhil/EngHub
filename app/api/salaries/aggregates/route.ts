import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { salaryAggregates } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

// GET /api/salaries/aggregates?role=Software+Engineer&company=Google&yoe_bucket=2-5
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role       = searchParams.get('role')
  const company    = searchParams.get('company')
  const yoeBucket  = searchParams.get('yoe_bucket')

  if (!role) return NextResponse.json({ error: 'role is required' }, { status: 400 })

  const conditions = [sql`${salaryAggregates.role} = ${role}`]

  if (company)   conditions.push(sql`${salaryAggregates.company} = ${company}`)
  else           conditions.push(sql`${salaryAggregates.company} IS NULL`)

  if (yoeBucket) conditions.push(sql`${salaryAggregates.yoeBucket} = ${yoeBucket}`)

  const rows = await db
    .select()
    .from(salaryAggregates)
    .where(sql.join(conditions, sql` AND `))
    .orderBy(salaryAggregates.yoeBucket)

  return NextResponse.json({ data: rows })
}
