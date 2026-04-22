'use client'

import { useState } from 'react'

interface Props {
  defaultTab: 'login' | 'register'
  onClose: () => void
}

export default function AuthModal({ defaultTab, onClose }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [regType, setRegType] = useState<'student' | 'professional' | 'recent'>('student')

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modal-logo">
            <div className="modal-logo-mark">⚙️</div>
            <h2>Eng<span>Hub</span></h2>
          </div>
          <div className="auth-tabs">
            <div className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</div>
            <div className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Register</div>
          </div>

          {/* LOGIN */}
          <div className={`auth-form${tab === 'login' ? ' active' : ''}`}>
            <div id="login-alert" className="alert error"></div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@university.edu" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Sign In →</button>
          </div>

          {/* REGISTER */}
          <div className={`auth-form${tab === 'register' ? ' active' : ''}`}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" type="text" placeholder="Alex" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" type="text" placeholder="Johnson" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@university.edu" />
            </div>
            <div className="form-group">
              <label className="form-label">I am a…</label>
              <select className="form-input form-select" value={regType} onChange={e => setRegType(e.target.value as typeof regType)}>
                <option value="student">Student</option>
                <option value="professional">Working Professional</option>
                <option value="recent">Recent Graduate</option>
              </select>
            </div>
            {regType !== 'professional' ? (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Year in College</label>
                  <select className="form-input form-select">
                    <option>Freshman</option><option>Sophomore</option><option>Junior</option>
                    <option>Senior</option><option>Graduate Student</option><option>PhD Student</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">University</label>
                  <input className="form-input" type="text" placeholder="e.g. Univ. of Kentucky" />
                </div>
              </div>
            ) : (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <select className="form-input form-select">
                    <option>0–1 years</option><option>1–3 years</option><option>3–5 years</option>
                    <option>5–10 years</option><option>10+ years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Company</label>
                  <input className="form-input" type="text" placeholder="e.g. SpaceX (optional)" />
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Engineering Major</label>
              <select className="form-input form-select">
                <option value="">Select your major…</option>
                <option value="cs">Computer Science / Software</option>
                <option value="elec">Electrical Engineering</option>
                <option value="mech">Mechanical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="chem">Chemical Engineering</option>
                <option value="aero">Aerospace Engineering</option>
                <option value="bio">Biomedical Engineering</option>
                <option value="env">Environmental Engineering</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="min. 6 chars" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm</label>
                <input className="form-input" type="password" placeholder="repeat" />
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Create Account →</button>
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}
