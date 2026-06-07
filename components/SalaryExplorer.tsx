'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'

// ── Types ──────────────────────────────────────────────────────────────────

interface SalaryRow {
  id: string
  role: string
  company: string
  base: number
  bonus: number | null
  equity: number | null
  yoe: number
  location: string
  createdAt: string
}

interface AggregateRow {
  role: string
  yoeBucket: string | null
  p50: string
  p75: string
  p90: string
  avg: string
  count: number
}

// ── Constants ──────────────────────────────────────────────────────────────

const MAJORS = [
  { value: 'all',   label: 'All Disciplines' },
  { value: 'cs',    label: 'Computer Science' },
  { value: 'elec',  label: 'Electrical Eng.' },
  { value: 'mech',  label: 'Mechanical Eng.' },
  { value: 'civil', label: 'Civil Eng.' },
  { value: 'chem',  label: 'Chemical Eng.' },
  { value: 'aero',  label: 'Aerospace Eng.' },
  { value: 'bio',   label: 'Biomedical Eng.' },
  { value: 'env',   label: 'Environmental Eng.' },
]

const YOE_BUCKETS = ['0-2', '2-5', '5-10', '10+']

// Common roles by discipline for the submit form
const ROLE_SUGGESTIONS: Record<string, string[]> = {
  cs:    ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'ML / AI Engineer', 'Data Engineer', 'DevOps / SRE', 'Product Manager', 'Engineering Manager'],
  elec:  ['IC Design Engineer', 'Embedded Systems Engineer', 'FPGA Engineer', 'RF Engineer', 'Hardware Engineer', 'Power Systems Engineer'],
  mech:  ['Mechanical Engineer', 'Robotics Engineer', 'Automotive Engineer', 'Manufacturing Engineer', 'Structural Engineer', 'Thermal Engineer'],
  civil: ['Structural Engineer', 'Geotechnical Engineer', 'Transportation Engineer', 'Environmental Engineer', 'Construction Manager'],
  chem:  ['Process Engineer', 'Chemical Engineer', 'Petroleum Engineer', 'Materials Engineer', 'Biochemical Engineer'],
  aero:  ['Aerospace Engineer', 'Propulsion Engineer', 'Avionics Engineer', 'Systems Engineer', 'Flight Test Engineer'],
  bio:   ['Medical Device Engineer', 'Bioinformatics Engineer', 'Clinical Engineer', 'Regulatory Affairs Engineer', 'Tissue Engineer'],
  env:   ['Environmental Engineer', 'Water Resources Engineer', 'Air Quality Engineer', 'Sustainability Engineer', 'Environmental Consultant'],
  all:   ['Software Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Chemical Engineer', 'Systems Engineer'],
}

