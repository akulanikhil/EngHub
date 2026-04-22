'use client'

import { useState } from 'react'
import AuthModal from './AuthModal'

export default function Hero() {
  const [modalTab, setModalTab] = useState<'login' | 'register' | null>(null)

  return (
    <>
      <section className="hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-badge">
          <div className="hero-badge-dot"></div>
          Now in Beta — Join the waitlist
        </div>
        <h1 className="hero-title">
          The Career Community<br />
          <span className="line-accent">Built for Engineers</span>
        </h1>
        <p className="hero-sub">
          Discuss salaries, share interview experiences, and connect with professionals across every engineering discipline — all in one place.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={() => setModalTab('register')}>Join EngHub Free →</button>
          <a href="#demo" className="btn btn-ghost btn-lg">Watch Demo ↓</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">8+</div>
            <div className="hero-stat-label">Engineering Majors</div>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">80+</div>
            <div className="hero-stat-label">Career Tracks</div>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">AI</div>
            <div className="hero-stat-label">Career Advisor Built-in</div>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">Free</div>
            <div className="hero-stat-label">Always for Students</div>
          </div>
        </div>
      </section>
      {modalTab && <AuthModal defaultTab={modalTab} onClose={() => setModalTab(null)} />}
    </>
  )
}
