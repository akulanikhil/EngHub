import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Clerk sends webhook events signed with CLERK_WEBHOOK_SECRET.
// Verify the signature with svix before trusting any payload.

interface ClerkEmailAddress {
  email_address: string
  id: string
}

interface ClerkUserCreatedEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    email_addresses: ClerkEmailAddress[]
    primary_email_address_id: string
    public_metadata: {
      major?: string
      grad_year?: number
      role?: string
    }
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook/clerk] CLERK_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Read raw body for signature verification
  const payload = await req.text()
  const headers = {
    'svix-id':        req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  }

  let event: ClerkUserCreatedEvent
  try {
    const wh = new Webhook(secret)
    event = wh.verify(payload, headers) as ClerkUserCreatedEvent
  } catch (err) {
    console.error('[webhook/clerk] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event

  if (type === 'user.created') {
    const primaryEmail = data.email_addresses.find(
      e => e.id === data.primary_email_address_id
    )?.email_address

    if (!primaryEmail) {
      return NextResponse.json({ error: 'No primary email' }, { status: 400 })
    }

    const major = (data.public_metadata?.major ?? 'cs') as
      | 'cs' | 'elec' | 'mech' | 'civil' | 'chem' | 'aero' | 'bio' | 'env'

    await db.insert(users).values({
      clerkId:  data.id,
      email:    primaryEmail,
      major,
      gradYear: data.public_metadata?.grad_year ?? null,
      role:     data.public_metadata?.role ?? null,
    }).onConflictDoNothing()

    console.log(`[webhook/clerk] created user ${data.id} (${primaryEmail})`)
  }

  if (type === 'user.updated') {
    const { major, grad_year, role } = data.public_metadata ?? {}
    if (major) {
      await db
        .update(users)
        .set({
          major: major as typeof users.$inferInsert['major'],
          gradYear: grad_year ?? null,
          role: role ?? null,
        })
        .where(eq(users.clerkId, data.id))
    }
  }

  if (type === 'user.deleted') {
    await db.delete(users).where(eq(users.clerkId, data.id))
    console.log(`[webhook/clerk] deleted user ${data.id}`)
  }

  return NextResponse.json({ received: true })
}
