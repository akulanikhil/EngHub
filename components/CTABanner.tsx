'use client'

import { useState } from 'react'
import AuthModal from './AuthModal'

export default function CTABanner() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <div className="cta-banner">
        <h2>Ready to find your engineering community?</h2>
        <p>Join thousands of engineering students and professionals sharing real career insights.</p>
        <div className="cta-btns">
          <button className="btn btn-primary btn-lg" onClick={() => setModal(true)}>Create Free Account →</button>
          <a href="/forum" className="btn btn-ghost btn-lg">Preview the Forum</a>
        </div>
      </div>
      {modal && <AuthModal defaultTab="register" onClose={() => setModal(false)} />}
    </>
  )
}