function fmt(n: number | string) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SalaryExplorer() {
  const { isLoaded, isSignedIn } = useUser()

  // Filter / view state
  const [filterMajor, setFilterMajor] = useState('all')
  const [filterRole, setFilterRole]   = useState('')

  // Data
  const [rows, setRows]           = useState<SalaryRow[]>([])
  const [aggregates, setAggregates] = useState<AggregateRow[]>([])
  const [loadingRows, setLoadingRows] = useState(true)

  // Submit form
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({
    role: '', company: '', base: '', bonus: '', equity: '', yoe: '', location: '',
  })
  const [formMajor, setFormMajor] = useState('cs')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch salary rows
  useEffect(() => {
    setLoadingRows(true)
    const params = new URLSearchParams({ limit: '50' })
    fetch(`/api/salaries?${params}`)
      .then(r => r.json())
      .then(j => setRows(j.data ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoadingRows(false))
  }, [])

  // Fetch aggregates when role filter changes
  useEffect(() => {
    if (!filterRole) { setAggregates([]); return }
    fetch(`/api/salaries/aggregates?role=${encodeURIComponent(filterRole)}`)
      .then(r => r.json())
      .then(j => setAggregates(j.data ?? []))
      .catch(() => setAggregates([]))
  }, [filterRole])

  // Derived: filtered rows
  const visibleRows = rows.filter(r => {
    if (filterRole && r.role.toLowerCase() !== filterRole.toLowerCase()) return false
    return true
  })

  // Unique roles in current data
  const rolesInData = Array.from(new Set(rows.map(r => r.role))).sort()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      const payload = {
        role:     form.role.trim(),
        company:  form.company.trim(),
        base:     Number(form.base),
        bonus:    form.bonus ? Number(form.bonus) : null,
        equity:   form.equity ? Number(form.equity) : null,
        yoe:      Number(form.yoe),
        location: form.location.trim(),
      }
      const r = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = await r.json()
      if (!r.ok) {
        const detail = j.details?.join(', ') ?? j.error ?? 'Submission failed'
        setSubmitMsg({ type: 'error', text: detail })
      } else {
        setSubmitMsg({ type: 'success', text: 'Thanks! Your salary data has been submitted anonymously.' })
        setForm({ role: '', company: '', base: '', bonus: '', equity: '', yoe: '', location: '' })
        setShowForm(false)
        // Refresh rows
        fetch('/api/salaries?limit=50').then(r=>r.json()).then(j=>setRows(j.data??[]))
      }
    } catch {
      setSubmitMsg({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const roleSuggestions = ROLE_SUGGESTIONS[formMajor] ?? ROLE_SUGGESTIONS.all

  // Aggregates sorted by yoe bucket order
  const bucketOrder: Record<string, number> = { 'null': 0, '0-2': 1, '2-5': 2, '5-10': 3, '10+': 4 }
  const sortedAggs = [...aggregates]
    .filter(a => a.yoeBucket !== null)
    .sort((a, b) => (bucketOrder[a.yoeBucket ?? 'null'] ?? 0) - (bucketOrder[b.yoeBucket ?? 'null'] ?? 0))

  return (
    <section className="salary-page">
      {/* ── Header ── */}
      <div className="salary-hero">
        <h1>Salary Explorer</h1>
        <p>Real compensation data submitted anonymously by engineers. See what your peers are earning — and contribute your own.</p>
        {isLoaded && isSignedIn && (
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ Submit Your Salary'}
          </button>
        )}
        {isLoaded && !isSignedIn && (
          <SignInButton mode="modal">
            <button className="btn btn-primary">Sign in to Submit Your Salary</button>
          </SignInButton>
        )}
      </div>

      {/* ── Submit form ── */}
      {showForm && (
        <div className="salary-form-wrap">
          <form className="salary-form" onSubmit={handleSubmit}>
            <h3>Submit Salary Data</h3>
            <p className="salary-form-note">All submissions are anonymous. We never share individual data.</p>

            {/* Discipline selector for role suggestions */}
            <div className="salary-form-row">
              <label>Your Discipline</label>
              <div className="salary-major-pills">
                {MAJORS.filter(m => m.value !== 'all').map(m => (
                  <button type="button" key={m.value}
                    className={`salary-pill${formMajor === m.value ? ' active' : ''}`}
                    onClick={() => setFormMajor(m.value)}
                  >{m.label}</button>
                ))}
              </div>
            </div>

            <div className="salary-form-grid">
              <div className="salary-field">
                <label>Job Title *</label>
                <input list="role-suggestions" value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Software Engineer" required />
                <datalist id="role-suggestions">
                  {roleSuggestions.map(r => <option key={r} value={r} />)}
                </datalist>
              </div>
              <div className="salary-field">
                <label>Company *</label>
                <input value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="e.g. Google" required />
              </div>
              <div className="salary-field">
                <label>Base Salary ($/yr) *</label>
                <input type="number" value={form.base}
                  onChange={e => setForm(f => ({ ...f, base: e.target.value }))}
                  placeholder="e.g. 120000" min={20000} max={1000000} required />
              </div>
              <div className="salary-field">
                <label>Bonus ($/yr, optional)</label>
                <input type="number" value={form.bonus}
                  onChange={e => setForm(f => ({ ...f, bonus: e.target.value }))}
                  placeholder="e.g. 15000" min={0} />
              </div>
              <div className="salary-field">
                <label>Annual Equity ($/yr, optional)</label>
                <input type="number" value={form.equity}
                  onChange={e => setForm(f => ({ ...f, equity: e.target.value }))}
                  placeholder="e.g. 25000" min={0} />
              </div>
              <div className="salary-field">
                <label>Years of Experience *</label>
                <input type="number" value={form.yoe}
                  onChange={e => setForm(f => ({ ...f, yoe: e.target.value }))}
                  placeholder="e.g. 3" min={0} max={50} required />
              </div>
              <div className="salary-field salary-field-wide">
                <label>Location *</label>
                <input value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. San Francisco, CA" required />
              </div>
            </div>

            {submitMsg && (
              <p className={`salary-submit-msg ${submitMsg.type}`}>{submitMsg.text}</p>
            )}

            <div className="salary-form-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Anonymously'}
              </button>
            </div>
          </form>
        </div>
      )}

      {submitMsg?.type === 'success' && !showForm && (
        <div className="salary-banner success">{submitMsg.text}</div>
      )}

      {/* ── Filters ── */}
      <div className="salary-filters">
        <div className="salary-filter-group">
          <span className="salary-filter-label">Filter by role:</span>
          <div className="salary-role-pills">
            <button className={`salary-pill${!filterRole ? ' active' : ''}`} onClick={() => setFilterRole('')}>All</button>
            {rolesInData.map(r => (
              <button key={r} className={`salary-pill${filterRole === r ? ' active' : ''}`}
                onClick={() => setFilterRole(filterRole === r ? '' : r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Aggregate progression chart ── */}
      {filterRole && sortedAggs.length > 0 && (
        <div className="salary-agg-section">
          <h3>Salary Progression — {filterRole}</h3>
          <p className="salary-agg-note">Median (p50), 75th percentile, and 90th percentile base salary by experience</p>
          <div className="salary-agg-grid">
            {sortedAggs.map(agg => (
              <div key={agg.yoeBucket} className="salary-agg-card">
                <div className="salary-agg-bucket">{agg.yoeBucket} yrs</div>
                <div className="salary-agg-stat">
                  <span className="salary-agg-label">Median</span>
                  <span className="salary-agg-value">{fmt(agg.p50)}</span>
                </div>
                <div className="salary-agg-stat">
                  <span className="salary-agg-label">75th %ile</span>
                  <span className="salary-agg-value accent">{fmt(agg.p75)}</span>
                </div>
                <div className="salary-agg-stat">
                  <span className="salary-agg-label">90th %ile</span>
                  <span className="salary-agg-value accent2">{fmt(agg.p90)}</span>
                </div>
                <div className="salary-agg-count">{agg.count} report{agg.count !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Individual rows table ── */}
      <div className="salary-table-section">
        <div className="salary-table-header">
          <h3>{filterRole ? `${filterRole} Reports` : 'All Salary Reports'}</h3>
          <span className="salary-count">{visibleRows.length} report{visibleRows.length !== 1 ? 's' : ''}</span>
        </div>

        {loadingRows ? (
          <div className="salary-empty">Loading…</div>
        ) : visibleRows.length === 0 ? (
          <div className="salary-empty">
            <p>No salary data yet{filterRole ? ` for ${filterRole}` : ''}.</p>
            <p>Be the first to contribute — it helps everyone in the community negotiate better.</p>
            {isLoaded && isSignedIn
              ? <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Submit Your Salary</button>
              : <SignInButton mode="modal"><button className="btn btn-primary btn-sm">Sign in to Submit</button></SignInButton>
            }
          </div>
        ) : (
          <div className="salary-table-wrap">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Base</th>
                  <th>Bonus</th>
                  <th>Equity / yr</th>
                  <th>YOE</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(r => (
                  <tr key={r.id}>
                    <td>{r.role}</td>
                    <td>{r.company}</td>
                    <td className="salary-num">{fmt(r.base)}</td>
                    <td className="salary-num">{r.bonus ? fmt(r.bonus) : '—'}</td>
                    <td className="salary-num">{r.equity ? fmt(r.equity) : '—'}</td>
                    <td className="salary-num">{r.yoe}</td>
                    <td>{r.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
