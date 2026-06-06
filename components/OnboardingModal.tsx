'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const MAJORS = [
  { value: 'cs',    label: 'Computer Science',       icon: '💻' },
  { value: 'elec',  label: 'Electrical Eng.',         icon: '⚡' },
  { value: 'mech',  label: 'Mechanical Eng.',         icon: '⚙️' },
  { value: 'civil', label: 'Civil Eng.',               icon: '🏗️' },
  { value: 'chem',  label: 'Chemical Eng.',            icon: '🧪' },
  { value: 'aero',  label: 'Aerospace Eng.',           icon: '🚀' },
  { value: 'bio',   label: 'Biomedical Eng.',          icon: '🧬' },
  { value: 'env',   label: 'Environmental Eng.',       icon: '🌿' },
]

const SKIP_KEY = 'engynation_onboarding_skipped'

export default function OnboardingModal() {
  const { isLoaded, isSignedIn } = useUser()
  const [show, setShow]           = useState(false)
  const [selected, setSelected]   = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    // Don't show if user already skipped this session
    if (sessionStorage.getItem(SKIP_KEY)) return

    fetch('/api/me')
      .then(r => r.json())
      .then(j => {
        if (j.data && j.data.major === null) setShow(true)
      })
      .catch(() => {})
  }, [isLoaded, isSignedIn])

  function skip() {
    sessionStorage.setItem(SKIP_KEY, '1')
    setShow(false)
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      const r = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ major: selected }),
      })
      if (!r.ok) throw new Error('Failed to save')
      setShow(false)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div className="onboarding-backdrop" onClick={skip}>
      <div className="onboarding-modal" onClick={e => e.stopPropagation()}>
        <div className="onboarding-header">
          <h2>What&apos;s your engineering discipline?</h2>
          <p>We&apos;ll personalize the forum and salary data for you. You can change this later.</p>
        </div>

        <div className="onboarding-grid">
          {MAJORS.map(m => (
            <button
              key={m.value}
              className={`onboarding-major-btn${selected === m.value ? ' selected' : ''}`}
              onClick={() => setSelected(m.value)}
            >
              <span className="onboarding-icon">{m.icon}</span>
              <span className="onboarding-label">{m.label}</span>
            </button>
          ))}
        </div>

        {error && <p className="onboarding-error">{error}</p>}

        <div className="onboarding-actions">
          <button className="btn btn-ghost btn-sm" onClick={skip} disabled={saving}>
            Skip for now
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={save}
            disabled={!selected || saving}
          >
            {saving ? 'Saving…' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
