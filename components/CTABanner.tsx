'use client'

import { SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function CTABanner() {
  return (
    <div className="cta-banner">
      <h2>Ready to find your engineering community?</h2>
      <p>Join thousands of engineering students and professionals sharing real career insights.</p>
      <div className="cta-btns">
        <SignUpButton mode="modal">
          <button className="btn btn-primary btn-lg">Create Free Account →</button>
        </SignUpButton>
        <Link href="/forum" className="btn btn-ghost btn-lg">Preview the Forum</Link>
      </div>
    </div>
  )
}
