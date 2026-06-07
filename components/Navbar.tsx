'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">
        <div className="nav-logo-mark">
          <Image src="/images/logo.png" alt="EngyNation" width={48} height={48} style={{ objectFit: 'contain' }} />
        </div>
        Engy<span>Nation</span>
      </Link>
      <div className="nav-links">
        <a href="#demo" className="nav-link">Demo</a>
        <a href="#features" className="nav-link">Features</a>
        <a href="#majors" className="nav-link">Majors</a>
        <Link href="/salary" className="nav-link">Salaries</Link>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </div>
      <div className="nav-right">
          <ThemeToggle />
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
