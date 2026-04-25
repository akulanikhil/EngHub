'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-white">
        <span>⚙️</span>
        Eng<span className="text-indigo-400">Hub</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link href="#demo" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Demo</Link>
        <Link href="#features" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Features</Link>
        <Link href="#majors" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Majors</Link>
        <Link href="#about" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="text-sm text-[var(--text-muted)] hover:text-white px-4 py-2 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Join Free →
        </Link>
      </div>
    </nav>
  )
}
