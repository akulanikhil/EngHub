'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    // Check localStorage first; fall back to device preference
    const saved = localStorage.getItem('theme')
    const prefersLight =
      saved === 'light' ||
      (saved === null && window.matchMedia('(prefers-color-scheme: light)').matches)

    setLight(prefersLight)
    if (prefersLight) {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }

    // Listen for OS-level changes only if the user hasn't set a manual preference
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') !== null) return // manual override wins
      setLight(e.matches)
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'light')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function toggle() {
    const next = !light
    setLight(next)
    if (next) {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={light ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
    >
      {light ? '🌙' : '☀️'}
    </button>
  )
}
