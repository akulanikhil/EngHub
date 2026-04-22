'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [modalTab, setModalTab] = useState<'login' | 'register' | null>(null)

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">⚙️</div>
          Eng<span>Hub</span>
        </Link>
        <div className="nav-links">
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#majors" className="nav-link">Majors</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <div className="nav-right">
          <div className="nav-auth-logged-out" style={{ display: 'flex' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setModalTab('login')}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => setModalTab('register')}>Join Free →</button>
          </div>
        </div>
      </nav>
      {modalTab && <AuthModal defaultTab={modalTab} onClose={() => setModalTab(null)} />}
    </>
  )
}
