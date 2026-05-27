'use client'

import Link from 'next/link'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
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
        <SignedOut>
          <div style={{ display: 'flex', gap: 8 }}>
            <SignInButton mode="modal">
              <button className="btn btn-ghost btn-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-sm">Join Free →</button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/forum" className="btn btn-ghost btn-sm">Forum</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </nav>
  )
}
